const express = require('express');
const { check } = require('express-validator');
const { sendEmail } = require('../controllers/contactController');

const routerContact = express.Router();

routerContact.post(
    '/contact',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('phone', 'El numero de telefono es obligatorio').not().isEmpty(),
		check('email', 'el email no es valido').not().isEmpty().isEmail(),
        check('description', 'La descripcion es obligatorio').not().isEmpty(),
    ],
    sendEmail,
    
)

module.exports = routerContact;