module.exports = (config, params, callback) => {
    params.ModuleAction = "AddClientDetails";
    config.utils.sqlConnectionCall(params, 'SaveClientDetail', function (result) {
     //   var actualObj = JSON.stringify(result);
     //  console.log("SaveClientDetail procedure" + JSON.stringify(result));
      //  console.log(result)
        callback(undefined, result);
    },
        function (err) {
            console.log("there is an error",err)
            callback(err, undefined);
        });
};