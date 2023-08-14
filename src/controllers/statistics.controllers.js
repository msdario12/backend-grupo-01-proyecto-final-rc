const { addDays } = require('date-fns');
const { Turn } = require('../models/turns.models');
const startOfWeek = require('date-fns/startOfWeek');
const { Pet } = require('../models/pets.models');
const { Patient } = require('../models/patients.models');

const getGeneralStatistics = async (req, res, next) => {
	try {
		const totalTurns = await Turn.find({}).count();
		const completedTurns = await Turn.find({
			status: 'completed',
		}).count();
		const pendingTurns = await Turn.find({
			status: 'pending',
		}).count();
		const nextTurns = await Turn.find({
			status: 'pending',
		})
			.sort({
				date: 1,
			})
			.select('date')
			.populate({
				path: 'patient_id',
				strictPopulate: false,
				select: 'pet_id',
				populate: {
					path: 'pet_id',
					select: 'name specie',
				},
				perDocumentLimit: 2,
			})
			.limit(2);
		// obtenemos la semana actual
		const startDayOfTheWeek = startOfWeek(new Date());
		console.log(startDayOfTheWeek);
		const patientsSeenInWeek = await Turn.find({
			date: {
				$gt: startDayOfTheWeek,
				$lt: new Date(),
			},
		}).count();
		// Mascota más habitual
		const mostCommonSpecie = await Pet.aggregate([
			{
				$group: {
					_id: '$specie',
					count: {
						$sum: 1,
					},
				},
			},
			{
				$sort: {
					count: -1,
				},
			},
			{
				$limit: 1,
			},
		]).exec();
		// total de pacientes
		const totalRegisteredPatients = await Patient.find({}).count();

		const statisticsData = {
			totalTurns,
			completedTurns,
			pendingTurns,
			nextTurns,
			patientsSeenInWeek,
			mostCommonSpecie,
			totalRegisteredPatients,
		};

		res.status(200).json({
			success: true,
			data: statisticsData,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { getGeneralStatistics };
