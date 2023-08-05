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
// authJwt, isAdmin,
patientsRouter.get('/', authJwt, getAllPatients);
patientsRouter.get('/:id', authJwt, getPatientByID);
patientsRouter.post('/', newPatientValidator(), authJwt, createNewPatient);
patientsRouter.delete('/:id', authJwt, deletePatientByID);

module.exports = {
	patientsRouter,
};
