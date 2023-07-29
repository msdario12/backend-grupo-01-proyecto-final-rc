const { Router } = require('express');
const { weatherRouter } = require('./weather.routes');
const { patientsRouter } = require('./patients.routes');

// aca van todas las rutas para ser exportadas
const router = Router();

// rutas
router.use('/weather', weatherRouter);
router.use('/patients', patientsRouter)
// exportación
module.exports = { router };
