const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('SearchText', mssql.NVarChar, params.SearchText);
    requestParams.input('NumberOfRecords', mssql.Int, params.NumberOfRecords);

    requestParams.execute('GetServiceList', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0]);
    })
}