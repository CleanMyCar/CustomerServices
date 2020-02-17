const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('ImageId', mssql.Int, params.ImageId);

    requestParams.execute('GetBannerImageById', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        return callback(null, result.recordsets[0][0]);
    })
}