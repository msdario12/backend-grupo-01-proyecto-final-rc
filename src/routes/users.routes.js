const { Router } = require('express');

const {
	getUserByEmail,
	editUserByID,
	getUserByID,
} = require('../controllers/users.controllers');
const { authJwt } = require('../middlewares/authJwt.middlewares');

const usersRouter = Router();

usersRouter.get('/', authJwt, getUserByEmail);
usersRouter.get('/:id', authJwt, getUserByID);
usersRouter.put('/:id', authJwt, editUserByID);

module.exports = { usersRouter };
