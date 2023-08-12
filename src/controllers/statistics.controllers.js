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

const getGeneralStatistics = (req, res, next) => {
  try {
    const statisticsData = {

    }

    res.status(200).json({
      success: true,
      data: statisticsData
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getGeneralStatistics }
