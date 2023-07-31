const { Router } = require('express');

const {
	createNewPatient,
	getAllPatients,
} = require('../controllers/patients.controllers');

const patientsRouter = Router();
patientsRouter.get('/', getAllPatients);
patientsRouter.post('/', createNewPatient);

module.exports = {
	patientsRouter,
};
