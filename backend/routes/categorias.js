const express   = require('express');
const router    = express.Router();
const Categoria = require('../models/Categoria');

// GET todas — ORM READ
router.get('/', async (req, res) => {
  try {
    const rows = await Categoria.findAll();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET una
router.get('/:id', async (req, res) => {
  try {
    const c = await Categoria.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(c);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST crear — ORM CREATE
router.post('/', async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre || !descripcion)
    return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
  try {
    const c = await Categoria.create({ nombre, descripcion });
    res.json({ id_categoria: c.id_categoria, nombre, descripcion });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT editar — ORM UPDATE
router.put('/:id', async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    await Categoria.update(
      { nombre, descripcion },
      { where: { id_categoria: req.params.id } }
    );
    res.json({ mensaje: 'Categoría actualizada' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE eliminar — ORM DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Categoria.destroy({ where: { id_categoria: req.params.id } });
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
