const { Router } = require("express");
const { getPetByID } = require("../controllers/pets.controllers");


const petsRouter = Router()

petsRouter.get('/:id', getPetByID)

module.exports = {petsRouter}