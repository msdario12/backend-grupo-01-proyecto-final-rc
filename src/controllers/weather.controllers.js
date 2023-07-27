const axios = require('axios');
const { weatherAPI } = require('../api/weatherAPI');

const getWeatherInfo = async (req, res) => {
	try {
		const config = {
			q: '181.117.24.35',
		};
		const response = await weatherAPI.get(`/current.json`, {
			params: config,
		});
		console.log(response.data);
		res.json({
			success: true,
			data: response.data,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = { getWeatherInfo };
