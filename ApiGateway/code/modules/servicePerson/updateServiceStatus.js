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
        if(result.recordsets[0] && result.recordsets[0][0] && result.recordsets[0][0]["ErrorMessage"] && result.recordsets[1] && result.recordsets[1][0]["MobileNumber"]){
            sendSms(config, {
                message: `Hi ${result.recordsets[0][0]["FirstName"]}, You have insufficient amount in wallet to complete service. Please recharge ASAP to complete service. Thanks, CleanMyCar`,
                mobileNumber: result.recordsets[1][0]["MobileNumber"]
            }, function(err, resp){
        
            })
        }
        return callback(null, result.recordsets[0]);
    })
}