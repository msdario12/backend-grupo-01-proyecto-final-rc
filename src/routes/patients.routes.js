const { Router } = require('express');

const validSpecies = [
	'perro',
	'gato',
	'conejo',
	'hámster',
	'cobaya',
	'pájaro',
	'tortuga',
	'serpiente',
	'pez',
	'lagarto',
];

const newPatientValidator = () => {
	const inputNames = ['firstName', 'lastName', 'name', 'race', 'specie'];

	return inputNames.map((name) =>
		body(name)
			.trim()
			.not()
			.isEmpty()
			.withMessage('Este campo es obligatorio')
			.isString()
			.withMessage('Solo se aceptan letras')
			.isLength({ min: 3, max: 35 })
			.withMessage('Debe ser mayor a 3 caracteres y menor que 35')
	);
};

const {
	createNewPatient,
	getAllPatients,
} = require('../controllers/patients.controllers');
const { body } = require('express-validator');

const patientsRouter = Router();
patientsRouter.get('/', getAllPatients);
patientsRouter.post('/', newPatientValidator(), createNewPatient);

module.exports = {
	patientsRouter,
};
