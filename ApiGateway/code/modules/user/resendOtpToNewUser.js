const mssql = require("mssql");
const generateOtp = require("./generateOtp");
const sendSms = require("../common/sendSms");

module.exports = async (config, params, callback) => {
    var userOtp = await generateOtp();;
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input("MobileNumber", mssql.NVarChar, params.mobileNumber);
    requestParams.input("UserId", mssql.Int, params.userId);

    requestParams.execute("VerifyRegisterdUser", (err, result) => {
        if (err) {
            console.log(err);
            return callback(err);
        }
        // callback(null, result.recordsets);
        if (result.recordsets && result.recordsets[0] && result.recordsets[0][0] && result.recordsets[0][0]["UserId"]) {
            

            const rParams = config.dbwrapper.getNewRequest();
            rParams.input("Otp", mssql.NVarChar, userOtp);
            rParams.input("UserId", mssql.Int, result.recordsets[0][0]["UserId"]);

            rParams.execute("UpdateRegisterdUserOtp", (err, result) => {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                sendSms(config, {
                    message: `Please use OTP ${userOtp} to complete your registration in CleanMyCar`,
                    mobileNumber: params.mobileNumber
                }, function (err, resp) {

                })

                callback(null, { UserId: result.recordsets[0][0]["UserId"] })
            });
        }
    });
};
