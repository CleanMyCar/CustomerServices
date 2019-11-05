const mssql = require('mssql');


let getClientDetailByIdParams = function (columns) {
    let newClientObject = {};

    Object.keys(columns).forEach(function (colName) {
        newClientObject[colName.toString()] = null;
    });

    return newClientObject;
};


module.exports = (config, params, callback) => {

    const requestParams = config.dbwrapper.getNewRequest();
    // requestParams.input('RoleId', mssql.NVarChar, params.RoleId);
    if(params.ClientId){
        requestParams.input('ClientId', mssql.Int, params.ClientId);
        requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    }
    else{
        requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
        requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    }
    


    requestParams.execute('GetClientDetail', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }
        
        // if (result.recordsets.length > 1 && result.recordsets[5].length === 0) {
        //     result.recordsets[6][0] = getClientDetailByIdParams(result.recordsets[6].columns);
            
        // }

        // if (result.recordsets.length > 1 && result.recordsets[6].length === 0) {
        //     console.log("result in getClientDetailByIdParams", result.recordsets[8]);
        //     result.recordsets[7][0] = getClientDetailByIdParams(result.recordsets[7].columns);
        //     result.recordsets[7][1] = result.recordsets[7][0];
        // } else if (result.recordsets.length > 1 && result.recordsets[7].length === 1) {
            
        //     if (result.recordsets[7][0]["AddressTypeId"] === 3) {
        //         result.recordsets[7][1] = getClientDetailByIdParams(result.recordsets[7].columns);
        //     }
        //     else {
        //         result.recordsets[7][0] = getClientDetailByIdParams(result.recordsets[7].columns);
        //     }
        // }

        // if (result.recordsets.length > 1 && result.recordsets[7].length === 0) {
        //     result.recordsets[8][0] = getClientDetailByIdParams(result.recordsets[8].columns);
        //     result.recordsets[8][1] = getClientDetailByIdParams(result.recordsets[8].columns);
        // } else if (result.recordsets.length > 1 && result.recordsets[8].length === 1) {
        //     if (result.recordsets[8][0]["ContentType"] === 2) {
        //         result.recordsets[8] = getClientDetailByIdParams(result.recordsets[8].columns);
        //     }
            
        // }
        if(result.recordsets){
            //console.log("result in clientdetail", result.recordsets);
            callback(null, result);
        }
        
        // callback(null, result);
    })
};