const sendSms = require("../common/sendSms")
const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();

    requestParams.input('RequestId', mssql.Int, params.RequestId);
    requestParams.input('Reason', mssql.NVarChar, params.Notes);
    requestParams.input('StatusId', mssql.Int, params.StatusId);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('ServiceProofImage', mssql.Text, params.Attachment);

    requestParams.execute('UpdateServiceStatus', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        if (result.recordsets[0] && result.recordsets[0][0] && result.recordsets[1] && result.recordsets[1][0] && result.recordsets[1][0]["MobileNumber"]) {

            let message = ``
            if (result.recordsets[0][0]["ErrorMessage"]) {
                message = `Hi ${result.recordsets[1][0]["FirstName"]}, You have insufficient amount in wallet to complete service. Please recharge ASAP to complete service. Thanks, CleanMyCar`
            }
            else if (params.StatusId == 5 || params.StatusId == 6 && result.recordsets[1] && result.recordsets[0]) {
                message = `Hi ${result.recordsets[1][0]["FirstName"]}, Your service for vehicle ${result.recordsets[0][0]["VehicleNumber"]} is ${params.StatusId == 6 ? 'not' : ''} completed ${params.Notes ? 'with notes' + params.Notes : ''}. Thanks, CleanMyCar`

                config.sendEmail(config, {
                    MessageBody: `Sir, \nCustomer subscription for the vehicle ${result.recordsets[0][0]["VehicleNumber"]} is ${params.StatusId == 6 ? 'not' : ''} completed successfully.\n
                                  Please find the customer details here \n 
                                  Name: ${result.recordsets[1][0]["FirstName"]} \n
                                  Mobile: ${result.recordsets[1][0]["MobileNumber"]} \n\n
                                  Please keep this reference number for future #${result.recordsets[0][0]["RequestId"]} 
                                  `,
                    Email: "contact@cleanmycar.in",
                    MessageTitle: "Service completed",
                }, function (err, resp) {
                    
                })
            }

            if (message && result.recordsets[2] && result.recordsets[2].length > 0) {

                for (let deviceObj of result.recordsets[2]) {

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
            else if(message){
                
                sendSms(config, {
                    message: message,
                    mobileNumber: result.recordsets[1][0]["MobileNumber"]
                }, function (err, resp) {

                })

            }

            
        }

        return callback(null, result.recordsets[0][0]);
    })
}