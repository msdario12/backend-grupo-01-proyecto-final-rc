const { Router } = require('express');
const { weatherRouter } = require('./weather.routes');
const { patientsRouter } = require('./patients.routes');
const { usersRouter } = require('./users.routes');
const { petsRouter } = require('./pets.routes');
const { authRouter } = require('./auth.routes');
const { turnsRouter } = require('./turns.routes');
const { statisticsRouter } = require('./statistics.routes');

// aca van todas las rutas para ser exportadas
const router = Router();

// rutas
router.use('/auth', authRouter);
router.use('/weather', weatherRouter);
router.use('/patients', patientsRouter);
router.use('/users', usersRouter);
router.use('/pets', petsRouter);
router.use('/turns', turnsRouter);
router.use('/statistics', statisticsRouter);

// exportación
module.exports = { router };
