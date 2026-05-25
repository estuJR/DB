const express = require('express');
const router  = express.Router();
const db      = require('../db');
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const Proveedor = require('../models/Proveedor');

// GET todos — ORM (CRUD op 1: READ)
router.get('/', async (req, res) => {
  try {
    const rows = await Producto.findAll({
      include: [
        { model: Categoria, as: 'categoria', attributes: ['nombre'] },
        { model: Proveedor, as: 'proveedor', attributes: ['nombre'] }
      ]
    });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET uno
router.get('/:id', async (req, res) => {
  try {
    const p = await Producto.findByPk(req.params.id, {
      include: [
        { model: Categoria, as: 'categoria', attributes: ['nombre'] },
        { model: Proveedor, as: 'proveedor', attributes: ['nombre'] }
      ]
    });
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST crear — ORM (CRUD op 2: CREATE)
router.post('/', async (req, res) => {
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  if (!nombre || !precio_unitario || !id_categoria || !id_proveedor)
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  try {
    const p = await Producto.create({ nombre, descripcion, precio_unitario, stock: stock || 0, id_categoria, id_proveedor });
    res.json({ id_producto: p.id_producto });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT editar — ORM (CRUD op 3: UPDATE)
router.put('/:id', async (req, res) => {
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  try {
    await Producto.update(
      { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor },
      { where: { id_producto: req.params.id } }
    );
    res.json({ mensaje: 'Producto actualizado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE eliminar — ORM (CRUD op 4: DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await Producto.destroy({ where: { id_producto: req.params.id } });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH stock — llama SP sp_actualizar_stock
router.patch('/:id/stock', async (req, res) => {
  const { delta } = req.body;
  if (delta === undefined) return res.status(400).json({ error: 'Falta el campo delta' });
  try {
    await db.query('CALL sp_actualizar_stock(?, ?, @nuevo_stock, @error)', [req.params.id, delta]);
    const [[result]] = await db.query('SELECT @nuevo_stock AS nuevo_stock, @error AS error');
    if (result.error) return res.status(400).json({ error: result.error });
    res.json({ nuevo_stock: result.nuevo_stock });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
