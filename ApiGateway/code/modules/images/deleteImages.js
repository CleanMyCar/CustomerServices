
    const mssql = require('mssql');

module.exports = (config, params, callback) => {

    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('ImageId', mssql.Int, params.ImageId);
        requestParams.input('ImageURL', mssql.NVARCHAR,params.ImageUrl);
        requestParams.input('UpdatedBy', mssql.Int, params.systemParams.UserId);
        requestParams.input('isdelete', mssql.BIT,params.isdelete);
      



    requestParams.execute('UpdateDeleteImages', (err, result) => {
        if (err) {
            console.log(err);
            return callback(err);
        }
        //console.log("GetPropertyList=>",result.recordsets);
        callback(null, result.recordsets);
    })
}