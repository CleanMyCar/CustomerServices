module.exports = (config, params, callback) => {

    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('Email', mssql.NVarChar, params.Email);
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