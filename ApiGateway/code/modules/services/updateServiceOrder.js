const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('ServiceId', mssql.Int, params.ServiceId);
    requestParams.input('ServiceOrder', mssql.Int, params.ServiceOrder ? params.ServiceOrder: null);

    requestParams.execute('UpdateServiceOrder', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}