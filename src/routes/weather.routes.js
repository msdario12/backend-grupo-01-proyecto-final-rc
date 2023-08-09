const { Router } = require('express');
const { getWeatherInfo } = require('../controllers/weather.controllers');

const weatherRouter = Router();

weatherRouter.get('/', getWeatherInfo);

module.exports = { weatherRouter };
