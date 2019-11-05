const md5 = require('md5');
//const mssql = require('mssql');

module.exports = (config, params, callback) => {

    Promise.all([
    ])
        .then(data => {
            console.log("ValidateUser", params);
            config.utils.sqlConnectionCall(params, 'ValidateUser',
                function (result) {
                    callback(undefined, result);
                },
                function (err) {
                    callback(err, undefined);
                }
            );

            // const requestParams = config.dbwrapper.getNewRequest();
            // requestParams.input('LoginID', mssql.NVarChar, params.UserName);
            // requestParams.input('UserPassword', mssql.NVarChar, params.Password);
            // requestParams.input('ClientCode', mssql.NVarChar, params.ClientCode);

            // requestParams.execute('ValidateUser', (err, result) => {
            //     if (err) {
            //         console.log(err);
            //         callback(err);
            //         return
            //     }

            //     console.log(result);
            //     callback(null, result);

            // })


        })
        .catch(reason => {
            console.log(reason);
            callback(reason)
        });
}