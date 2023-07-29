const { Router } = require('express');
const { User } = require('../models/users.models');

const usersRouter = Router();

usersRouter.get('/', async (req, res, next) => {
	try {
		const { email } = req.query;
		if (email) {
			const users = await User.find({
				email: { $regex: '^' + email, $options: 'i' },
			});
			if (users.length === 0) {
				res.status(200).json({
					success: true,
					message: 'No se encontraron usuarios',
				});
				return;
			}
			res.status(200).json({
				success: true,
				data: users,
			});
			return;
		}
		const users = await User.find();

		res.status(200).json({
			success: true,
			data: users,
		});
	} catch (error) {
		next(error);
	}
});

module.exports = { usersRouter };
