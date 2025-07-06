var Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'postgres',
    'postgres',
    'basededados',
    {
        host: 'localhost',
        port: '5433',
        dialect: 'postgres'
    }
);

sequelize.sync({ alter: true });


module.exports = sequelize;