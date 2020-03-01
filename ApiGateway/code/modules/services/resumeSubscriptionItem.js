const mssql = require('mssql');
const moment = require("moment")

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('RequestId', mssql.Int, params.RequestId);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    
    requestParams.execute('ResumeSubscriptionItem', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        let message = `Dear Customer, \nYour subscription ${result.recordsets[1][0]["ServiceName"]} is resumed.\nThanks, \nTeam CleanMyCar`
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
        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}