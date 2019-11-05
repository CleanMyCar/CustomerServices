const mssql = require('mssql');
module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    if((params.ClientId)){
        requestParams.input('ClientId', mssql.INT, params.ClientId);
        requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
        // requestParams.input('SortOrder', mssql.NVarChar, params.SortOrder);
        // requestParams.input('SortBy', mssql.NVarChar, params.SortBy);
    
       
    }
    else{
        requestParams.input('ClientId', mssql.INT, params.systemParams.SelectedClientId);
        requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
        // requestParams.input('SortOrder', mssql.NVarChar, params.SortOrder);
        // requestParams.input('SortBy', mssql.NVarChar, params.SortBy);
        
    }
    // console.log("params in clientList", params);
  
    requestParams.execute('GetClientList', (err, result) => {
        if (err) {
            console.log("GetClientList.error => ", err);
            callback(err, null);
            return
        }
        callback(null, result);
        
    });
};

