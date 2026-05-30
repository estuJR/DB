const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todas las ventas con JOIN
router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT v.id_venta, v.fecha_hora, v.total, v.estado,
           c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
           e.nombre AS empleado_nombre, e.apellido AS empleado_apellido
    FROM ventas v
    JOIN clientes  c ON v.id_cliente  = c.id_cliente
    JOIN empleados e ON v.id_empleado = e.id_empleado
    ORDER BY v.fecha_hora DESC
  `);
  res.json(rows);
});

// GET detalle de una venta con JOIN
router.get('/:id', async (req, res) => {
  const [venta] = await db.query(`
    SELECT v.*, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
           e.nombre AS empleado_nombre
    FROM ventas v
    JOIN clientes  c ON v.id_cliente  = c.id_cliente
    JOIN empleados e ON v.id_empleado = e.id_empleado
    WHERE v.id_venta = ?
  `, [req.params.id]);

  const [detalle] = await db.query(`
    SELECT d.*, p.nombre AS producto_nombre
    FROM detalle_venta d
    JOIN productos p ON d.id_producto = p.id_producto
    WHERE d.id_venta = ?
  `, [req.params.id]);

  res.json({ venta: venta[0], detalle });
});

// POST crear venta (transacción explícita con ROLLBACK)
router.post('/', async (req, res) => {
  const { id_cliente, id_empleado, items } = req.body;

  if (!id_cliente || !id_empleado || !items || items.length === 0)
    return res.status(400).json({ error: 'Faltan datos de la venta' });

  const conn = await db.getConnection();
  try {
    await conn.query('START TRANSACTION');

    // Calcular total y verificar stock
    let total = 0;
    for (const item of items) {
      const [prod] = await conn.query(
        'SELECT precio_unitario, stock FROM productos WHERE id_producto = ?',
        [item.id_producto]
      );
      if (!prod[0]) throw new Error(`Producto ${item.id_producto} no existe`);
      if (prod[0].stock < item.cantidad) throw new Error(`Stock insuficiente para producto ${item.id_producto}`);
      total += prod[0].precio_unitario * item.cantidad;
    }

    // Insertar venta
    const [result] = await conn.query(
      'INSERT INTO ventas (total, estado, id_cliente, id_empleado) VALUES (?, ?, ?, ?)',
      [total, 'completada', id_cliente, id_empleado]
    );
    const id_venta = result.insertId;

    // Insertar detalle y descontar stock
    for (const item of items) {
      const [prod] = await conn.query(
        'SELECT precio_unitario FROM productos WHERE id_producto = ?',
        [item.id_producto]
      );
      await conn.query(
        'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario_venta) VALUES (?, ?, ?, ?)',
        [id_venta, item.id_producto, item.cantidad, prod[0].precio_unitario]
      );
      await conn.query(
        'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
        [item.cantidad, item.id_producto]
      );
    }

    await conn.query('COMMIT');
    res.json({ mensaje: 'Venta creada', id_venta, total });

  } catch (error) {
    await conn.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
});

// PATCH anular venta — SP sp_anular_venta (transacción + ROLLBACK dentro del SP)
router.patch('/:id/anular', async (req, res) => {
  try {
    await db.query('CALL sp_anular_venta(?, @resultado)', [req.params.id]);
    const [[result]] = await db.query('SELECT @resultado AS resultado');
    if (result.resultado.startsWith('ERROR'))
      return res.status(400).json({ error: result.resultado.replace('ERROR: ', '') });
    res.json({ mensaje: result.resultado.replace('OK: ', '') });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST venta simple con SP sp_crear_venta (un solo producto)
router.post('/sp', async (req, res) => {
  const { id_cliente, id_empleado, id_producto, cantidad } = req.body;
  if (!id_cliente || !id_empleado || !id_producto || !cantidad)
    return res.status(400).json({ error: 'Faltan datos' });
  try {
    await db.query('CALL sp_crear_venta(?, ?, ?, ?, @venta_id, @error)',
      [id_cliente, id_empleado, id_producto, cantidad]);
    const [[result]] = await db.query('SELECT @venta_id AS venta_id, @error AS error');
    if (result.error) return res.status(400).json({ error: result.error });
    res.json({ mensaje: 'Venta creada via SP', id_venta: result.venta_id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;