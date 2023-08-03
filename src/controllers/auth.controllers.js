const { User } = require('../models/users.models');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const foundedUser = await User.findOne({ email: email });

		if (!foundedUser) {
			res.status(200).json({
				success: true,
				message: 'Correo no encontrado',
			});
			return;
		}
		// Solo usuarios con rol de administrador pueden loguear
		if (foundedUser.role !== 'admin') {
			res.status(200).json({
				success: true,
				message: 'El usuario no tiene los permisos necesarios',
			});
			return;
		}
		// Falta agregar la comparación con hash
		if (foundedUser.password !== password) {
			res.status(200).json({
				success: true,
				message: 'Contraseña incorrecta',
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
				expiresIn: '30min',
			}
		);

		res.status(200).json({
			success: true,
			message: 'Autenticación correcta',
			data: accessToken,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { handleLogin };
