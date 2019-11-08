var md5 = require('md5');
const mssql = require('mssql');

module.exports = (config, params, callback) => {

    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.UserId);
    requestParams.input('UserLastName', mssql.NVarChar, params.UserLastName);
    requestParams.input('UserFirstName', mssql.NVarChar, params.UserFirstName);
    requestParams.input('Email', mssql.NVarChar, params.Email);
    requestParams.input('UserPassword', mssql.NVarChar, md5(params.UserPassword));
    requestParams.input('StatusId', mssql.Int, params.StatusId);
    requestParams.input('LoggedinUser', mssql.Int, params.systemParams.UserId);
    requestParams.input('ProfileImage', mssql.NVarChar, params.profileImage);
    
    requestParams.execute('SaveUserDetail', (err, result) => {
        if (err) {
            console.log(err);
            return callback(err);            
        }
        callback(null, result.recordsets);
    });
};