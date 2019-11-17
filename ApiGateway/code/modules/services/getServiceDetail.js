const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('ServiceId', mssql.Int, params.serviceId);

    requestParams.execute('GetServiceDetail', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, {
            serviceDetail: result.recordsets[0][0],
            vehicleTypes: result.recordsets[1],
            fourWheelerTypes: result.recordsets[2],
            subscribeTypes:  result.recordsets[3]
        });
    })
}