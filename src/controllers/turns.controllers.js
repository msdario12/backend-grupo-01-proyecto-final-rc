const { Turn } = require('../models/turns.models');

const createTurn = async (req, res, next) => {
	try {
		const turnData = req.body;

		const oneTurn = await Turn.create(turnData);

		res.status(201).json({
			success: true,
			data: oneTurn,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { createTurn };
