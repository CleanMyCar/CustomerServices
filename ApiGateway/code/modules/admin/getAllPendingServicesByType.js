const mssql = require('mssql');

module.exports = (config, params, callback) => {
    let requestParams = config.dbwrapper.getNewRequest();
    let sp_name = "GetPendingVehicleServices";
    if (params.StatusType == 1) {
        sp_name = "GetPendingVehicleServices"
    }
    requestParams.input('ServiceStatusId', mssql.Int, params.serviceStatusId);

    requestParams.execute(sp_name, (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        return callback(null, result.recordsets[0]);
    })
}