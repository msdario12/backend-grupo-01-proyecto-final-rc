const mongoose = require('mongoose');

const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.DB_CONNECT);
		console.log('conectado a la base de datos');
	} catch (error) {
		console.log(error);
	}
};

module.exports = { dbConnection };
