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
	patient_id: {
		type: Types.ObjectId,
		required: true,
		ref: 'patients',
		_id: false,
	},
	status: {
		type: String,
		default: 'pending',
	},
});

const Turn = model(collection, turnsSchema);

module.exports = { Turn };
