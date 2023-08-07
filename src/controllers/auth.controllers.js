const { User } = require('../models/users.models');
const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
	try {
		const { firstName, email, role } = req;
		res.status(200).json({
			success: true,
			message: 'Token válido',
			firstName: firstName,
			role: role,
			email: email,
		});
	} catch (error) {
		next(error);
	}
};

const handleLogin = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		console.log(email);

		const foundedUser = await User.findOne({ email: email });
		if (!foundedUser) {
			res.status(200).json({
				success: false,
				message: 'Correo no encontrado',
			});
			return;
		}

		// Falta agregar la comparación con hash
		if (foundedUser.password !== password) {
			res.status(200).json({
				success: false,
				message: 'Contraseña incorrecta',
			});
			return;
		}
		// Solo usuarios con rol de administrador pueden loguear
		if (foundedUser.role !== 'admin') {
			res.status(200).json({
				success: false,
				message: 'El usuario no tiene los permisos necesarios',
			});
			return;
		}
		// Creamos el JWT
		const accessToken = jwt.sign(
			{
				firstName: foundedUser.firstName,
				email: foundedUser.email,
				role: foundedUser.role,
				id: foundedUser._id,
			},
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: '2h',
			}
		);

		res.status(200).json({
			success: true,
			message: 'Autenticación correcta',
			accessToken: accessToken,
			firstName: foundedUser.firstName,
			role: foundedUser.role,
			email: foundedUser.email,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { handleLogin, validateToken };
