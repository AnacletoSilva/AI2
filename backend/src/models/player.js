const Sequelize = require('./database');
const { DataTypes } = require('sequelize');


const Player = Sequelize.define('Player', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
    Nome: {
        type: DataTypes.STRING,
        allowNull: false // impede valores nulos
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    altura: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    posicao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    team_id: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    golos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    assistencias: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'players'
});

module.exports = Player;