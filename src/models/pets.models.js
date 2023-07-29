const { Schema, model, Types } = require('mongoose');

const collection = 'pets';

const petsSchema = Schema({
	name: {
		type: String,
		required: true,
	},
	specie: {
		type: String,
		required: true,
	},
	race: {
		type: String,
		required: true,
	},
	client_id: {
		type: Types.ObjectId,
		ref: 'users',
		required: true,
		_id: false,
	},
});

const Pet = model(collection, petsSchema);

module.exports = { Pet };
