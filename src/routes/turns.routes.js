const { Router } = require('express');
const { createTurn } = require('../controllers/turns.controllers');

const turnsRouter = Router();

turnsRouter.post('/', createTurn);

module.exports = { turnsRouter };
