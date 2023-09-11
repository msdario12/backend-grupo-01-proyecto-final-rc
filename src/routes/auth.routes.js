const { Router } = require('express');
const {
    handleLogin,
    validateToken,
    handleSignUp,
} = require('../controllers/auth.controllers');
const { authJwt } = require('../middlewares/authJwt.middlewares');
const { newUserValidator } = require('../middlewares/users.middlewares');
const { check } = require('express-validator');

const authRouter = Router();
authRouter.post(
    '/login',
    check('password').notEmpty().escape(),
    check('email').notEmpty().isEmail().escape(),
    handleLogin
);
authRouter.post('/validate', authJwt, validateToken);
authRouter.post(
    '/signup',
    newUserValidator(),
    check('password').notEmpty().escape(),
    handleSignUp
);

module.exports = { authRouter };
