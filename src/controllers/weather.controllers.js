const { weatherAPI } = require('../api/weatherAPI');

const getWeatherInfo = async (req, res, next) => {
	const { location } = req.query;
	try {
		const config = {
			q: location,
			lang: 'es',
		};
		const response = await weatherAPI.get(`/current.json`, {
			params: config,
		});
		res.status(200).json({
			success: true,
			data: response.data,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { getWeatherInfo };
