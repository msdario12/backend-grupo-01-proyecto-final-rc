const { Router } = require('express');
const { getPetByID, editPetByID } = require('../controllers/pets.controllers');
const { authJwt } = require('../middlewares/authJwt.middlewares');

const petsRouter = Router();

petsRouter.get('/:id', authJwt, getPetByID);
petsRouter.put('/:id', authJwt, editPetByID);

module.exports = { petsRouter };

