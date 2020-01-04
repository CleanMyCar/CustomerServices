const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('VehicleId', mssql.Int, params.VehicleId);
    requestParams.input('Flag', mssql.Int, params.Flag);

    requestParams.execute('UpdateVehicleNotificationFlag', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}