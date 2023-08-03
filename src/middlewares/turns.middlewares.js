const { body, check } = require('express-validator');
const { default: mongoose } = require('mongoose');

const validStatus = [
	'pending',
	'inProgress',
	'completed',
	'cancelled',
	'waitingForPatient',
];

const newTurnValidator = () => {
	const inputNames = ['vet', 'details'];
	let validatorList = [];

	validatorList = inputNames.map((el) =>
		body(el)
			.toLowerCase()
			.trim()
			.not()
			.isEmpty()
			.withMessage(el + ' es un campo obligatorio.')
			.isString()
			.withMessage(el + ' solo tipo string')
			.isAlphanumeric('es-ES')
			.withMessage(el + ' solo acepta letras o números')
			.escape()
	);

	validatorList.push(
		body('vet')
			.isLength({ min: 3, max: 35 })
			.withMessage('vet debe ser mayor a 3 caracteres y menor que 35.')
	);

	validatorList.push(
		body('details')
			.isLength({ min: 3, max: 255 })
			.withMessage('details debe ser mayor a 3 caracteres y menor que 35.')
	);

	validatorList.push(
		body('date')
			.trim()
			.not()
			.isEmpty()
			.withMessage('Date es un campo obligatorio.')
			.isAfter()
			.withMessage('No puede ser una fecha pasada')
			.isISO8601()
			.withMessage('Fecha invalida')
	);

	validatorList.push(
		body('pet_id')
			.trim()
			.not()
			.isEmpty()
			.withMessage('pet_id es un campo obligatorio.')
			.custom((value) => mongoose.isValidObjectId(value))
			.withMessage('pet_id no es valido.')
	);

	return validatorList;
};

module.exports = { newTurnValidator };
