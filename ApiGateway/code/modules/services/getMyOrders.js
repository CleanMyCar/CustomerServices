
const mssql = require('mssql');
const moment = require("moment")

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);

    requestParams.execute('GetMyOrders', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        let activeOrders = result.recordsets[0].filter((order) => {
            return order.ServiceStatusId == 1 || order.ServiceStatusId == 4;
        })

        let historyOrders = result.recordsets[0].filter((order) => {
            return order.ServiceStatusId != 1 && order.ServiceStatusId != 4;
        })

        // console.log(result);
        return callback(null, { activeOrders: activeOrders, allOrders: historyOrders });
    })
}