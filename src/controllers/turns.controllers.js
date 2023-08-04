const { matchedData, validationResult } = require('express-validator');
const { Turn } = require('../models/turns.models');
const schedule = require('node-schedule');
const { Patient } = require('../models/patients.models');
const socketIO = require('../app');

const editTurn = async (req, res, next) => {
	try {
		const { id } = req.params;

		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: errors.array() });
		}
		// Trabajar con los datos saneados del express validator
		const turnData = matchedData(req);

		const updatedTurn = await Turn.findOneAndUpdate({ _id: id }, turnData, {
			new: true,
		});

		if (!updatedTurn) {
			res.status(400).json({
				success: false,
				message: 'Turno no válido',
			});
			return;
		}
		// Leemos el job existente para cambiar el estado
		const existingJob = schedule.scheduledJobs[updatedTurn._id];
		const newDate = new Date(updatedTurn.date);
		// Cambiamos la fecha de dicho job
		existingJob.reschedule(newDate);

		return res.status(200).json({
			success: true,
			data: updatedTurn,
		});
	} catch (error) {
		next(error);
	}
};

const createTurn = async (req, res, next) => {
	try {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: errors.array() });
		}
		// Trabajar con los datos saneados del express validator
		const turnData = matchedData(req);

		const oneTurn = await Turn.create(turnData);
		// Creamos una tarea a ejecutarse la fecha del turno, pasa a esperando paciente
		// En el front se debera setear el estado de inProgress cuando el paciente llegue.
		const date = new Date(oneTurn.date);
		// guardamos el job con el identificador igual al id del turno
		const job = schedule.scheduleJob( date, function() {
			try {
				if (oneTurn.status === 'pending') {
					oneTurn.status = 'waitingForPatient';
					oneTurn.save();
					console.log('Its time', oneTurn);
					socketIO.emit('foo', 'Se actulizo el estado')
					return;
				}
				console.log('El turno ya habia sido cambiado de estado');
			} catch (error) {
				next(error);
			}
		});
		// guardamos el turno en el paciente
		const onePatient = await Patient.findById(oneTurn.patient_id);
		// el patient_id se valida en el middleware de express-validator
		// podemos afirmar que si existe un onePatient con ese id
		onePatient.turns.push(oneTurn._id);
		onePatient.save();
		return res.status(201).json({
			success: true,
			data: oneTurn,
		});
	} catch (error) {
		next(error);
	}
};

const getAllTurns = async (req, res, next) => {
	try {
		const allTurns = await Turn.find();

		return res.status(200).json({
			success: true,
			data: allTurns,
		});
	} catch (error) {
		next(error);
	}
};

const getTurnById = async (req, res, next) => {
	try {
		const { id } = req.params;

		const turn = await Turn.findById(id);

		if (!turn) {
			res.status(400).json({
				success: false,
				message: 'Turno no encontrado',
			});
			return;
		}

		return res.status(200).json({
			success: true,
			data: turn,
		});
	} catch (error) {
		next(error);
	}
};

const deleteTurnById = async (req, res, next) => {
	try {
		const { id } = req.params;

		const deletedTurn = await Turn.findOneAndDelete({ _id: id });

		if (!deletedTurn) {
			res.status(400).json({
				success: false,
				message: 'Turno no encontrado',
			});
			return;
		}
		// Leemos el job existente para cambiar el estado
		const existingJob = schedule.scheduledJobs[deletedTurn._id];
		// Cancelamos dicho job
		existingJob.cancel();
		res.status(200).json({
			success: true,
			data: deletedTurn,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createTurn,
	editTurn,
	getAllTurns,
	getTurnById,
	deleteTurnById,
};
