const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos (con JOIN a categorias y proveedores)
router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT p.*, c.nombre AS categoria, pr.nombre AS proveedor
    FROM productos p
    JOIN categorias c  ON p.id_categoria = c.id_categoria
    JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
  `);
  res.json(rows);
});

// GET uno
router.get('/:id', async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.*, c.nombre AS categoria, pr.nombre AS proveedor
     FROM productos p
     JOIN categorias c   ON p.id_categoria = c.id_categoria
     JOIN proveedores pr ON p.id_proveedor  = pr.id_proveedor
     WHERE p.id_producto = ?`,
    [req.params.id]
  );
  res.json(rows[0]);
});

// POST crear
router.post('/', async (req, res) => {
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  if (!nombre || !precio_unitario || !id_categoria || !id_proveedor)
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  const [result] = await db.query(
    `INSERT INTO productos (nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, precio_unitario, stock || 0, id_categoria, id_proveedor]
  );
  res.json({ id_producto: result.insertId });
});

// PUT editar
router.put('/:id', async (req, res) => {
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  await db.query(
    `UPDATE productos SET nombre=?, descripcion=?, precio_unitario=?, stock=?,
     id_categoria=?, id_proveedor=? WHERE id_producto=?`,
    [nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor, req.params.id]
  );
  res.json({ mensaje: 'Producto actualizado' });
});

// DELETE eliminar
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM productos WHERE id_producto = ?', [req.params.id]);
  res.json({ mensaje: 'Producto eliminado' });
});

module.exports = router;