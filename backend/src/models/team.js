const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Team = sequelize.define('team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_equipa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  abrev: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 11]
    }
  },
  ano_fundacao: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nome_estadio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emblema: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'teams' // Nome explícito da tabela
});


module.exports = Team;