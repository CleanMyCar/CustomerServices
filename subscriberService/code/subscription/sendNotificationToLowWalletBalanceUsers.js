let moment = require("moment")
let mssql = require("mssql");
let sendSms = require("./sendSms");
let sendEmail = require("./sendEmail")

module.exports = async (config, params) => {
    
    return new Promise((resolve, reject) => {
        const requestParams = config.dbwrapper.getNewRequest();

        requestParams.execute("GetInsufficientBalanceUsers", (err, result) => {
            if (err) {
                console.log(err);
                resolve(false);
            }

            for(let user in result.recordsets[0]){
                if(user.MobileNumber){
                    let message = `Dear Customer, Your CleanMyCar wallet balance is too low. Recharge immediately to get seamless services from CleanMyCar app.\nThanks, \nTeam CleanMyCar`
                    sendSms(config, {
                        message: message,
                        mobileNumber: user.MobileNumber
                    }, 
                    function(err, resp){

                    })

                    sendEmail(config, {
                        Email: user.Email,
                        MessageTitle: "CleanMyCar - Low balance Alert",
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