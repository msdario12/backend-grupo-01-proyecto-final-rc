const { Router } = require('express');
const {
	createTurn,
	editTurn,
	getAllTurns,
	getTurnById,
	deleteTurnById,
} = require('../controllers/turns.controllers');
const {
	newTurnValidator,
	checkIfATurnWithSameDateExist,
} = require('../middlewares/turns.middlewares');

const turnsRouter = Router();

turnsRouter.get('/:id', getTurnById);
turnsRouter.get('/', getAllTurns);
turnsRouter.post(
	'/',
	newTurnValidator(),
	checkIfATurnWithSameDateExist(),
	createTurn
);
turnsRouter.put(
	'/:id',
	newTurnValidator(),
	checkIfATurnWithSameDateExist(),
	editTurn
);
turnsRouter.delete('/:id', deleteTurnById);

module.exports = { turnsRouter };
