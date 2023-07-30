const { Schema, model } = require('mongoose');

const contactSchema = Schema({
	name: {
		type: String,
		required: true,
	},

    phone: {
        type: Number,
        required: true,
        unique: true,
    },

	email: {
		type: String,
		required: true,
		unique: true,
	},

	description: {
		type: String,
		required: true,
	},
});

module.exports = model('contact', contactSchema);
