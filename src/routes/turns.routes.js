const { Router } = require('express');
const { createTurn, editTurn } = require('../controllers/turns.controllers');
const { newTurnValidator } = require('../middlewares/turns.middlewares');

const turnsRouter = Router();

turnsRouter.post('/', newTurnValidator(), createTurn);
turnsRouter.put('/:id', newTurnValidator(),editTurn);

module.exports = { turnsRouter };
