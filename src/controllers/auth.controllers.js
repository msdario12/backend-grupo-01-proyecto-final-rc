const { User } = require('../models/users.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult, matchedData } = require('express-validator');

const validateToken = async (req, res, next) => {
    try {
        const { firstName, email, role } = req;
        res.status(200).json({
            success: true,
            message: 'Token válido',
            firstName,
            role,
            email,
        });
    } catch (error) {
        next(error);
    }
};

const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;


        const foundedUser = await User.findOne({ email });
        if (!foundedUser) {
            res.status(200).json({
                success: false,
                message: 'Correo o contraseña incorrecta',
            });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            foundedUser.password
        );

        // Falta agregar la comparación con hash
        if (!isPasswordMatch) {
            res.status(200).json({
                success: false,
                message: 'Correo o contraseña incorrecta',
            });
            return;
        }
        // Solo usuarios con rol de administrador pueden loguear
        if (foundedUser.role !== 'admin') {
            res.status(200).json({
                success: false,
                message: 'Correo o contraseña incorrecta',
            });
            return;
        }
        // Creamos el JWT
        const accessToken = jwt.sign(
            {
                firstName: foundedUser.firstName,
                email: foundedUser.email,
                role: foundedUser.role,
                id: foundedUser._id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '2h',
            }
        );

        res.status(200).json({
            success: true,
            message: 'Autenticación correcta',
            accessToken,
            firstName: foundedUser.firstName,
            role: foundedUser.role,
            email: foundedUser.email,
        });
    } catch (error) {
        next(error);
    }
};

const handleSignUp = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Trabajar con los datos saneados del express validator
        const data = matchedData(req);

        const { email, password } = data;

        // Validar si el email existe en la base de datos
        let user = await User.findOne({ email });

        if (user) {
            return res
                .status(400)
                .json({ msg: 'El correo ya se encuentra registrado en el sitio' });
        }

        user = new User(data);

        // Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        // Store hash in your password DB.
        user.role = 'admin';
        await user.save();
        return res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

module.exports = { handleLogin, validateToken, handleSignUp };
