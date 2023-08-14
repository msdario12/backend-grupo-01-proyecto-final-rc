const { Router } = require('express');

const {
	getUserByEmail,
	editUserByID,
	getUserByID,
} = require('../controllers/users.controllers');
const {
	checkIfEmailAlreadyExist,
	newUserValidator,
} = require('../middlewares/users.middlewares');

const usersRouter = Router();

usersRouter.get('/', getUserByEmail);
usersRouter.get('/:id', getUserByID);
usersRouter.put(
	'/:id',
	newUserValidator(),
	checkIfEmailAlreadyExist,
	editUserByID
);

module.exports = { usersRouter };
