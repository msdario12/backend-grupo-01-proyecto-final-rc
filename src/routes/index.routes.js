const { Router } = require('express');
const { weatherRouter } = require('./weather.routes');
const { patientsRouter } = require('./patients.routes');
const { usersRouter } = require('./users.routes');

// aca van todas las rutas para ser exportadas
const router = Router();

// rutas
router.use('/weather', weatherRouter);
router.use('/patients', patientsRouter)
router.use('/users', usersRouter)
// exportación
module.exports = { router };
