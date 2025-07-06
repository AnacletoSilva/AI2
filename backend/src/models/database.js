// database.js
const { Sequelize } = require('sequelize'); // Importe Sequelize

// Verifique se DATABASE_URL existe
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida!');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});

module.exports = sequelize; // Exporte a instância