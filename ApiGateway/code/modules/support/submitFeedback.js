const mssql = require('mssql');
let sendEmail = require("./sendEmail");

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('Name', mssql.NVarChar, params.Name);
    requestParams.input('Email', mssql.NVarChar, params.Email);
    requestParams.input('MobileNumber', mssql.NVarChar, params.MobileNumber);
    requestParams.input('Message', mssql.NVarChar, params.Message);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);

    requestParams.execute('SubmitFeedback', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        let messageBody = `Hi Team, <br> <br> Please find my feedback here <br> ${params.Message} <br><br>
                            Regards, <br>
                            ${params.Name} <br>
                            ${params.MobileNumber}<br>
                            ${params.Email}
                            `;

        sendEmail(config, {
            Email: 'contact@cleanmycar.in',
            MessageTitle: "Feedback",
            MessageBody: messageBody
        }, function (err, response) {
            if (err) {
                console.log("Support email sending failed ", err)
            }
        });

        return callback(null, result.recordsets[0][0]);
    })
}