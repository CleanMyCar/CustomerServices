let moment = require("moment")
let mssql = require("mssql");
let sendSms = require("./sendSms")
let sendEmail = require("./sendEmail")

module.exports = async (config, params) => {
    
    return new Promise((resolve, reject) => {
        const requestParams = config.dbwrapper.getNewRequest();

        requestParams.execute("SuspendInsufficientBalanceServices", (err, result) => {
            if (err) {
                console.log(err);
                resolve(false);
            }

            for(let user in result.recordsets[0]){
                if(user.MobileNumber){
                    let message = `Insufficient Balzance!! Your CleanMyCar service has been put on hold due to insufficient balance. Please recharge immediately using CleanMyCar app.\nThanks, \nTeam CleanMyCar`
                    sendSms(config, {
                        message: message,
                        mobileNumber: user.MobileNumber
                    }, 
                    function(err, resp){

                    })
                    sendEmail(config, {
                        Email: user.Email,
                        MessageTitle: "CleanMyCar - Subscriptions On-Hold",
                        MessageBody: message
                    }, function (err, response) {
                        if (err) {
                            console.log("email sending failed ", err)
                        }
                    });
                }
            }
            return resolve(result.recordsets[0]);
        });
    })
}