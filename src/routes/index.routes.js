const { Router } = require('express');
const { weatherRouter } = require('./weather.routes');

// aca van todas las rutas para ser exportadas
const router = Router();

// rutas
router.use('/weather', weatherRouter);
// exportación
module.exports = { router };
