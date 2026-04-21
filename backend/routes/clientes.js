const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM clientes');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [req.params.id]);
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  if (!nombre || !apellido || !email)
    return res.status(400).json({ error: 'Nombre, apellido y email son requeridos' });
  const [result] = await db.query(
    'INSERT INTO clientes (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)',
    [nombre, apellido, email, telefono]
  );
  res.json({ id_cliente: result.insertId });
});

router.put('/:id', async (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  await db.query(
    'UPDATE clientes SET nombre=?, apellido=?, email=?, telefono=? WHERE id_cliente=?',
    [nombre, apellido, email, telefono, req.params.id]
  );
  res.json({ mensaje: 'Cliente actualizado' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM clientes WHERE id_cliente = ?', [req.params.id]);
  res.json({ mensaje: 'Cliente eliminado' });
});

module.exports = router;