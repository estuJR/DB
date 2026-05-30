const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Proveedor = sequelize.define('Proveedor', {
  id_proveedor: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:       { type: DataTypes.STRING(120), allowNull: false },
  telefono:     { type: DataTypes.STRING(20),  allowNull: false },
  email:        { type: DataTypes.STRING(120), allowNull: false },
  direccion:    { type: DataTypes.STRING(255), allowNull: false }
}, { tableName: 'proveedores', timestamps: false });

module.exports = Proveedor;
