const express = require('express');
const router = express.Router();
const db = require('../db');

// Ventas por empleado (GROUP BY + HAVING)
router.get('/ventas-por-empleado', async (req, res) => {
  const [rows] = await db.query(`
    SELECT e.nombre, e.apellido,
           COUNT(v.id_venta)  AS total_ventas,
           SUM(v.total)       AS monto_total
    FROM empleados e
    JOIN ventas v ON e.id_empleado = v.id_empleado
    GROUP BY e.id_empleado
    HAVING COUNT(v.id_venta) > 0
    ORDER BY monto_total DESC
  `);
  res.json(rows);
});

// Productos más vendidos (GROUP BY + subquery)
router.get('/productos-mas-vendidos', async (req, res) => {
  const [rows] = await db.query(`
    SELECT p.nombre,
           SUM(d.cantidad)               AS unidades_vendidas,
           SUM(d.cantidad * d.precio_unitario_venta) AS ingresos
    FROM detalle_venta d
    JOIN productos p ON d.id_producto = p.id_producto
    WHERE d.id_producto IN (
      SELECT id_producto FROM detalle_venta
      GROUP BY id_producto
      HAVING SUM(cantidad) > 0
    )
    GROUP BY p.id_producto
    ORDER BY unidades_vendidas DESC
    LIMIT 10
  `);
  res.json(rows);
});

// Resumen mensual con CTE
router.get('/resumen-mensual', async (req, res) => {
  const [rows] = await db.query(`
    WITH ventas_mes AS (
      SELECT DATE_FORMAT(fecha_hora, '%Y-%m') AS mes,
             COUNT(*)     AS cantidad_ventas,
             SUM(total)   AS total_ingresos
      FROM ventas
      WHERE estado = 'completada'
      GROUP BY DATE_FORMAT(fecha_hora, '%Y-%m')
    )
    SELECT * FROM ventas_mes
    ORDER BY mes DESC
  `);
  res.json(rows);
});

// Clientes que han comprado (EXISTS)
router.get('/clientes-activos', async (req, res) => {
  const [rows] = await db.query(`
    SELECT c.id_cliente, c.nombre, c.apellido, c.email
    FROM clientes c
    WHERE EXISTS (
      SELECT 1 FROM ventas v WHERE v.id_cliente = c.id_cliente
    )
  `);
  res.json(rows);
});

// Vista de ventas con detalle completo (usa la VIEW vista_ventas_detalle)
router.get('/vista-ventas', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM vista_ventas_detalle ORDER BY id_venta DESC LIMIT 100');
  res.json(rows);
});

// Reporte por empleado — SP sp_reporte_empleado (IN/OUT params)
router.get('/reporte-empleado/:id', async (req, res) => {
  try {
    await db.query('CALL sp_reporte_empleado(?, @ventas, @monto, @error)', [req.params.id]);
    const [[result]] = await db.query(
      'SELECT @ventas AS total_ventas, @monto AS monto_total, @error AS error'
    );
    if (result.error) return res.status(400).json({ error: result.error });
    res.json({ total_ventas: result.total_ventas, monto_total: result.monto_total });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;