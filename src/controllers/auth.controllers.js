const { User } = require('../models/users.models');

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
        console.log(foundedUser.firstName)
        console.log(foundedUser)
		// Solo login de administradores
		if (foundedUser.role !== 'admin') {
			res.status(200).json({
				success: true,
				message: 'El usuario no tiene los permisos necesarios',
			});
			return;
		}
		// Falta agregar la comparacion con hash
		if (foundedUser.password !== password) {
			res.status(200).json({
				success: true,
				message: 'Contraseña incorrecta',
			});
			return;
		}

		res.status(200).json({
			success: true,
			message: 'Login correcto, Bienvenido',
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { handleLogin };
