const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM proveedores');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM proveedores WHERE id_proveedor = ?', [req.params.id]);
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const { nombre, telefono, email, direccion } = req.body;
  if (!nombre || !email)
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  const [result] = await db.query(
    'INSERT INTO proveedores (nombre, telefono, email, direccion) VALUES (?, ?, ?, ?)',
    [nombre, telefono, email, direccion]
  );
  res.json({ id_proveedor: result.insertId });
});

router.put('/:id', async (req, res) => {
  const { nombre, telefono, email, direccion } = req.body;
  await db.query(
    'UPDATE proveedores SET nombre=?, telefono=?, email=?, direccion=? WHERE id_proveedor=?',
    [nombre, telefono, email, direccion, req.params.id]
  );
  res.json({ mensaje: 'Proveedor actualizado' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM proveedores WHERE id_proveedor = ?', [req.params.id]);
  res.json({ mensaje: 'Proveedor eliminado' });
});

module.exports = router;