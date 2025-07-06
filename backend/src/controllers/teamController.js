var Team = require('../models/team');
var sequelize = require('../models/database');
const controllers = {};
sequelize.sync();

controllers.team_create = async (req, res) => {
    const { nome_equipa, abrev, ano_fundacao, nome_estadio, emblema } = req.body;

    try {
        const data = await Team.create({
            nome_equipa,
            abrev,
            ano_fundacao,
            nome_estadio,
            emblema
        });

        res.status(200).json({
            success: true,
            message: "Equipa adicionada!",
            data: data
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

controllers.team_list = async (req, res) => {
    try {
        const data = await Team.findAll();
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

controllers.team_update = async (req, res) => {
    const { id } = req.params;
    const { nome_equipa, abrev, ano_fundacao, nome_estadio, emblema } = req.body;

    console.log("Update para ID:", id);
    console.log("Dados:", { nome_equipa, abrev, ano_fundacao, nome_estadio, emblema });

    try {
        const [updated] = await Team.update(
            {
                nome_equipa,
                abrev,
                ano_fundacao,
                nome_estadio,
                emblema
            },
            { where: { id } }
        );

        if (updated === 0) {
            return res.status(200).json({
                success: false,
                message: "Equipa não atualizada. Talvez o ID não exista ou os valores sejam iguais.",
            });
        }

        res.json({ success: true, message: "Equipa atualizada com sucesso!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

controllers.team_delete = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Team.destroy({ where: { id } });

        res.json({
            success: deleted > 0,
            message: deleted > 0 ? "Equipa eliminada!" : "Nenhuma equipa eliminada."
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

controllers.team_get = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await Team.findAll({
            where: { id: id }
        });

        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = controllers;
