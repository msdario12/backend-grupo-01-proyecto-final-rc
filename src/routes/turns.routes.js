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
	checkIfDateIsNew,
} = require('../middlewares/turns.middlewares');
const { body } = require('express-validator');

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
	checkIfDateIsNew,
	editTurn
);
turnsRouter.delete('/:id', deleteTurnById);

module.exports = { turnsRouter };
