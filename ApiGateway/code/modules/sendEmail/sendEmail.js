
let nodeMailer = require('nodemailer');

module.exports = (config, params, callback) => {
    let transporter = nodeMailer.createTransport({
        service: params.Service,
        // host: 'smtp.office365.com',
        // port: 587,
        // secure: false,
        auth: {
            user: params.FromEmail,
            pass: params.Password
        }
    });
    let mailOptions = {
        from: params.FromEmail, // sender address        
        to: params.Email, // list of receivers
        replyTo: params.ReplyTo,
        subject: params.MessageTitle, // Subject line
        text: params.MessageBody, // plain text body
        html: params.MessageBody // html body,      
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return callback(error);
        }
        // console.log('Message %s sent: %s', info.messageId, info.response);
        callback(null, info);
    });
};