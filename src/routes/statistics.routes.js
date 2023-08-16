const { Router } = require('express');
const {
	getGeneralStatistics,
} = require('../controllers/statistics.controllers');

const statisticsRouter = Router();

statisticsRouter.get('/', getGeneralStatistics);

module.exports = { statisticsRouter };
