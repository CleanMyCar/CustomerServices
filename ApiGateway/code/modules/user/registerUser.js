var md5 = require('md5');
const mssql = require('mssql');
const generateOtp = require("./generateOtp")

module.exports = async (config, params, callback) => {

    let userOtp = await generateOtp();
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.UserId);
    requestParams.input('UserLastName', mssql.NVarChar, params.lastName);
    requestParams.input('UserFirstName', mssql.NVarChar, params.firstName);
    requestParams.input('Email', mssql.NVarChar, params.email);
    requestParams.input('UserPassword', mssql.NVarChar, md5(params.password));
    requestParams.input('StatusId', mssql.Int, 1);
    requestParams.input('LoggedinUser', mssql.Int, 1);
    requestParams.input('ProfileImage', mssql.NVarChar, params.profileImage);
    requestParams.input('MobileNumber', mssql.NVarChar, params.mobileNumber);
    requestParams.input('ReferralCode', mssql.NVarChar, params.referralCode);
    requestParams.input('UserOtp', mssql.NVarChar, userOtp);
    requestParams.input('UserRoleId', mssql.Int, params.userRoleId ? params.userRoleId : 2);


    requestParams.execute('SaveUserDetail', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
        }
        callback(null, result.recordsets);

        //Send E-mail and SMS about registration

    });
};