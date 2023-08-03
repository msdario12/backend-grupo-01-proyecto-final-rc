const { Router } = require('express');
const { createTurn } = require('../controllers/turns.controllers');
const { newTurnValidator } = require('../middlewares/turns.middlewares');

const turnsRouter = Router();

turnsRouter.post('/', newTurnValidator(), createTurn);

module.exports = { turnsRouter };
