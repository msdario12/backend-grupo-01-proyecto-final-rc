const { Turn } = require('../models/turns.models');

/* FORMATO DE LA RESPUESTA
data = {
    totalTurns: 245,
    completedTurns: 23,
    pendingTurns: 242,
    firstNextTurn: {
        date: ,
        name: ,
        specie,

    },
    secondNextTurn: {
        date: ,
        name: ,
        specie,

    },
    patientsSeenInWeek: 24,
    mostCommonSpecie: 'Perro',
    totalRegisteredPatients: 242,
}
*/

const getGeneralStatistics = async (req, res, next) => {
	try {
		const totalTurns = await Turn.find({}).count();
		const completedTurns = await Turn.find({
			status: 'completed',
		}).count();
		const statisticsData = {
			totalTurns,
			completedTurns,
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
