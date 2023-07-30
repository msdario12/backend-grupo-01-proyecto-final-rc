const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'rollingvetmail@gmail.com',
      pass: 'czbjxnypckgbdkhy'
    }
  });

  transporter.verify().then( () => {
    console.log("Email enviado")
  })