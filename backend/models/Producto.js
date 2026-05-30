const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Categoria = require('./Categoria');
const Proveedor = require('./Proveedor');

const Producto = sequelize.define('Producto', {
  id_producto:     { type: DataTypes.INTEGER,      primaryKey: true, autoIncrement: true },
  nombre:          { type: DataTypes.STRING(120),  allowNull: false },
  descripcion:     { type: DataTypes.STRING(255),  allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10,2),allowNull: false },
  stock:           { type: DataTypes.INTEGER,      allowNull: false, defaultValue: 0 },
  id_categoria:    { type: DataTypes.INTEGER,      allowNull: false },
  id_proveedor:    { type: DataTypes.INTEGER,      allowNull: false }
}, { tableName: 'productos', timestamps: false });

Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });

module.exports = Producto;
