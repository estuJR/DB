const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const [rows] = await db.query(
    'SELECT id_empleado, nombre, apellido, cargo, email FROM empleados'
  );
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await db.query(
    'SELECT id_empleado, nombre, apellido, cargo, email FROM empleados WHERE id_empleado = ?',
    [req.params.id]
  );
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const { nombre, apellido, cargo, email, password } = req.body;
  if (!nombre || !email || !password)
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO empleados (nombre, apellido, cargo, email, password_hash) VALUES (?, ?, ?, ?, ?)',
    [nombre, apellido, cargo, email, hash]
  );
  res.json({ id_empleado: result.insertId });
});

router.put('/:id', async (req, res) => {
  const { nombre, apellido, cargo, email } = req.body;
  await db.query(
    'UPDATE empleados SET nombre=?, apellido=?, cargo=?, email=? WHERE id_empleado=?',
    [nombre, apellido, cargo, email, req.params.id]
  );
  res.json({ mensaje: 'Empleado actualizado' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM empleados WHERE id_empleado = ?', [req.params.id]);
  res.json({ mensaje: 'Empleado eliminado' });
});

module.exports = router;