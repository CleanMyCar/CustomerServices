const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('IsPersonal', mssql.Int, params.IsPersonal);

    requestParams.execute('GetMyProducts', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        let response = {
            vehicles: result.recordsets[0]
        }
        return callback(null, response);
    })
}