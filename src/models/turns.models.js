const { Schema, Types, model } = require('mongoose');
const { Patient } = require('./patients.models');

const collection = 'turns';

const turnsSchema = Schema({
	date: {
		type: Date,
		required: true,
		min: new Date().toISOString(),
	},
	endDate: {
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
// middleware para borrar turno del array de paciente
turnsSchema.pre('findOneAndDelete', async function () {
	// obtenemos el id del turno
	const turnId = this.getQuery();
	const turn = await Turn.findOne({ _id: turnId });
	const patient = await Patient.findById(turn.patient_id);
	// podemos asegurar que existe un paciente con ese id
	if (patient?.turns) {
		// sacamos del array de turnos del paciente el turno que se esta eliminando
		patient.turns.pull(turnId);
		await patient.save();
	}
});

const Turn = model(collection, turnsSchema);

module.exports = { Turn };
