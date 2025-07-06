const express = require('express');
const router = express.Router();

const teamController = require('../controllers/teamController');

router.post('/create', teamController.team_create);
router.get('/list', teamController.team_list);
router.put('/update/:id', teamController.team_update);
router.get('/get/:id', teamController.team_get);
router.delete('/delete/:id', teamController.team_delete);


module.exports = router;