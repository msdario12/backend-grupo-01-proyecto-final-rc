const { Pet } = require('../models/pets.models');

const checkIfAPetAlreadyExist = async (req, res, next) => {
	try {
		const data = req.body;
		const foundedPet = await Pet.findOne({
			name: data.name,
			specie: data.specie,
		});
		if (foundedPet) {
			res.status(400).json({
				success: false,
				message: 'La mascota ya se encuentra registrado en el sistema.',
			});
			return;
		}
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { checkIfAPetAlreadyExist };
