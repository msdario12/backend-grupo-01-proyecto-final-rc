const { Router } = require('express');

const { createNewPatient } = require('../controllers/patients.controllers');

const patientsRouter = Router();

patientsRouter.post('/', createNewPatient);

module.exports = {
	patientsRouter,
};
