module.exports = (config, params, callback) => {

    config.utils.sqlConnectionCall(params, 'UpdateUserProfile',
        function (result) {
            callback(undefined, result);
        },
        function (err) {
            callback(err, undefined);
        }
    );
};