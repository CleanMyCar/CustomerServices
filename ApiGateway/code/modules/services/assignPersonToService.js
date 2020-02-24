const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('RequestId', mssql.Int, params.RequestId);
    requestParams.input('UserId', mssql.Int, params.UserId);

    requestParams.execute('AssignPersonToService', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);

        if (result.recordsets[0] && result.recordsets[0].length > 0) {
            let message = `Dear Customer, \nYour subscription for ${result.recordsets[0][0]["ServiceName"]} is assigned successfully. \nThanks, \nTeam CleanMyCar`
            config.sendEmail(config, {
                MessageBody: message,
                Email: result.recordsets[0][0]["Email"],
                MessageTitle: "CleanMyCar - Subscription Assigned",
            }, function (err, resp) {

            })

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
        }



        return callback(null, result.recordsets[0][0]);
    })
}