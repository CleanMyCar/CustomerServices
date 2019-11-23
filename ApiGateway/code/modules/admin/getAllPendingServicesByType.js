const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    let sp_name = "GetPendingVehicleServices";
    if (params.StatusType == 1) {
        sp_name = "GetPendingVehicleServices"
    }
    else if (params.StatusType == 2) {
        return callback(null, [])
    }
    else if (params.StatusType == 3) {
        return callback(null, [])
    }

    requestParams.execute(sp_name, (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        return callback(null, result.recordsets[0]);
    })
}