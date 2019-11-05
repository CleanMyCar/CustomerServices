
const mssql = require('mssql');

module.exports = (config, params, callback) => {

    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
    requestParams.input('searchText', mssql.NVarChar, params.searchText);

    requestParams.execute('GetClientTagsList', (err, result) => {
        if (err) {
            console.log(err);
            return callback(err);
        };
        callback(null, result.recordsets);
    })

}