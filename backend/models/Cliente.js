const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Cliente = sequelize.define('Cliente', {
  id_cliente: { type: DataTypes.INTEGER,     primaryKey: true, autoIncrement: true },
  nombre:     { type: DataTypes.STRING(80),  allowNull: false },
  apellido:   { type: DataTypes.STRING(80),  allowNull: false },
  email:      { type: DataTypes.STRING(120), allowNull: false },
  telefono:   { type: DataTypes.STRING(20),  allowNull: false }
}, { tableName: 'clientes', timestamps: false });

module.exports = Cliente;
