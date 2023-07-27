const express = require('express');
const { router } = require('./routes/index.routes');
require('dotenv').config();
// puerto
const PORT = process.env.PORT;
const app = express();
// middlewares
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

app.listen(PORT, () => {
	console.log(`Server on in http://localhost:${PORT}`);
});
