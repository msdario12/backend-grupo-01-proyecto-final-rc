const { Router } = require('express');
const { weatherRouter } = require('./weather.routes');
const { patientsRouter } = require('./patients.routes');
const { usersRouter } = require('./users.routes');
const { petsRouter } = require('./pets.routes');

// aca van todas las rutas para ser exportadas
const router = Router();

// rutas
router.use('/weather', weatherRouter);
router.use('/patients', patientsRouter);
router.use('/users', usersRouter);
router.use('/pets', petsRouter);
// exportación
module.exports = { router };
