
const mssql = require('mssql');
const moment = require("moment")

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('FilterDate', mssql.Date, moment.utc(params.Date).format("YYYY-MM-DD"));

    requestParams.execute('GetMyOrders', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        return callback(null, result.recordsets[0]);
    })
}