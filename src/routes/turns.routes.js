const { Router } = require("express");
const {
  createTurn,
  editTurn,
  getAllTurns,
  getTurnById,
  deleteTurnById,
  createTurnByClient,
} = require("../controllers/turns.controllers");
const {
  newTurnValidator,
  checkIfATurnWithSameDateExist,
  checkIfDateIsNew,
  checkPatientId,
} = require("../middlewares/turns.middlewares");
const { body, check } = require("express-validator");
const {
  newPatientValidator,
  checkIfEmailHasOriginalValues,
} = require("../middlewares/patients.middlewares");
const { checkIfAPetAlreadyExist } = require("../middlewares/pets.middlewares");
const { authJwt } = require("../middlewares/authJwt.middlewares");

const turnsRouter = Router();
turnsRouter.get("/:id", authJwt, getTurnById);
turnsRouter.get("/", authJwt, getAllTurns);

turnsRouter.put(
  "/:id",
  authJwt,
  check("id").notEmpty().withMessage("no se provee id"),
  newTurnValidator(),
  checkPatientId(),
  checkIfDateIsNew,
  checkIfATurnWithSameDateExist(),
  editTurn,
);
turnsRouter.post(
  "/turn-by-client",
  newPatientValidator(),
  newTurnValidator(),
  checkIfATurnWithSameDateExist(),
  createTurnByClient,
);
turnsRouter.post(
  "/",
  authJwt,
  newTurnValidator(),
  checkPatientId(),
  checkIfATurnWithSameDateExist(),
  createTurn,
);
turnsRouter.delete("/:id", authJwt, deleteTurnById);

module.exports = { turnsRouter };
