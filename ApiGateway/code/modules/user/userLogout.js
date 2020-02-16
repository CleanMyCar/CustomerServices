module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('DeviceId', mssql.Int, params.DeviceId);

    requestParams.execute('RemoveDeviceToken', (err, result) => {
        if (err) {
            console.log(err);
            return callback(err);            
        }
        
        return callback(null)
    });
}