const nodemailer = require('nodemailer');
require('dotenv').config();

var mail = async ({ email, password }) => {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD
        }
    });

    let mailDetails = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Test mail',
        text: password
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    })
}
module.exports = {
    mail: mail
}