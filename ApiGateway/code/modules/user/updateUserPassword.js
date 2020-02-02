const md5 = require('md5');
const mssql = require('mssql');
const sendEmail = require("../common/sendEmail");

module.exports = (config, params, callback) => {

    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.NVarChar, params.UserId);
    requestParams.input('Password', mssql.NVarChar, md5(params.Password));


    requestParams.execute('UpdateUserPassword', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }        

        if(result.recordsets[0] && result.recordsets[0][0] && result.recordsets[0][0]["Email"]){
            let message = `Dear Customer, \n Your Password for account ${result.recordsets[0][0]["MobileNumber"]} successfully changed. Please login with new password. \n Thanks, \n Team CleanMyCar`;
                sendEmail(config, {
                    Email: result.recordsets[0][0]["Email"],
                    MessageTitle: "Update Password",
                    MessageBody: message
                }, function (err, response) {
                    if (err) {
                        console.log("email sending failed ", err)
                    }                    
                });
        }

        return callback(null, result.recordsets[0]);
    })
}