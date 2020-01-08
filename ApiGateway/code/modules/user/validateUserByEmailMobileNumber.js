const md5 = require('md5');
const mssql = require('mssql');

module.exports = (config, params, callback) => {

    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('Email', mssql.NVarChar, params.email);

    requestParams.execute('ValidateUserEmailMobileNumber', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        return callback(null, result.recordsets[0]);
    })
}