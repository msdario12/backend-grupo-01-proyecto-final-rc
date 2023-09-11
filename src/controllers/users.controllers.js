const { validationResult, matchedData } = require('express-validator');
const { User } = require('../models/users.models');
const bcrypt = require('bcrypt');

const getUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.query;
        if (email) {
            const users = await User.find({
                email: { $regex: '^' + email, $options: 'i' },
            });
            if (users.length === 0) {
                res.status(200).json({
                    success: true,
                    message: 'No se encontraron usuarios',
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: users,
            });
            return;
        }
        const users = await User.find();

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

const getUserByID = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const editUserByID = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const data = matchedData(req);
        const oneUser = await User.findOneAndUpdate({ _id: req.params.id }, data, {
            new: true,
        });

        if (!oneUser) {
            return res.status(400).json({
                success: false,
                response: 'Usuario no encontrado',
            });
        }

        return res.status(200).json({ success: true, data: oneUser });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserByEmail, editUserByID, getUserByID };
