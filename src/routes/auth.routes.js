const { Router } = require('express');
const { handleLogin } = require('../controllers/auth.controllers');

const authRouter = Router();
// falta validacion del login
authRouter.post('/login', handleLogin);

module.exports = { authRouter };
