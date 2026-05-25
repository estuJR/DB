const express = require('express');
const router  = express.Router();
const db      = require('../db');
const Cliente = require('../models/Cliente');

// GET todos — ORM READ
router.get('/', async (req, res) => {
  try {
    const rows = await Cliente.findAll();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET uno — ORM READ
router.get('/:id', async (req, res) => {
  try {
    const c = await Cliente.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(c);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST crear — SP sp_registrar_cliente
router.post('/', async (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  if (!nombre || !apellido || !email || !telefono)
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  try {
    await db.query('CALL sp_registrar_cliente(?, ?, ?, ?, @out_id, @out_error)',
      [nombre, apellido, email, telefono]);
    const [[result]] = await db.query('SELECT @out_id AS id, @out_error AS error');
    if (result.error) return res.status(400).json({ error: result.error });
    res.json({ id_cliente: result.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT editar — ORM UPDATE
router.put('/:id', async (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  try {
    await Cliente.update(
      { nombre, apellido, email, telefono },
      { where: { id_cliente: req.params.id } }
    );
    res.json({ mensaje: 'Cliente actualizado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE eliminar — ORM DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Cliente.destroy({ where: { id_cliente: req.params.id } });
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
