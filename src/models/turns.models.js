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
turnsSchema.pre('findOneAndDelete', async function() {
    const turnId = this.getQuery();
    const turn = await Turn.findOne({ _id: turnId });
    const patient = await Patient.findById(turn.patient_id);
    if (patient?.turns) {
        patient.turns.pull(turnId);
        await patient.save();
    }
});

const Turn = model(collection, turnsSchema);

module.exports = { Turn };
