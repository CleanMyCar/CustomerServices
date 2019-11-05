const mssql = require('mssql');
module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    
        // requestParams.input('ClientId', mssql.INT, params.ClientId);
        requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
        // requestParams.input('FunctionId', mssql.NVarChar,"fncClientList");
    
    // console.log("params in clientList", params);
  
    requestParams.execute('GetClientList_Cpanel', (err, result) => {
        if (err) {
            console.log("GetClientList_Cpanel.error => ", err);
            callback(err, null);
            return
        }
        callback(null, result);
        
    });
};

