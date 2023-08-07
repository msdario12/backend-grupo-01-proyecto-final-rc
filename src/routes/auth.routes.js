const { Router } = require('express');
const {
	handleLogin,
	validateToken,
} = require('../controllers/auth.controllers');
const { authJwt } = require('../middlewares/authJwt.middlewares');

const authRouter = Router();
// falta validacion del login
authRouter.post('/login', handleLogin);
authRouter.post('/validate', authJwt, validateToken);

module.exports = { authRouter };
