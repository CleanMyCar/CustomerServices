const mssql = require('mssql');
const generateOtp = require("./generateOtp")
const request = require("request-promise");
const sendEmail = require("../common/sendEmail")

module.exports = async (config, params, callback) => {
    let userOtp = await generateOtp();
    while (userOtp.length != 6) {
        userOtp = await generateOtp();
    }

    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('Otp', mssql.Int, userOtp);

    requestParams.execute('SaveUserOtp', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        if (result.recordsets[0] && result.recordsets[0][0]) {
            if (params.type == "mobile" && result.recordsets[0][0].MobileNumber) {

                let otpMessage = `Please use OTP ${userOtp} to verify your Mobile Number`
                var options = {
                    method: 'POST',
                    url: `https://www.bulksmsgateway.in/sendmessage.php?user=CleanMyCar&password=ANV@2019anv&message=${otpMessage}&sender=CMYCAR&mobile=${result.recordsets[0][0].MobileNumber}&type=3`
                };

                request(options)
                    .then(function (parsedBody) {
                        return callback(null, result.recordsets[0]);
                    })
                    .catch(function (err) {
                        console.log(err)
                        return callback(err, result.recordsets[0]);
                    });
            }
            if (params.type == "email" && result.recordsets[0][0].Email) {

                let message = `Hi ${result.recordsets[0][0].UserFirstName}, <br> Please use OTP ${userOtp} to verify your registered E-mail. <br><br> Thanks, <br> CleanMyCar Team`;
                sendEmail(config, {
                    Email: result.recordsets[0][0].Email,
                    MessageTitle: "Verify E-mail",
                    MessageBody: message
                }, function (err, response) {
                    if (err) {
                        console.log("OTP - email sending failed ", err)
                    }                    
                    callback(null, result.recordsets[0]);
                });
            }
        }
        else {
            callback("no user found")
        }
    })
}