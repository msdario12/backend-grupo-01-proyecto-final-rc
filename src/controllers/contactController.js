import { transporter } from "../config/mailer";

try {
        await transporter.sendMail({
        from: '"RollingVet" <rollingvetmail@gmail.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
    
} catch (error) {
    console.error(error);
}