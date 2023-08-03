const { Pet } = require('../models/pets.models');
const { Turn } = require('../models/turns.models');

const createTurn = async (req, res, next) => {
	try {
		const turnData = req.body;

		const foundedPet = await Pet.findById(turnData.pet_id)

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
