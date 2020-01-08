const mssql = require('mssql');
const generateOtp = require("./generateOtp")
const request = require("request-promise")

module.exports = async (config, params, callback) => {
    let userOtp = await generateOtp();
    while (userOtp.length != 6) {
        userOtp = await generateOtp();
    }

    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.userId);
    requestParams.input('Otp', mssql.Int, userOtp);

    requestParams.execute('SaveUserOtp', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        if (result.recordsets[0] && result.recordsets[0][0]) {
            if (result.recordsets[0][0].MobileNumber) {

                let otpMessage = `Please use OTP ${userOtp} to reset your password in CleanMyCar`
                var options = {
                    method: 'POST',
                    url: `https://www.bulksmsgateway.in/sendmessage.php?user=CleanMyCar&password=ANV@2019anv&message=${otpMessage}&sender=CMYCAR&mobile=${result.recordsets[0][0].MobileNumber}&type=3`
                };

                request(options)
                    .then(function (parsedBody) {
                        // POST succeeded...
                    })
                    .catch(function (err) {
                        console.log(err)
                    });
            }
        }

        return callback(null, result.recordsets[0]);
    })
}