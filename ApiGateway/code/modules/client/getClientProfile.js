module.exports = (config, params, callback) => {

    config.utils.sqlConnectionCall(params, 'ValidateClientCode',
        function (result) {
            callback(undefined, result);
        },
        function (err) {
            callback(err, undefined);
        }
    );

}