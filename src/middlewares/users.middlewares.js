const { matchedData, body } = require('express-validator');
const { User } = require('../models/users.models');

const newUserValidator = () => {
	const inputNames = [
		{ title: 'Nombre', name: 'firstName' },
		{ title: 'Apellido', name: 'lastName' },
	];

	const validatorList = inputNames.map((el) =>
		body(el.name)
			.toLowerCase()
			.trim()
			.not()
			.isEmpty()
			.withMessage(el.title + ' es un campo obligatorio.')
			.isString()
			.withMessage(el.title + ' solo tipo string')
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
		body('phone')
			.trim()
			.not()
			.isEmpty()
			.withMessage('Teléfono es un campo obligatorio.')
			.matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
			.withMessage('Teléfono no válido.')
	);
	return validatorList;
};

const checkIfEmailAlreadyExist = async (req, res, next) => {
	try {
		const { id } = req.params;
		const data = req.body;
		const foundedUser = await User.findOne({ email: data.email });
		if (foundedUser && foundedUser._id != id) {
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

module.exports = { checkIfEmailAlreadyExist, newUserValidator };
