const { matchedData, validationResult } = require('express-validator');
const { Turn } = require('../models/turns.models');
const { Patient } = require('../models/patients.models');

const createTurn = async (req, res, next) => {
	try {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: errors.array() });
		}
		// Trabajar con los datos saneados del express validator
		const turnData = matchedData(req);

		const patient = await Patient.findById(turnData.patient_id);
		if (!patient) {
			res.status(400).json({
				success: false,
				message: 'Paciente no encontrado',
			});
			return;
		}

		const oneTurn = await Turn.create(turnData);

		res.status(201).json({
			success: true,
			data: oneTurn,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { createTurn };
