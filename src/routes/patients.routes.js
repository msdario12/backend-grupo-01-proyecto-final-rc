const { Router } = require('express');
const {
	createNewPatient,
	getAllPatients,
	getPatientByID,
	deletePatientByID,
} = require('../controllers/patients.controllers');
const { authJwt, isAdmin } = require('../middlewares/authJwt.middlewares');
const { newPatientValidator } = require('../middlewares/patients.middlewares');

const patientsRouter = Router();
patientsRouter.get('/', authJwt, isAdmin, getAllPatients);
patientsRouter.get('/:id', getPatientByID);
patientsRouter.post('/', newPatientValidator(), createNewPatient);
patientsRouter.delete('/:id', deletePatientByID);

module.exports = {
	patientsRouter,
};
