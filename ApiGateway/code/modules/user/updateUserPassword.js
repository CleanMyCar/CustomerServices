const md5 = require('md5');
const mssql = require('mssql');

module.exports = (config, params, callback) => {

    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.NVarChar, params.UserId);
    requestParams.input('Password', mssql.NVarChar, md5(params.Password));


    requestParams.execute('UpdateUserPassword', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        return callback(null, result.recordsets[0]);
    })
}