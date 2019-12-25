const mssql = require('mssql');
const moment = require("moment")

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.UserId)
    requestParams.input('Amount', mssql.Money, params.Amount);
    requestParams.input('WalletId', mssql.Int, params.WalletId)
    
    requestParams.execute('ManualRechargeToUser', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}