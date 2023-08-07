const corsOptions = {
	origin: '::ffff:10.16.82.68',
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
