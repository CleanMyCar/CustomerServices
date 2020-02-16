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
        if (result.recordsets[0] && result.recordsets[0][0] && result.recordsets[0][0]["UserId"] && (params.systemParams.Source == "Android" || params.systemParams.Source == "IOS")) {
            const deviceParams = config.dbwrapper.getNewRequest();
            deviceParams.input('UserId', mssql.Int, result.recordsets[0][0]["UserId"]);
            deviceParams.input('Source', mssql.NVarChar, params.systemParams.Source);
            deviceParams.input('DeviceId', mssql.NVarChar, params.systemParams.SourceId);

            deviceParams.execute('AddDeviceIdToUser', (err, response) => {
                if (err) {
                    console.log(err);
                }
            })
        }
        return callback(null, result);
    })
}