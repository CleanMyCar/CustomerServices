let nodeMailer = require('nodemailer');

module.exports = (config, params, callback) => {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'info@voltuswave.com',
            pass: 'Vone#123$'
        }
    });
    let mailOptions = {
        from: params.FromEmail, // sender address        
        to: params.Email, // list of receivers
        replyTo: params.ReplyTo,
        subject: params.MessageTitle, // Subject line
        // text: params.MessageBody, // plain text body
        html: params.MessageBody // html body,
        
    };

    config.logger.info("mail sent with these params => ", mailOptions)

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return callback(error);
        }
        console.log('Message sent to : ', params.Email);
        callback(null, info);
    });
};