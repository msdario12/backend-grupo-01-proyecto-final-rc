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
} = require("../middlewares/turns.middlewares");
const { body, check } = require("express-validator");
const {
  newPatientValidator,
  checkIfEmailHasOriginalValues,
} = require("../middlewares/patients.middlewares");
const { checkIfAPetAlreadyExist } = require("../middlewares/pets.middlewares");

const turnsRouter = Router();

turnsRouter.get("/:id", getTurnById);
turnsRouter.get("/", getAllTurns);

turnsRouter.put(
  "/:id",
  check("id").notEmpty().withMessage("no se provee id"),
  newTurnValidator(),
  checkIfDateIsNew,
  checkIfATurnWithSameDateExist(),
  editTurn,
);
turnsRouter.post(
  "/",
  newTurnValidator(),
  checkIfATurnWithSameDateExist(),
  createTurn,
);
turnsRouter.post(
  "/turn-by-client",
  newPatientValidator(),
  checkIfAPetAlreadyExist,
  checkIfEmailHasOriginalValues,
  newTurnValidator(),
  checkIfATurnWithSameDateExist(),
  createTurnByClient,
);
turnsRouter.delete("/:id", deleteTurnById);

module.exports = { turnsRouter };
