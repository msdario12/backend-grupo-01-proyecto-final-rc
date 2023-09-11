const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { router } = require('./routes/index.routes');
const cors = require('cors');
const { errorHandler } = require('./middlewares/error.middlewares');
const { createToastMessage } = require('./helpers/createToastMessage.helpers');
const { corsOptions } = require('../config/cors-options');
require('dotenv').config();
const PORT = process.env.PORT;
const app = express();

const server = require('http').createServer(app);

const socketIO = require('socket.io')(server, {
    cors: corsOptions,
});

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

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bienvenido al backend',
    });
});

app.use('/api', router);

app.use(errorHandler);
server.listen(PORT, () => {
    mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => console.log('Database connected'))
        .catch((error) => console.log('Database error: ' + error));
    console.log(`Server on in http://localhost:${PORT}`);
});
