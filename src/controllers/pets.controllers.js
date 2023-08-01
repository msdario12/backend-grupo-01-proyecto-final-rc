const { Pet } = require('../models/pets.models');

const getPetByID = async (req, res, next) => {
	const { id } = req.params;
	try {
		const onePet = await Pet.findById(id);
		if (!onePet) {
			res.status(200).json({
				success: true,
				message: 'Mascota no encontrada',
			});
			return;
		}
		res.status(200).json({
			success: true,
			data: onePet,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { getPetByID };
