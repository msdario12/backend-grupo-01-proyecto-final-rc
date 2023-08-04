const { Schema, Types, model } = require('mongoose');
const { Patient } = require('./patients.models');

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

turnsSchema.post('findOneAndDelete', async (doc) => {
	console.log(doc);
	const patient = await Patient.findOne({ _id: doc.patient_id });
	if (patient.turns) {
		patient.turns.pull(doc._id);
		patient.save();
		console.log(patient);
		console.log(patient.pets.length);
	}
});

const Turn = model(collection, turnsSchema);

module.exports = { Turn };
