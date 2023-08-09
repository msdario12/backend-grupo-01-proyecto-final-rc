const { Schema, model, Types } = require('mongoose');
const { Pet } = require('./pets.models');
const { User } = require('./users.models');

const collection = 'patients';

const patientsSchema = Schema({
	user_id: {
		type: Types.ObjectId,
		ref: 'users',
		required: true,
		_id: false,
	},
	pet_id: {
		type: Types.ObjectId,
		ref: 'pets',
		required: true,
		_id: false,
	},
	turns: [
		{
			type: Types.ObjectId,
			ref: 'turns',
			_id: false,
		},
	],
});
// middleware que al borrar un paciente, remueve la mascota del usuario (array pets de user) y elimina dicha mascota (del modelo pets)
patientsSchema.post('findOneAndDelete', async (doc) => {
	const user = await User.findOne({ _id: doc.user_id });
	if (user.pets) {
		user.pets.pull(doc.pet_id);
		user.save();
		console.log(user);
		console.log(user.pets.length);
		await Pet.deleteOne({ _id: doc.pet_id });
	}
});

const Patient = model(collection, patientsSchema);

module.exports = { Patient };
