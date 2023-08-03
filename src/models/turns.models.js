const { Schema, Types, model } = require('mongoose');
const { Pet } = require('./pets.models');

const collection = 'turns';

const turnsSchema = Schema({
	date: {
		type: Date,
		required: true,
		min: new Date().toISOString(),
	},
	vet: {
		type: String,
		required: true,
	},
	details: {
		type: String,
		required: true,
	},
	pet_id: {
		type: Types.ObjectId,
		required: true,
		ref: 'pets',
		_id: false,
	},
	status: {
		type: String,
		default: 'pending',
	},
	user_id: {
		required: true,
		type: Types.ObjectId,
		ref: 'users',
		_id: false,
	},
});

const Turn = model(collection, turnsSchema);

module.exports = { Turn };
