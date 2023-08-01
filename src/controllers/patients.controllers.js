const { Pet } = require('../models/pets.models');
const { User } = require('../models/users.models');
const { Patient } = require('../models/patients.models');
const { validationResult, matchedData } = require('express-validator');

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
		};
	});

const createNewPatient = async (req, res, next) => {
	let errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(400).json({ errors: errors.array() });
	}
	// Trabajar con los datos saneados del express validator
	const data = matchedData(req);
	try {
		const { firstName, lastName, email, phone, name, specie, race } = data;
		console.log(data);
		const foundedUser = await User.findOne({ email: email });
		const foundedPet = await Pet.findOne({ name: name, specie: specie });
		if (foundedPet) {
			// Se encuentra la misma mascota y usuario
			res.status(200).json({
				success: true,
				message: 'La mascota ya se encuentra en el sistema.',
			});
			return;
		}
		if (foundedUser) {
			//Existe usuario

			// Creamos nueva mascota
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
			console.log(foundedUser);
			res.status(201).json({
				success: true,
				data: newPatient,
			});
			return;
		}
		// No existe el usuario
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
		console.log(newUser);
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
	try {
		const onePatient = await Patient.findOne({ _id: id });

		if (!onePatient) {
			res.json(200).json({
				success: true,
				message: 'Paciente no encontrado',
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
		const allPatients = await Patient.find()
			.populate('user_id')
			.populate('pet_id');

		const formattedAllPatients = formatPatients(allPatients);

		res.status(200).json({
			success: true,
			data: formattedAllPatients,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { createNewPatient, getAllPatients, getPatientByID };
