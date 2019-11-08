const otplib = require('otplib');

module.exports = async function (config, params) {

    const secret = '$ProjectServices#123$';
    try {

        otplib.authenticator.options = {
            digits: 6
        };

        const token = otplib.authenticator.generate(secret);

        // const isValid = otplib.authenticator.check(token, secret);
        // // or
        // const isValid = otplib.authenticator.verify({ token, secret });
        return token;
    } catch (err) {
        // Error possibly thrown by the thirty-two package
        // 'Invalid input - it is not base32 encoded string'
        config.logger.error("Exception in GenerateOtp => ", { error: JSON.stringify(err, Object.getOwnPropertyNames(err)) })
        return false;
    }
};