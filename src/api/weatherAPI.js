require('dotenv').config();
const axios = require('axios');
const API_KEY = process.env.API_KEY_WEATHER;

const weatherAPI = axios.create({
	baseURL: `http://api.weatherapi.com/v1`,

	params: {
		key: API_KEY,
	},
});

module.exports = { weatherAPI };
