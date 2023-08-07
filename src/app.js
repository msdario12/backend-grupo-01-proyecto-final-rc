const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { router } = require('./routes/index.routes');
const cors = require('cors');
const { errorHandler } = require('./middlewares/error.middlewares');
const { createToastMessage } = require('./helpers/createToastMessage.helpers');
const { corsOptions } = require('../config/cors-options');
require('dotenv').config();
// puerto
const PORT = process.env.PORT;
const app = express();

// creamos un nuevo httpserver para app y io
const server = require('http').createServer(app);

//pasamos el server para crear la instancia de socketIO
const socketIO = require('socket.io')(server, {
	cors: corsOptions,
});

// añadimos el socketIO al global variable para ser usado por otros módulos
global.io = socketIO;

socketIO.on('connection', (socket) => {
	console.log(`⚡: ${socket.id} user just connected`);
	socket.on('disconnect', () => {
		console.log('A user disconnected');
	});
	socket.emit(
		'foo',
		createToastMessage('success', 'Conexión con el servidor correcta')
	);
});

// middlewares
app.use(cors(corsOptions));
app.use(morgan('combined'));
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

// error handler
app.use(errorHandler);
// server tiene socket y app
server.listen(PORT, () => {
	mongoose
		.connect(process.env.DB_CONNECT)
		.then(() => console.log('Database connected'))
		.catch((error) => console.log('Database error: ' + error));
	console.log(`Server on in http://localhost:${PORT}`);
});
