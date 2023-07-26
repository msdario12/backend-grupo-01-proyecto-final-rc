const getWeatherInfo = (req, res) => {
	console.log('Weather');
	res.json({
		msg: 'Welcome to weather',
	});
};

module.exports = { getWeatherInfo };
