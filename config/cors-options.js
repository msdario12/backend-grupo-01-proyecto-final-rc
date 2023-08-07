const corsOptions = {
	origin: 'http://181.117.24.59:5173',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: [
		'Content-Type',
		'Authorization',
		'Access-Control-Allow-Credentials',
		'Content-Length',
		'X-Requested-With',
	],
};

module.exports = { corsOptions };
