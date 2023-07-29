const { Pet } = require('../models/pets.models');
const { User } = require('../models/users.models');
const { Patient } = require('../models/patients.models');

const createNewPatient = async (req, res, next) => {
	try {
		const { firstName, lastName, email, phone, name, specie, race } = req.body;
		console.log(req.body);
		const foundedUser = await User.findOne({ email: email });
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
			console.log(foundedUser);
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
		console.log(newUser);
		res.status(201).json({
			success: true,
			data: newPatient,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { createNewPatient };
