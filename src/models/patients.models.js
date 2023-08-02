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
});

patientsSchema.post('findOneAndDelete', async (doc) => {
	const user = await User.findOne({ _id: doc.user_id });
	if (user.pets) {
		const updatedUser = await User.findOneAndUpdate(
			{
				_id: doc.user_id,
			},
			{
				$pull: {
					pets: [{ _id: doc.pet_id }],
				},
			},
			{
				new: true,
			}
		);
		console.log(updatedUser);
		console.log(updatedUser.pets.length);
		if (user.pets.length === 0) {
			console.log('Se elimina usuario tambien');
			await User.deleteOne({ _id: doc.user_id });
			return;
		}
		await Pet.deleteOne({ _id: doc.pet_id });
	}
});

const Patient = model(collection, patientsSchema);

module.exports = { Patient };
