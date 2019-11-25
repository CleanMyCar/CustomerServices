module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();

    requestParams.execute('GetServicePersonList', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }
        return callback(null, result.recordsets[0]);
    })
}