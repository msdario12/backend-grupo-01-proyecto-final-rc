const errorHandler = (error, req, res, next) => {
	console.log(error.stack);

	res.status(500).json({
		status: 500,
		method: req.method,
		path: req.url,
		response: error.message,
	});
	return;
};

module.exports = { errorHandler };
