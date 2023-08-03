const { Schema, Types, model } = require('mongoose');

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
});

const Turn = model(collection, turnsSchema);

module.exports = { Turn };
