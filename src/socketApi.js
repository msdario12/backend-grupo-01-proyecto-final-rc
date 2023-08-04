// socketIO
const  app  = require('./app');
const server = require('http').createServer(app);
//New imports
//Pass the Express app into the HTTP module.
const socketIO = require('socket.io')(server, {
	cors: {
		origin: 'http://localhost:5173',
	},
});

socketIO.on('connection', (socket) => {
	console.log(`⚡: ${socket.id} user just connected`);
	socket.on('disconnect', () => {
		console.log('A user disconnected');
	});
	socket.emit('foo', 'te conectaste rey');
});

socketIO.emit('foo', 'otro mensajito mi king');




module.exports = {  socketIO, server };
