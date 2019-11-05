module.exports = (config, params, callback) => {
    config.utils.sqlConnectionCall(params, 'GetUserList',
    function (result) {
        callback(undefined, result);
        // console.log("result userlist",result.recordsets)
    },
    function (err) {
        callback(err, undefined);
    }
);
}