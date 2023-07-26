const getWeatherInfo = (req, res) => {
	console.log('Weather');
    const API_KEY = process.env.API_KEY_WEATHER
	res.json({
		msg: 'Welcome to weather',
	});
};

module.exports = { getWeatherInfo };
