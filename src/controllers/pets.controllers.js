const { validationResult, matchedData } = require('express-validator');
const { Pet } = require('../models/pets.models');

const getPetByID = async (req, res, next) => {
    const { id } = req.params;
    try {
        const onePet = await Pet.findById(id);
        if (!onePet) {
            res.status(400).json({
                success: false,
                message: 'Mascota no encontrada',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: onePet,
        });
    } catch (error) {
        next(error);
    }
};

const editPetByID = async (req, res, next) => {
    const { id } = req.params;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const data = matchedData(req);
        const onePet = await Pet.findOneAndUpdate({ _id: id }, data, {
            new: true,
        });

        if (!onePet) {
            return res.status(400).json({
                success: false,
                message: 'Mascota no encontrada',
            });
        }

        return res.status(200).json({ success: true, data: onePet });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPetByID, editPetByID };
