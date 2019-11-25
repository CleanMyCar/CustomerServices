
const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();

    requestParams.input('UserId', mssql.Int, params.UserId);

    requestParams.execute('GetUserPrimaryAddress', (err, result) => {

        if (err) {
            console.log(err);
            callback(err);
            return
        }

        callback(null, result.recordsets[0][0]);
    })
};
