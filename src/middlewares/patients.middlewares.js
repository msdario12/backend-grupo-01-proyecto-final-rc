const { body, matchedData } = require('express-validator');
const { User } = require('../models/users.models');

const validSpecies = [
	'perro',
	'gato',
	'conejo',
	'hámster',
	'cobaya',
	'pájaro',
	'tortuga',
	'serpiente',
	'pez',
	'lagarto',
];

const newPatientValidator = () => {
	const inputNames = [
		{ title: 'Nombre', name: 'firstName' },
		{ title: 'Apellido', name: 'lastName' },
		{ title: 'Mascota', name: 'name' },
		{ title: 'Raza', name: 'race' },
	];

	let validatorList = inputNames.map((el) =>
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
		body('specie')
			.trim()
			.not()
			.isEmpty()
			.withMessage('Especie es un campo obligatorio.')
			.toLowerCase()
			.isIn(validSpecies)
			.withMessage('Tipo de mascota no soportado.')
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

const checkIfEmailHasOriginalValues = async (req, res, next) => {
	try {
		const data = matchedData(req);
		const foundedUser = await User.findOne({ email: data.email });

		if (!foundedUser) {
			next();
			return;
		}

		const { firstName, lastName, phone } = foundedUser;
		console.log(foundedUser)
		console.log(data)
		if (foundedUser) {
			const firstNameComparison = firstName == data.firstName;
			const lastNameComparison = lastName == data.lastName;
			const phoneComparison = phone == data.phone;
			if (!firstNameComparison || !lastNameComparison || !phoneComparison) {
				res.status(400).json({
					success: false,
					message:
						'Se recibe un paciente con un email existente pero datos distintos',
				});
				return;
			}
		}
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { newPatientValidator, checkIfEmailHasOriginalValues };
