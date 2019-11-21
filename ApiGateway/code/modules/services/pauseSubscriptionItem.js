const mssql = require('mssql');
const moment = require("moment")

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('RequestId', mssql.Int, params.RequestId);
    requestParams.input('ServicePauseDate', mssql.Date, moment(params.StartDate).format("YYYY-MM-DD"));
    requestParams.input('ServiceEndDate', mssql.Date, moment(params.EndDate).format("YYYY-MM-DD"));

    requestParams.execute('PauseSubscription', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}