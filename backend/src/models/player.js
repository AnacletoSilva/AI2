const Sequelize = require('sequelize');
const SequelizeDB = require('./database');

const Player = SequelizeDB.define('Player', {
    id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
    Nome: {
        type: Sequelize.STRING,
        allowNull: false // impede valores nulos
    },
    idade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    altura: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    posicao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    team_id: {
    type: Sequelize.INTEGER,
    allowNull: false
    },
    golos: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    assistencias: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'players'
});

module.exports = Player;