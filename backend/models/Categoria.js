const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Categoria = sequelize.define('Categoria', {
  id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:       { type: DataTypes.STRING(80),  allowNull: false },
  descripcion:  { type: DataTypes.STRING(255), allowNull: false }
}, { tableName: 'categorias', timestamps: false });

module.exports = Categoria;
