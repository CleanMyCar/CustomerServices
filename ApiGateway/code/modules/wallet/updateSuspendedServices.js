const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);

    requestParams.execute('ActivateUserSuspendedServices', (err, result) => {
        if (err) {
            console.log("activate services failed", err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, "success");
    })
}