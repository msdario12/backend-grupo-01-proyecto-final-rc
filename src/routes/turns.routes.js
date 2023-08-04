const { Router } = require('express');
const {
	createTurn,
	editTurn,
	getAllTurns,
	getTurnById,
} = require('../controllers/turns.controllers');
const { newTurnValidator } = require('../middlewares/turns.middlewares');

const turnsRouter = Router();

turnsRouter.get('/:id', getTurnById);
turnsRouter.get('/', getAllTurns);
turnsRouter.post('/', newTurnValidator(), createTurn);
turnsRouter.put('/:id', newTurnValidator(), editTurn);

module.exports = { turnsRouter };
