const { body, check, matchedData } = require('express-validator');
const { default: mongoose } = require('mongoose');
const { Patient } = require('../models/patients.models');
const { Turn } = require('../models/turns.models');
const areIntervalsOverlapping = require('date-fns/areIntervalsOverlapping');
const parseISO = require('date-fns/parseISO');
const addMinutes = require('date-fns/addMinutes');

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
		body('patient_id')
			.trim()
			.not()
			.isEmpty()
			.withMessage('patient_id es un campo obligatorio.')
			.custom((value) => mongoose.isValidObjectId(value))
			.withMessage('patient_id no es valido.')
			.custom(async (value, { req }) => {
				const patient = await Patient.findById(value);
				if (!patient) {
					throw new Error('patient_id invalido');
				}
				return true;
			})
	);

	return validatorList;
};

const checkIfATurnWithSameDateExist = () => {
	return [
		body('date').custom(async (value, { req }) => {
			const turnData = matchedData(req);
			const endDate = addMinutes(parseISO(value), 30);
			const foundedTurn = await Turn.findOne({
				$or: [
					{ date: turnData.date, vet: turnData.vet },
					{
						endDate: {
							$gt: turnData.date,
							$lt: endDate,
						},
						vet: turnData.vet,
					},
					{
						date: {
							$gt: turnData.date,
							$lt: endDate,
						},
						vet: turnData.vet,
					},
				],
			});
			if (foundedTurn) {
				// El turno tiene exactamente la misma fecha de inicio
				throw new Error('Ya existe un turno con la misma fecha');
			}

			return true;
		}),
	];
};

module.exports = {
	newTurnValidator,
	checkIfATurnWithSameDateExist,
};
