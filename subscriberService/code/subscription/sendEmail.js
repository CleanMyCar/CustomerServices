
let nodeMailer = require('nodemailer');
module.exports = (config, params, callback) => {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'contact@cleanmycar.in',
            pass: 'ANV@2019'
        }
    });
    let mailOptions = {
        from: 'contact@cleanmycar.in', // sender address        
        to: params.Email, // list of receivers
        subject: params.MessageTitle, // Subject line
        // text: params.MessageBody, // plain text body
        html: params.MessageBody // html body,

    };

    // config.logger.info("mail sent with these params => ", mailOptions)

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return callback(error);
        }
        console.log('Message sent to : ', params.Email);
        callback(null, info);
    });

};