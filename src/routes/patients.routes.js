const { Router } = require("express");
const {
    createNewPatient,
    getAllPatients,
    getPatientByID,
    deletePatientByID,
} = require("../controllers/patients.controllers");
const { isAdmin } = require("../middlewares/authJwt.middlewares");
const {
    newPatientValidator,
    checkIfEmailHasOriginalValues,
} = require("../middlewares/patients.middlewares");
const { checkIfAPetAlreadyExist } = require("../middlewares/pets.middlewares");

const patientsRouter = Router();
patientsRouter.get("/", getAllPatients);
patientsRouter.get("/:id", getPatientByID);
patientsRouter.post(
    "/",
    newPatientValidator(),
    checkIfAPetAlreadyExist,
    checkIfEmailHasOriginalValues,
    createNewPatient,
);
patientsRouter.delete("/:id", deletePatientByID);

module.exports = {
    patientsRouter,
};
