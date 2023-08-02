const { Router } = require('express');
const { handleLogin } = require('../controllers/auth.controllers');

const authRouter = Router();

authRouter.post('/login', handleLogin);

module.exports = { authRouter };
