module.exports = (config, params, callback) => {
    params.ModuleAction = "GetUserDetails";
    // console.log("params in GetUserDetail",params)    
    config.utils.sqlConnectionCall(params, 'GetUserDetail',
        function (result) {
            // console.log("getUserDetail userprofile=>", result.recordsets);
            callback(undefined, result.recordsets);
            
        },
        function (err) {
            callback(err, undefined);
        }
    );
};