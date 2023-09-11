const { Router } = require("express");
const { weatherRouter } = require("./weather.routes");
const { patientsRouter } = require("./patients.routes");
const { usersRouter } = require("./users.routes");
const { petsRouter } = require("./pets.routes");
const { authRouter } = require("./auth.routes");
const { turnsRouter } = require("./turns.routes");
const { statisticsRouter } = require("./statistics.routes");
const { authJwt } = require("../middlewares/authJwt.middlewares");

// aca van todas las rutas para ser exportadas
const router = Router();

// rutas sin protección
router.use("/weather", weatherRouter);
router.use("/auth", authRouter);
// rutas protegidas por jwt
router.use("/turns", turnsRouter);
router.use("/patients", authJwt, patientsRouter);
router.use("/pets", authJwt, petsRouter);
router.use("/statistics", authJwt, statisticsRouter);
router.use("/users", authJwt, usersRouter);

// exportación
module.exports = { router };
