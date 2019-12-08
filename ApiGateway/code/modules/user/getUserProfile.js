
const mssql = require('mssql');
module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();

    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);

    let userDetailObjToReturn = {}
    requestParams.execute('GetUserProfile', (err, result) => {

        if (err) {
            console.log(err);
            callback(err);
            return
        }

        let responseObj = {
            userDetails: result.recordsets && result.recordsets[0] && result.recordsets[0][0],
            userWallet: result.recordsets && result.recordsets[1] && result.recordsets[1][0]
        }

        callback(null, responseObj);
    })
};
