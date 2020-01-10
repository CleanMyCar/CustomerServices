module.exports = (config, params, callback) => {
    // let message = `Please use OTP ${params.userOtp} to reset your password in CleanMyCar`
    var options = {
        method: 'POST',
        url: `https://www.bulksmsgateway.in/sendmessage.php?user=CleanMyCar&password=ANV@2019anv&message=${params.message}&sender=CMYCAR&mobile=${params.mobileNumber}&type=3`
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