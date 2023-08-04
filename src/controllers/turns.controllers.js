const { matchedData, validationResult } = require('express-validator');
const { Turn } = require('../models/turns.models');
const { Patient } = require('../models/patients.models');

const editTurn = async (req, res, next) => {
	try {
		const { id } = req.params;

		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: errors.array() });
		}
		// Trabajar con los datos saneados del express validator
		const turnData = matchedData(req);

		console.log(turnData);

		const updatedTurn = await Turn.findOneAndUpdate({ _id: id }, turnData, {
			new: true,
		});

		if (!updatedTurn) {
			res.status(400).json({
				success: false,
				message: 'Turno no válido',
			});
			return;
		}

		return res.status(200).json({
			success: true,
			data: updatedTurn,
		});
	} catch (error) {
		next(error);
	}
};

const createTurn = async (req, res, next) => {
	try {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: errors.array() });
		}
		// Trabajar con los datos saneados del express validator
		const turnData = matchedData(req);

		

		const oneTurn = await Turn.create(turnData);

		return res.status(201).json({
			success: true,
			data: oneTurn,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { createTurn, editTurn };
