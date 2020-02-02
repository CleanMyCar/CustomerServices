const mssql = require('mssql');
const moment = require("moment")

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('RequestId', mssql.Int, params.RequestId);
    requestParams.input('ServicePauseDate', mssql.Date, moment(params.ServicePauseDate).format("YYYY-MM-DD"));
    requestParams.input('ServiceEndDate', mssql.Date, moment(params.ServiceEndDate).format("YYYY-MM-DD"));

    requestParams.execute('PauseSubscription', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        if (result.recordsets[0][0]["MobileNumber"]) {
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