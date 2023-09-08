const { matchedData, validationResult } = require("express-validator");
const { Turn } = require("../models/turns.models");
const schedule = require("node-schedule");
const { Patient } = require("../models/patients.models");
const { createToastMessage } = require("../helpers/createToastMessage.helpers");
const flatten = require("flat");
const addMinutes = require("date-fns/addMinutes");

const editTurn = async (req, res, next) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    // Trabajar con los datos saneados del express validator
    const turnData = matchedData(req);
    turnData.endDate = req.endDate;
    console.log(turnData);

    const updatedTurn = await Turn.findOneAndUpdate({ _id: id }, turnData, {
      new: true,
    });

    if (!updatedTurn) {
      res.status(400).json({
        success: false,
        message: "Turno no válido",
      });
      return;
    }

    return res.status(200).json({
      success: true,
      data: updatedTurn,
    });
  } catch (error) {
    next(error);
  }
};

const createTurn = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    // Trabajar con los datos saneados del express validator
    const turnData = matchedData(req);
    // Creamos la fecha del turno media hora despues
    const endDate = addMinutes(new Date(turnData.date), 30);
    turnData.endDate = endDate;
    const oneTurn = await Turn.create(turnData);
    // Creamos una tarea a ejecutarse la fecha del turno, pasa a esperando paciente
    // En el front se debera setear el estado de inProgress cuando el paciente llegue.
    const date = new Date(oneTurn.date);

    // guardamos el turno en el paciente
    const onePatient = await Patient.findById(oneTurn.patient_id)
      .populate("user_id")
      .populate("pet_id", "name");
    // el patient_id se valida en el middleware de express-validator
    // podemos afirmar que si existe un onePatient con ese id
    // guardamos el job con el identificador igual al id del turno
    const turnID = String(oneTurn._id);
    const job = schedule.scheduleJob(turnID, date, function () {
      try {
        if (oneTurn.status === "pending") {
          oneTurn.status = "waitingForPatient";
          oneTurn.save();
          const msg = `El turno de ${onePatient.user_id.firstName} ${onePatient.user_id.lastName}, para su mascota ${onePatient.pet_id.name} se cambio al estado de "Esperando paciente"`;
          io.emit("foo", createToastMessage("success", msg));
          console.log("Its time", oneTurn);
          return;
        }
        console.log("El turno ya habia sido cambiado de estado");
      } catch (error) {
        next(error);
      }
    });
    // agregamos el turno al paciente
    onePatient.turns.push(oneTurn._id);
    onePatient.save();
    return res.status(201).json({
      success: true,
      data: oneTurn,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTurns = async (req, res, next) => {
  try {
    const { patientID } = req.query;
    if (patientID) {
      const allTurns = await Turn.find({ patient_id: patientID })
        .populate({
          path: "patient_id",
          populate: {
            path: "user_id pet_id",
            select: "name firstName lastName specie",
            options: { _recursed: true },
          },
        })
        .lean()
        .exec();

      const flattenTurns = allTurns.map((turn, index) =>
        flatten({ ...turn, index: index + 1 }),
      );

      return res.status(200).json({
        success: true,
        data: flattenTurns,
      });
    }
    const allTurns = await Turn.find({})
      .populate({
        path: "patient_id",
        populate: {
          path: "user_id pet_id",
          select: "name firstName lastName specie",
          options: { _recursed: true },
        },
      })
      .lean()
      .exec();

    const flattenTurns = allTurns.map((turn, index) =>
      flatten({ ...turn, index: index + 1 }),
    );

    return res.status(200).json({
      success: true,
      data: flattenTurns,
    });
  } catch (error) {
    next(error);
  }
};

const getTurnById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const turn = await Turn.findById(id);

    if (!turn) {
      res.status(400).json({
        success: false,
        message: "Turno no encontrado",
      });
      return;
    }

    return res.status(200).json({
      success: true,
      data: turn,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTurnById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTurn = await Turn.findOneAndDelete({ _id: id });

    if (!deletedTurn) {
      res.status(400).json({
        success: false,
        message: "Turno no encontrado",
      });
      return;
    }
    // Leemos el job existente para cambiar el estado
    const existingJob = schedule.scheduledJobs[deletedTurn._id];
    // Cancelamos dicho job
    if (existingJob) {
      existingJob.cancel();
    }
    res.status(200).json({
      success: true,
      data: deletedTurn,
    });
  } catch (error) {
    next(error);
  }
};

const createTurnByClient = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    // Trabajar con los datos saneados del express validator
    const turnAndPatientData = matchedData(req);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTurn,
  editTurn,
  getAllTurns,
  getTurnById,
  deleteTurnById,
  createTurnByClient,
};
