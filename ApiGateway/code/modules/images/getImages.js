
const mssql = require('mssql');

module.exports = (config, params, callback) => {

    const requestParams = config.dbwrapper.getNewRequest();
    // requestParams.input('ClientId', mssql.NVarChar, params.systemParams.ClientId);
    if (params.ClientId) {
        requestParams.input('ClientId', mssql.Int, params.ClientId);
        requestParams.input('UnitId', mssql.Int, params.UnitId);
        requestParams.input('PropertyId', mssql.Int, params.PropertyId);
        requestParams.input('UserId', mssql.Int, params.UserId);
    }
    else {
        requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
        requestParams.input('UnitId', mssql.Int, params.UnitId);
        requestParams.input('PropertyId', mssql.Int, params.PropertyId);
        requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
        requestParams.input('BE_Id', mssql.Int, params.BE_Id);
    }


    requestParams.execute('getImages', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }
        // console.log("result in GetRoleList", result.recordsets);     
        callback(null, result);
    })
}


