const { Router } = require('express');
const {
	createNewPatient,
	getAllPatients,
	getPatientByID,
	deletePatientByID,
} = require('../controllers/patients.controllers');
const { authJwt, isAdmin } = require('../middlewares/authJwt.middlewares');
const {
	newPatientValidator,
	checkIfEmailHasOriginalValues,
} = require('../middlewares/patients.middlewares');
const { checkIfAPetAlreadyExist } = require('../middlewares/pets.middlewares');

const patientsRouter = Router();
// authJwt, isAdmin,
patientsRouter.get('/', authJwt, getAllPatients);
patientsRouter.get('/:id', authJwt, getPatientByID);
patientsRouter.post(
	'/',
	authJwt,
	newPatientValidator(),
	checkIfAPetAlreadyExist,
	checkIfEmailHasOriginalValues,
	createNewPatient
);
patientsRouter.delete('/:id', authJwt, deletePatientByID);

module.exports = {
	patientsRouter,
};
