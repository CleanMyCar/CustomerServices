const mssql = require('mssql');
const moment = require("moment")

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    let startDate = moment(params.ServicePauseDate).format("YYYY-MM-DD"),
        endDate = moment(params.ServiceEndDate).format("YYYY-MM-DD");

    requestParams.input('RequestId', mssql.Int, params.RequestId);
    requestParams.input('ServicePauseDate', mssql.Date, startDate);
    requestParams.input('ServiceEndDate', mssql.Date, endDate);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);

    requestParams.execute('PauseSubscription', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        let message = `Dear Customer, \nYour subscription ${result.recordsets[1][0]["ServiceName"]} is paused from ${startDate} to ${endDate}.\nThanks, \nTeam CleanMyCar`
        if (result.recordsets[1] && result.recordsets[1].length > 0) {

            for (let deviceObj of result.recordsets[1]) {

                config.pushNotification(config, {
                    deviceId: deviceObj.UserDeviceToken,
                    message: message
                }, function (err, response) {
                    if (err) {
                        console.log("push notification failed", err);
                    }
                });
            }
        }
        else if (result.recordsets[0][0]["MobileNumber"]) {
            config.sendSms(config, {
                message: `Dear Customer, \nYour subscription ${result.recordsets[0][0]["ServiceName"]} has been paused and will be resumed on ${moment(params.ServiceEndDate).format("YYYY-MM-DD")} .\nThanks, \nTeam CleanMyCar`,
                mobileNumber: result.recordsets[0][0]["MobileNumber"]
            }, function (err, resp) {

            })
        }

        if (result.recordsets[0][0]["Email"]) {
            config.sendEmail(config, {
                MessageBody: `Dear Customer, \nYour subscription ${result.recordsets[0][0]["ServiceName"]} has been paused and will be resumed on ${moment(params.ServiceEndDate).format("YYYY-MM-DD")} .\nThanks, \nTeam CleanMyCar`,
                Email: result.recordsets[0][0]["Email"],
                MessageTitle: "CleanMyCar - Subscription Paused",
            }, function (err, resp) {

            })
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}