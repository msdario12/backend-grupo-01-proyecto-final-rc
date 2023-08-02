const { Router } = require('express');

const {
	getUserByEmail,
	editUserByID,
	getUserByID,
} = require('../controllers/users.controllers');

const usersRouter = Router();

usersRouter.get('/', getUserByEmail);
usersRouter.get('/:id', getUserByID);
usersRouter.put('/:id', editUserByID);

module.exports = { usersRouter };
