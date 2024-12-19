var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'guiscatuzzidois@gmail.com',
        pass: 'guigoogle',
    }
});

var mailOptions = {
    from: 'guiscatuzzidois@gmail.com',
    to: 'guiscatuzzi@gmail.com',
    subject: 'Email usando Node.js',
    text: 'Hello World!'
};

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});