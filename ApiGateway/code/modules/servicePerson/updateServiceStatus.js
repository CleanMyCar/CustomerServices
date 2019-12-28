
const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    
    requestParams.input('RequestId', mssql.Int, params.RequestId);
    requestParams.input('Reason', mssql.NVarChar, params.Notes);
    requestParams.input('StatusId', mssql.Int, params.StatusId);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('Amount', mssql.Money, params.Amount);
    requestParams.input('ServiceProofImage', mssql.Text, params.Attachment);

    requestParams.execute('UpdateServiceStatus', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0]);
    })
}