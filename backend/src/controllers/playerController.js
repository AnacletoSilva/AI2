const player = require('../models/player');
const sequelize = require('../models/database');
const Player = require('../models/player');

const controllers = {};

sequelize.sync();


controllers.player_create = async (req, res) => {
    const { Nome, idade, altura, posicao, team_id, golos, assistencias } = req.body;

    if (!Nome || idade === undefined || altura === undefined || !posicao || !team_id || golos === undefined 
        || assistencias === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: Nome, idade, altura, posicao"
        });
    }

    try {
        const data = await player.create({
            Nome,
            idade,
            altura,
            posicao,
            team_id,
            golos,
            assistencias
        });

        res.status(201).json({
            success: true,
            message: "Player created successfully",
            data: data
        });
    } catch (error) {
        console.error("Erro ao criar player:", error);
        res.status(500).json({
            success: false,
            message: "Error creating player",
            error: error.message
        });
    }
};


controllers.player_list = async (req, res) => {
    const { teamId } = req.params;

    try {
        const players = await Player.findAll({ where: { team_id: teamId } });
        res.json({ success: true, data: players });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


controllers.player_update = async (req, res) => {
    const { id } = req.params;
    const {Nome, idade, altura, posicao, golos, assistencias } = req.body;

    if (!Nome || idade === undefined || altura === undefined || !posicao || golos === undefined || assistencias === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: Nome, idade, altura, posicao"
        });
    }

    try {
        const data = await player.update(
            { Nome, idade, altura, posicao, golos, assistencias},
            { where: { id } }
        );

        res.status(200).json({
            success: true,
            message: "Player updated successfully",
            data: data
        });
    } catch (error) {
        console.error("Erro ao atualizar player:", error);
        res.status(500).json({ success: false, message: "Error updating player", error: error.message });
    }
};


controllers.player_delete = async (req, res) => {
    const { id } = req.params;

    try {
        await player.destroy({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: "Player removed successfully"
        });
    } catch (error) {
        console.error("Erro ao apagar player:", error);
        res.status(500).json({ success: false, message: "Error deleting player", error: error.message });
    }
};


controllers.player_get = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await player.findOne({
            where: { id }
        });

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error("Erro ao obter player:", error);
        res.status(500).json({ success: false, message: "Error fetching player", error: error.message });
    }
};

module.exports = controllers;
