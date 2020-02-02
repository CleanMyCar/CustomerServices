let moment = require("moment")
let mssql = require("mssql");

module.exports = async (config, params) => {
    
    return new Promise((resolve, reject) => {
        const requestParams = config.dbwrapper.getNewRequest();

        requestParams.execute("SuspendInsufficientBalanceServices", (err, result) => {
            if (err) {
                console.log(err);
                resolve(false);
            }

            return resolve(result.recordsets[0]);
        });
    })
}