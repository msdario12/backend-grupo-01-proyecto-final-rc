const { Pet } = require("../models/pets.models");
const { User } = require("../models/users.models");
const { Patient } = require("../models/patients.models");
const { validationResult, matchedData } = require("express-validator");
const { Turn } = require("../models/turns.models");

const formatPatients = (list) =>
    list.map((patient, index) => {
        const { _id } = patient;
        const { firstName, lastName, email } = patient.user_id;
        const { race, specie, name } = patient.pet_id;
        return {
            _id,
            index,
            firstName,
            lastName,
            email,
            name,
            race,
            specie,
            turns: patient?.turns,
        };
    });

const createNewPatient = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const data = matchedData(req);

    try {
        const { firstName, lastName, email, phone, name, specie, race } = data;
        const foundedUser = await User.findOne({ email });

        if (foundedUser) {

            const newPet = await Pet.create({
                name,
                specie,
                race,
                client_id: foundedUser._id,
            });

            foundedUser.pets.push(newPet._id);

            await foundedUser.save();

            const newPatient = await Patient.create({
                user_id: foundedUser._id,
                pet_id: newPet._id,
            });
            await newPatient.save();
            res.status(201).json({
                success: true,
                data: newPatient,
            });
            return;
        }
        const newUser = await User.create({ firstName, lastName, email, phone });

        const newPet = await Pet.create({
            name,
            specie,
            race,
            client_id: newUser._id,
        });

        newUser.pets.push(newPet._id);

        await newUser.save();

        const newPatient = await Patient.create({
            user_id: newUser._id,
            pet_id: newPet._id,
        });
        await newPatient.save();
        res.status(201).json({
            success: true,
            data: newPatient,
        });
    } catch (error) {
        next(error);
    }
};

const getPatientByID = async (req, res, next) => {
    const { id } = req.params;
    const { populate } = req.query;
    try {
        let onePatient;
        if (populate) {
            onePatient = await Patient.findOne({ _id: id })
                .populate("user_id")
                .populate("pet_id")
                .populate("turns");
        } else {
            onePatient = await Patient.findOne({ _id: id });
        }

        if (!onePatient) {
            res.status(200).json({
                success: true,
                message: "Paciente no encontrado",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: onePatient,
        });
    } catch (error) {
        next(error);
    }
};

const getAllPatients = async (req, res, next) => {
    try {
        const { searchParam } = req.query;
        if (searchParam) {
            const allPatientsMulti = await Patient.find()
                .populate({
                    path: "pet_id",
                    match: { name: { $regex: searchParam, $options: "i" } },
                })
                .populate({
                    path: "user_id",
                    match: {
                        $or: [
                            { firstName: { $regex: searchParam, $options: "i" } },
                            { lastName: { $regex: searchParam, $options: "i" } },
                            { email: { $regex: searchParam, $options: "i" } },
                        ],
                    },
                })
                .exec();

            const filteredResults = allPatientsMulti.filter(
                (patient) => patient.pet_id || patient.user_id,
            );

            if (filteredResults.length === 0) {
                res.status(200).json({
                    success: true,
                    message: "No se encuentra un paciente con esos criterios",
                });
                return;
            }

            const populatedResults = await Promise.all(
                filteredResults.map(async (patient) => {
                    const foundPatient = await Patient.findById(patient._id)
                        .populate("user_id")
                        .populate("pet_id");
                    return foundPatient;
                }),
            );

            res.status(200).json({
                success: true,
                data: formatPatients(populatedResults),
            });
            return;
        }
        const allPatients = await Patient.find()
            .populate("user_id")
            .populate("pet_id")
            .populate("turns");

        res.status(200).json({
            success: true,
            data: formatPatients(allPatients),
        });
    } catch (error) {
        next(error);
    }
};

const deletePatientByID = async (req, res, next) => {
    const { id } = req.params;
    try {
        const foundedTurn = await Turn.find({ patient_id: id });
        if (foundedTurn) {
            await Turn.deleteMany({ _id: [...foundedTurn.map((turn) => turn._id)] });
        }
        const deletedPatient = await Patient.findOneAndDelete({ _id: id });
        if (!deletedPatient) {
            res.status(400).json({
                success: false,
                message: "Paciente no encontrado",
            });
            return;
        }

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNewPatient,
    getAllPatients,
    getPatientByID,
    deletePatientByID,
};
