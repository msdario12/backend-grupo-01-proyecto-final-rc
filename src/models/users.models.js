const { Schema, model, Types } = require('mongoose');

const collection = 'users';

const usersSchema = Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: Number,
		required: true,
	},
	pets: [
		{
			pet_id: {
				type: Types.ObjectId,
				required: true,
				_id: false,
			},
		},
	],
});

const Users = model(collection, usersSchema);

module.exports = { Users };
