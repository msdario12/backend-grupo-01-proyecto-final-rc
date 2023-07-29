const { Schema, model, Types } = require('mongoose');

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

const Patient = model(collection, patientsSchema);

module.exports = { Patient };
