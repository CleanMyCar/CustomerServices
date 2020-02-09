const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();

    requestParams.execute('GetConfigurations', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }
        if(result.recordsets[0] && result.recordsets[0][0]){
            config.adminConfig = result.recordsets[0][0];
        }
        return callback(null, result.recordsets[0][0]);
    })
}