// models/team.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database');

// Define o modelo “Team” e força o campo `emblema` a usar TEXT, que suporta strings de qualquer tamanho
const Team = sequelize.define('team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Nome da equipa, até 255 caracteres por omissão
  nome_equipa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Abreviatura, validação de tamanho entre 1 e 11
  abrev: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 11]
    }
  },
  // Ano de fundação como inteiro
  ano_fundacao: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // Nome do estádio, até 255 caracteres por omissão
  nome_estadio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Emblema agora em TEXT para suportar URLs longas (base64 ou externas)
  emblema: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false  // sem createdAt/updatedAt
});

// Sincroniza o modelo com a tabela, fazendo ALTER quando necessário
Team.sync({ alter: true })
  .then(() => {
    console.log('Tabela “team” atualizada para usar TEXT em `emblema` com sucesso!');
  })
  .catch((err) => {
    console.error('Erro ao atualizar tabela “team”:', err);
  });

module.exports = Team;
