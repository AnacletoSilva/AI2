const express = require('express');
const router = express.Router();



const playerController = require('../controllers/playerController');

router.post('/player/create', playerController.player_create);
router.get('/team/:teamId/players', playerController.player_list);
router.put('/player/update/:id', playerController.player_update);
router.get('/player/get/:id', playerController.player_get);
router.delete('/player/delete/:id', playerController.player_delete);




module.exports = router;