module.exports = (config, params, callback) => {
    var md5 = require('md5');
    const mssql = require('mssql');
    //  var sql = require('mssql');
    const requestParams = config.dbwrapper.getNewRequest();
    let tvp_roles = new mssql.Table();
    tvp_roles.columns.add('UserId', mssql.Int);
    tvp_roles.columns.add('RoleId', mssql.Int);

    let tvp_property = new mssql.Table();
    tvp_property.columns.add('UserId', mssql.Int);
    tvp_property.columns.add('PropertyId', mssql.Int);
    // if (params.roleIds.length > 0) {
        for (let i = 0; i < params.roleIds.length; i++) {
            // console.log("roles" + params.roleIds[i].rows);
            tvp_roles.rows.add(params.UserId, params.roleIds[i])

        }
    // }
    // else {
    //     tvp_roles.rows.add(null)
    //     params.roles = tvp_roles;
    // }
    // if (params.propertyIds.length > 0) {
        for (let t = 0; t < params.propertyIds.length; t++) {
            // console.log("properties" + params.propertyIds[t]);
            tvp_property.rows.add(params.UserId, params.propertyIds[t]);
        }
    // }
    // else {
    //     tvp_property.rows.add(null);
    //     params.properties = tvp_property;
    // }

    params.roles = tvp_roles;
    params.properties = tvp_property;

    // console.log("image", mssql.NVarChar, params.ProfileImage);
    // console.log("firstname", mssql.NVarChar, params.UserFirstName);
    requestParams.input('UserId', mssql.Int, params.UserId);
    requestParams.input('LoginId', mssql.NVarChar, params.LoginId);
    // requestParams.input('ClientId', mssql.Int, params.systemParams.ClientId);
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
    requestParams.input('UserLastName', mssql.NVarChar, params.UserLastName);
    requestParams.input('UserFirstName', mssql.NVarChar, params.UserFirstName);
    requestParams.input('Email', mssql.NVarChar, params.Email);
    // requestParams.input('UserPassword', mssql.NVarChar, params.UserPassword);
    requestParams.input('UserPassword', mssql.NVarChar, md5(params.UserPassword));
    requestParams.input('StatusId', mssql.Int, params.StatusId);
    requestParams.input('LoggedinUser', mssql.Int, params.systemParams.UserId);
    requestParams.input('ProfileImage', mssql.NVarChar, params.profileImage);
    requestParams.input('UserRoles', params.roles);
    // console.log("UserRoles=========>", params.roles.rows);
    requestParams.input('DefaultPropertyId', 0);
    requestParams.input('UserProperties', params.properties);
    requestParams.input('FunctionId', mssql.NVarChar, 'fncUserSave');
    // console.log("encrypted password=>", md5(params.UserPassword));
    // console.log("params in SaveUserDetail", params);
    requestParams.execute('SaveUserDetail', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            // return
            //  return reject(err);
        }
        // console.log("result in SaveUserDetail", result.recordsets)
        callback(null, result.recordsets);
        
        // return resolve(result);
    });
};