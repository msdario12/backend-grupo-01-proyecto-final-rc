const jwt = require('jsonwebtoken');
const { User } = require('../models/users.models');

const authJwt = (req, res, next) => {
	const token = req.headers['x-access-token'];
	if (!token) {
		res.status(403).json({
			success: false,
			message: 'No se provee token de autenticación.',
		});
		return;
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				success: false,
				message: 'No autorizado',
			});
		}
		console.log(decoded);
		req.userId = decoded.id;
		next();
	});
};

const isAdmin = async (req, res, next) => {
	try {
		const { userId } = req;
		const foundedUser = await User.findById(userId);
		if (foundedUser.role !== 'admin') {
			return res.status(401).json({
				success: false,
				message: 'Rol incorrecto',
			});
		}
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { authJwt, isAdmin };
