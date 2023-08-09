const corsOptions = {
	origin: 'https://rolling-vet23.netlify.app',
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
