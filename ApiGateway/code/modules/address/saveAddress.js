const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('AddressId', mssql.Int, params.AddressId);
    requestParams.input('AddressLine1', mssql.NVarChar, params.AddressLine1);
    requestParams.input('AddressLine2', mssql.NVarChar, params.AddressLine2);
    requestParams.input('Landmark', mssql.NVarChar, params.Landmark);
    requestParams.input('CountryId', mssql.Int, params.Country);
    requestParams.input('StateId', mssql.Int, params.State);
    requestParams.input('CityId', mssql.Int, params.City);
    requestParams.input('Pincode', mssql.Int, params.Pincode);
    requestParams.input('IsDefault', mssql.Int, params.IsDefault ? 1 : 0);
    requestParams.input('StatusId', mssql.Int, params.StatusId);
    requestParams.input('UserId', mssql.Int, params.IsUserAddress ? params.systemParams.UserId: null);

    requestParams.execute('SaveAddress', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}