const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('ServiceId', mssql.Int, params.ServiceId);
    requestParams.input('ServiceName', mssql.NVarChar, params.ServiceName);
    requestParams.input('Price', mssql.Money, params.Price);
    requestParams.input('SubscriptionPrice', mssql.Money, params.SubscriptionPrice);
    requestParams.input('IsEnabled', mssql.Int, params.IsEnabled ? 1 : 0);
    requestParams.input('ServiceImage', mssql.Text, params.ServiceImage);
    requestParams.input('ServiceDescription', mssql.Text, params.ServiceDescription);

    requestParams.execute('SaveServiceDetails', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}