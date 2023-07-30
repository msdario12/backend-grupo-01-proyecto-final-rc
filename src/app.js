const express = require('express');
const mongoose = require('mongoose');
const { router } = require('./routes/index.routes');
const cors = require('cors');
const { errorHandler } = require('./middlewares/error.middlewares');
require('dotenv').config();
// puerto
const PORT = process.env.PORT;
const app = express();
// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ruta por defecto
app.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'Bienvenido al backend',
	});
});

// rutas - api
app.use('/api', router);

app.use('/contact', require('./routes/contactRouter'));

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
	mongoose
		.connect(process.env.DB_CONNECT)
		.then(() => console.log('Database connected'))
		.catch((error) => console.log('Database error: ' + error));
	console.log(`Server on in http://localhost:${PORT}`);
});
