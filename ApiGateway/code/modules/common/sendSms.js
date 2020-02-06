const request = require("request-promise")
module.exports = (config, params, callback) => {
    // let message = `Please use OTP ${params.userOtp} to reset your password in CleanMyCar`
    var options = {
        method: 'POST',
        url: `https://www.bulksmsgateway.in/sendmessage.php?user=CleanMyCar&password=ANV@2019anv&message=${escape(params.message)}&sender=CMYCAR&mobile=${params.mobileNumber}&type=3`
    };

    request(options)
        .then(function (parsedBody) {
            console.log("SMS SENT ", parsedBody)
            return callback(null, parsedBody);
        })
        .catch(function (err) {
            console.log(err)
            return callback(err);
        });
}