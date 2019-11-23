
const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('SearchText', mssql.NVarChar, params.searchText);

    requestParams.execute('GetAddressBySearch', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0]);
    })
}