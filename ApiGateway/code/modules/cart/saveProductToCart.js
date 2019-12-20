const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('ProductId', mssql.Int, params.RequestId);
    requestParams.input('Quantity', mssql.INT, params.Quantity);
    requestParams.input('UserId', mssql.INT, params.systemParams.UserId);

    requestParams.execute('SaveProductToCart', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}