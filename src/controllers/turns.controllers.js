const { matchedData, validationResult } = require('express-validator');
const { Pet } = require('../models/pets.models');
const { Turn } = require('../models/turns.models');

const createTurn = async (req, res, next) => {
	try {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: errors.array() });
		}
		// Trabajar con los datos saneados del express validator
		const turnData = matchedData(req);

		const foundedPet = await Pet.findById(turnData.pet_id);

		if (!foundedPet) {
			res.status(200).json({
				success: true,
				message: 'Mascota no valida',
			});
			return;
		}
		const userID = foundedPet.client_id;
		const oneTurn = await Turn.create({ ...turnData, user_id: userID });

		res.status(201).json({
			success: true,
			data: oneTurn,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { createTurn };
