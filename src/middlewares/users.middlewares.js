const { matchedData } = require('express-validator');
const { User } = require('../models/users.models');

const checkIfEmailAlreadyExist = async (req, res, next) => {
	try {
		const data = req.body;
		const foundedUser = await User.findOne({ email: data.email });
		if (foundedUser) {
			res.status(400).json({
				success: false,
				message: 'El correo ya se encuentra registrado en el sistema.',
			});
			return;
		}
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { checkIfEmailAlreadyExist };
