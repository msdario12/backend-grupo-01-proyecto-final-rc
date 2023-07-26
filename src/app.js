const express = require('express');
// dot env
require('dotenv').config();
// puerto
const PORT = process.env.PORT;
const app = express();

// ruta por defecto
app.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'Bienvenido al backend',
	});
});

app.listen(PORT, () => {
	console.log(`Server on in http://localhost:${PORT}`);
});
