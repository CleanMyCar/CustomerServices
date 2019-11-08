const md5 = require('md5');
const mssql = require('mssql');

module.exports = (config, params, callback) => {

    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('Email', mssql.NVarChar, params.email);
    requestParams.input('Password', mssql.NVarChar, md5(params.password));

    requestParams.execute('ValidateUser', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        console.log(result);
        return callback(null, result);
    })
}