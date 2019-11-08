
const mssql = require('mssql');
module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();

    requestParams.input('UserId', mssql.Int, params.UserId);

    let userDetailObjToReturn = {}
    requestParams.execute('GetUserDetail', (err, result) => {

        if (err) {
            console.log(err);
            callback(err);
            return
        }

        if (result.hasOwnProperty("recordsets") && Array(result.recordsets) && result.recordsets.length > 0) {
            if (Array.isArray(result.recordsets[0]) && result.recordsets[0].length > 0) {
                userDetailObjToReturn.userObj = result.recordsets[0][0];
            }
        }

        callback(null, userDetailObjToReturn);
    })
};
