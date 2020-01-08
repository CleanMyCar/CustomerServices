const mssql = require('mssql');

module.exports = (config, params, callback) => {

    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.UserId);
    requestParams.input('Otp', mssql.INT, params.Otp);

    requestParams.execute('ValidateUserOtp', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        return callback(null, result.recordsets[0]);
    })
}