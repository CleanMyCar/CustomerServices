const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('RequestId', mssql.Int, params.RequestId);
    requestParams.input('UserId', mssql.Int, params.UserId);

    requestParams.execute('AssignPersonToService', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}