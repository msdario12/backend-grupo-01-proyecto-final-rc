const { validationResult } = require('express-validator');
const { transporter } = require('nodemailer');
const Contact = require("../models/contactModel");

const sendEmail = async (req, res) => {
  const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({
			errors: errors.mapped(),
		});
	}

  try {

    const newContact = new Contact(req.body);
    await newContact.save();

  } catch (error) {
    console.error(error);
  }


  try {
    await transporter.sendMail({
    from: '"RollingVet" <rollingvetmail@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

} catch (error) {
console.error(error);
}

}

module.exports = {
  sendEmail,
};