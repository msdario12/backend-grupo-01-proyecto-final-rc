const { matchedData, validationResult } = require("express-validator");
const { Turn } = require("../models/turns.models");
const schedule = require("node-schedule");
const { Patient } = require("../models/patients.models");
const { createToastMessage } = require("../helpers/createToastMessage.helpers");
const flatten = require("flat");
const addMinutes = require("date-fns/addMinutes");
const { User } = require("../models/users.models");
const { Pet } = require("../models/pets.models");

const createTurnHelper = async (patientID, turnData) => {
    const endDate = addMinutes(new Date(turnData.date), 30);
    turnData.endDate = endDate;
    turnData.patient_id = patientID;
    const oneTurn = await Turn.create(turnData);
    const dateJob = new Date(oneTurn.date);

    const onePatient = await Patient.findById(patientID)
        .populate("user_id")
        .populate("pet_id", "name");
    const turnID = String(oneTurn._id);
    const job = schedule.scheduleJob(turnID, dateJob, function() {
        try {
            if (oneTurn.status === "pending") {
                oneTurn.status = "waitingForPatient";
                oneTurn.save();
                const msg = `El turno de ${onePatient.user_id.firstName} ${onePatient.user_id.lastName}, para su mascota ${onePatient.pet_id.name} se cambio al estado de "Esperando paciente"`;
                io.emit("foo", createToastMessage("success", msg));
                return;
            }
        } catch (error) {
            next(error);
        }
    });
    onePatient.turns.push(oneTurn._id);
    onePatient.save();
};

const editTurn = async (req, res, next) => {
    try {
        const { id } = req.params;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const turnData = matchedData(req);
        turnData.endDate = req.endDate;

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
            return res.status(400).json({ errors: errors.array() });
        }
        const turnData = matchedData(req);
        const endDate = addMinutes(new Date(turnData.date), 30);
        turnData.endDate = endDate;
        const oneTurn = await Turn.create(turnData);
        const date = new Date(oneTurn.date);

        const onePatient = await Patient.findById(oneTurn.patient_id)
            .populate("user_id")
            .populate("pet_id", "name");
        const turnID = String(oneTurn._id);
        const job = schedule.scheduleJob(turnID, date, function() {
            try {
                if (oneTurn.status === "pending") {
                    oneTurn.status = "waitingForPatient";
                    oneTurn.save();
                    const msg = `El turno de ${onePatient.user_id.firstName} ${onePatient.user_id.lastName}, para su mascota ${onePatient.pet_id.name} se cambio al estado de "Esperando paciente"`;
                    io.emit("foo", createToastMessage("success", msg));
                    return;
                }
            } catch (error) {
                next(error);
            }
        });
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
        const existingJob = schedule.scheduledJobs[deletedTurn._id];
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

const createTurnByClient = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const turnAndPatientData = matchedData(req);

        const {
            firstName,
            lastName,
            email,
            phone,
            name,
            specie,
            race,
            date,
            vet,
            details,
        } = turnAndPatientData;

        const turnData = { date, vet, details };

        const foundedPet = await Pet.findOne({
            name: name,
            specie: specie,
        });
        if (foundedPet) {
            const foundedPatient = await Patient.findOne({ pet_id: foundedPet._id });
            createTurnHelper(foundedPatient._id, turnData);
            return res.status(201).json({
                success: true,
                data: foundedPatient,
                log: "Mascota ya registrada",
            });
        }
        const foundedUser = await User.findOne({ email });
        let newPatient;
        if (foundedUser) {
            const newPet = await Pet.create({
                name,
                specie,
                race,
                client_id: foundedUser._id,
            });
            foundedUser.pets.push(newPet._id);
            await foundedUser.save();
            newPatient = await Patient.create({
                user_id: foundedUser._id,
                pet_id: newPet._id,
            });
        } else {
            const newUser = await User.create({ firstName, lastName, email, phone });

            const newPet = await Pet.create({
                name,
                specie,
                race,
                client_id: newUser._id,
            });
            newUser.pets.push(newPet._id);

            await newUser.save();

            newPatient = await Patient.create({
                user_id: newUser._id,
                pet_id: newPet._id,
            });
        }
        createTurnHelper(newPatient._id, turnData);
        return res.status(201).json({
            success: true,
            data: newPatient,
        });
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
