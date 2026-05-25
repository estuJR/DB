const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME     || 'tienda_db',
  process.env.DB_USER     || 'proy3',
  process.env.DB_PASSWORD || 'secret',
  {
    host:    process.env.DB_HOST || 'db',
    dialect: 'mysql',
    logging: false,
    dialectOptions: { charset: 'utf8mb4' }
  }
);

module.exports = sequelize;
