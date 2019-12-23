const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('AddressId', mssql.Int, params.AddressId);
    requestParams.input('IsDefault', mssql.Int, params.IsDefault);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);

    requestParams.execute('ChangeDefaultAddress', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}