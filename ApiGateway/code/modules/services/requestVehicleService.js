const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('RequestId', mssql.Int, params.RequestId);
    requestParams.input('VehicleId', mssql.Int, params.VehicleId);
    requestParams.input('ServiceType', mssql.NVarChar, params.ServiceType);
    requestParams.input('ServiceId', mssql.NVarChar, params.ServiceId);
    requestParams.input('Frequency', mssql.NVarChar, params.Frequency);
    requestParams.input('Promocode', mssql.NVarChar, params.Promocode);
    // requestParams.input('StatusId', mssql.Int, 1);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);

    requestParams.execute('SaveVehicleRequest', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}