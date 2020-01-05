const mssql = require('mssql');

module.exports = (config, params, callback) => {
    let requestParams = config.dbwrapper.getNewRequest();

    requestParams.execute("GetBuildingsAndServicePersons", (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        return callback(null, {
            buildings: result.recordsets[0],
            servicePerons: result.recordsets[1]
        });
    })
}