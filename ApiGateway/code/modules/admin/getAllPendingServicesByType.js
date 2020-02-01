const mssql = require('mssql');

module.exports = (config, params, callback) => {
    let requestParams = config.dbwrapper.getNewRequest();
    let sp_name = "GetPendingVehicleServices";
    if (params.serviceStatusId == 1) {
        sp_name = "GetPendingVehicleServices"
    }
    else if ([4, 5, 6].indexOf(params.serviceStatusId) > -1) {
        sp_name = "GetAssignedVehicleServices";
    }
    requestParams.input('ServiceStatusId', mssql.Int, params.serviceStatusId);
    requestParams.input('ServiceDate', mssql.Date, params.ServiceDate);
    requestParams.input('ServiceId', mssql.Int, params.ServiceId);
    requestParams.input('AddressId', mssql.Int, params.AddressId);
    requestParams.input('PersonId', mssql.Int, params.PersonId);

    requestParams.execute(sp_name, (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        return callback(null, result.recordsets[0]);
    })
}