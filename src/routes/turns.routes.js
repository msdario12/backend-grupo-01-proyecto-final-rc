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
const { body, check } = require('express-validator');

const turnsRouter = Router();

turnsRouter.get('/:id', getTurnById);
turnsRouter.get('/', getAllTurns);

turnsRouter.put(
	'/:id',
	check('id').notEmpty().withMessage('no se provee id'),
	newTurnValidator(),
	checkIfATurnWithSameDateExist(),
	checkIfDateIsNew,
	editTurn
);
turnsRouter.post(
	'/',
	newTurnValidator(),
	checkIfATurnWithSameDateExist(),
	createTurn
);
turnsRouter.delete('/:id', deleteTurnById);

module.exports = { turnsRouter };
