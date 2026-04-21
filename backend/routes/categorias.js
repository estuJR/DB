const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todas
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categorias');
  res.json(rows);
});

// GET una
router.get('/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categorias WHERE id_categoria = ?', [req.params.id]);
  res.json(rows[0]);
});

// POST crear
router.post('/', async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre || !descripcion)
    return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
  const [result] = await db.query(
    'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion]
  );
  res.json({ id_categoria: result.insertId, nombre, descripcion });
});

// PUT editar
router.put('/:id', async (req, res) => {
  const { nombre, descripcion } = req.body;
  await db.query(
    'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
    [nombre, descripcion, req.params.id]
  );
  res.json({ mensaje: 'Categoría actualizada' });
});

// DELETE eliminar
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM categorias WHERE id_categoria = ?', [req.params.id]);
  res.json({ mensaje: 'Categoría eliminada' });
});

module.exports = router;