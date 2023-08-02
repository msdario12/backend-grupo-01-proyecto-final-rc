const { Router } = require('express');
const { getPetByID, editPetByID } = require('../controllers/pets.controllers');

const petsRouter = Router();

petsRouter.get('/:id', getPetByID);
petsRouter.put('/:id', editPetByID);

module.exports = { petsRouter };
