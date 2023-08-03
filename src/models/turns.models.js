const { Schema, Types, model } = require('mongoose');

const collection = 'turns';

const turnsSchema = Schema({
	date: {
		type: Date,
		required: true,
		min: new Date().toString,
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
		ref: 'pets',
		_id: false,
	},
});

const Turn = model(collection, turnsSchema);

module.exports = { Turn };
