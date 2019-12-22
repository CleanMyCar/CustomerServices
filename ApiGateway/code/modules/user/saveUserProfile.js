const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserFirstName', mssql.NVarChar, params.UserFirstName);
    requestParams.input('UserLastName', mssql.NVarChar, params.UserLastName);
    requestParams.input('Email', mssql.NVarChar, params.Email);
    requestParams.input('MobileNumber', mssql.NVarChar, params.MobileNumber);
    requestParams.input('ProfileImage', mssql.Text, params.ProfileImage);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);

    requestParams.execute('UpdateUserProfile', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}