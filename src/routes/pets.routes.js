const { Router } = require('express');
const { getPetByID, editPetByID } = require('../controllers/pets.controllers');
const { authJwt } = require('../middlewares/authJwt.middlewares');
const {
	checkIfAPetAlreadyExist,
	newPetValidator,
} = require('../middlewares/pets.middlewares');

const petsRouter = Router();

petsRouter.get('/:id', getPetByID);
petsRouter.put('/:id', newPetValidator(), editPetByID);

module.exports = { petsRouter };
