module.exports = (config, params, callback) => {
    let otp = config.utils.GenerateOtp();    
    
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.UserId);
    requestParams.input('Otp', mssql.Int, otp);

    requestParams.execute('SaveUserOtp', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        return callback(null, result.recordsets[0]);
    })
}