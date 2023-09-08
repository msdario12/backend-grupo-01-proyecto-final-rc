const { body, check, matchedData } = require("express-validator");

const { default: mongoose } = require("mongoose");
const { Patient } = require("../models/patients.models");
const { Turn } = require("../models/turns.models");
const parseISO = require("date-fns/parseISO");
const addMinutes = require("date-fns/addMinutes");
const { scheduledJobs } = require("node-schedule");
const { isAfter } = require("date-fns");

const validStatus = [
  "pending",
  "inProgress",
  "completed",
  "cancelled",
  "waitingForPatient",
];

const newTurnValidator = () => {
  const inputNames = ["vet", "details"];
  let validatorList = [];

  validatorList = inputNames.map((el) =>
    body(el)
      .toLowerCase()
      .trim()
      .not()
      .isEmpty()
      .withMessage(el + " es un campo obligatorio.")
      .isString()
      .withMessage(el + " solo tipo string")
      .matches(/^[,.\w\-\s]+$/)
      .withMessage(el + " solo acepta letras o números")
      .escape(),
  );

  validatorList.push(
    body("vet")
      .isLength({ min: 3, max: 35 })
      .withMessage("vet debe ser mayor a 3 caracteres y menor que 35."),
  );

  validatorList.push(
    body("details")
      .isLength({ min: 3, max: 255 })
      .withMessage("details debe ser mayor a 3 caracteres y menor que 35."),
  );

  validatorList.push(
    body("date")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Date es un campo obligatorio.")
      .custom(async (value, { req }) => {
        if (req.method === "PUT") {
          const { id } = req.params;
          const foundedTurn = await Turn.findById(id);
          if (foundedTurn.date.toISOString() === value) {
            return true;
          }
        }
        return true;
      })
      .withMessage("Id del turno incorrecto")
      .isISO8601()
      .withMessage("Fecha invalida"),
  );

  validatorList.push(
    body("patient_id")
      .trim()
      .not()
      .isEmpty()
      .withMessage("patient_id es un campo obligatorio.")
      .custom((value) => mongoose.isValidObjectId(value))
      .withMessage("patient_id no es valido.")
      .custom(async (value, { req }) => {
        const patient = await Patient.findById(value);
        if (!patient) {
          throw new Error("patient_id invalido");
        }
        return true;
      }),
  );

  validatorList.push(
    body("status")
      .trim()
      .optional()
      .isIn(validStatus)
      .withMessage("Tipo de mascota no soportado.")
      .escape(),
  );

  return validatorList;
};

const checkIfATurnWithSameDateExist = () => {
  return [
    body("date").custom(async (value, { req }) => {
      const turnData = matchedData(req);
      let endDate;
      if (!req.endDate) {
        endDate = addMinutes(parseISO(value), 30);
      }
      endDate = req.endDate;
      console.log("end date", endDate);
      const foundedTurn = await Turn.findOne({
        $or: [
          {
            endDate,
            vet: turnData.vet,
            _id: {
              $ne: turnData.id,
            },
          },
          {
            date: turnData.date,
            vet: turnData.vet,
            _id: {
              $ne: turnData.id,
            },
          },
          {
            endDate: {
              $gt: turnData.date,
              $lt: endDate,
            },
            _id: {
              $ne: turnData.id,
            },
            vet: turnData.vet,
          },
          {
            date: {
              $gt: turnData.date,
              $lt: endDate,
            },
            _id: {
              $ne: turnData.id,
            },
            vet: turnData.vet,
          },
        ],
      });
      console.log("fundo encontrado", foundedTurn);
      console.log("turno actual", turnData);
      if (foundedTurn) {
        // El turno tiene exactamente la misma fecha de inicio
        throw new Error("Ya existe un turno con la misma fecha");
      }

      return true;
    }),
  ];
};

const checkIfDateIsNew = async (req, res, next) => {
  try {
    const turnData = matchedData(req);
    const { id } = req.params;

    const originalTurn = await Turn.findById(id);
    // Vemos si se cambio la fecha
    console.log(originalTurn.date.toISOString());
    console.log(turnData.date);
    if (turnData.date !== originalTurn.date) {
      // Leemos el job existente para cambiar el estado
      console.log("La fecha se cambio");
      const existingJob = scheduledJobs[String(id)];
      const newDate = new Date(turnData.date);
      // Cambiamos la fecha de dicho job
      if (existingJob) {
        existingJob.reschedule(newDate);
      }
      // actualizamos la fecha del turno
      const endDate = addMinutes(newDate, 30);
      req.endDate = endDate.toISOString();
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newTurnValidator,
  checkIfATurnWithSameDateExist,
  checkIfDateIsNew,
};
