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
	const inputNames = [
		{ title: 'Nombre', name: 'firstName' },
		{ title: 'Apellido', name: 'lastName' },
		{ title: 'Mascota', name: 'name' },
		{ title: 'Raza', name: 'race' },
	];

	let validatorList = inputNames.map((el) =>
		body(el.name)
			.toLowerCase()
			.trim()
			.not()
			.isEmpty()
			.withMessage(el.title + ' es un campo obligatorio.')
			.isString()
			.withMessage(el.title + ' solo se aceptan letras.')
			.isLength({ min: 3, max: 35 })
			.withMessage(el.title + ' debe ser mayor a 3 caracteres y menor que 35.')
			.matches(/^[a-zA-Z0-9]*$/)
			.withMessage(el.title + ' solo acepta letras y números.')
			.escape()
	);
	validatorList.push(
		body('email')
			.toLowerCase()
			.trim()
			.not()
			.isEmpty()
			.withMessage('Email es un campo obligatorio.')
			.isEmail()
			.withMessage('Introduzca un email válido')
			.escape()
	);
	validatorList.push(
		body('specie')
			.trim()
			.not()
			.isEmpty()
			.withMessage('Especie es un campo obligatorio.')
			.toLowerCase()
			.isIn(validSpecies)
			.withMessage('Tipo de mascota no soportado.')
			.escape()
	);
	return validatorList;
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
