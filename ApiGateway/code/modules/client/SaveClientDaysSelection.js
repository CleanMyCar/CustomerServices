module.exports = (config, params, callback) => {
    
    params.ModuleAction = "SaveClientDaysSelection";
    config.utils.sqlConnectionCall(params, 'SaveClientDaysSelection', function (result) {
       var actualObj = JSON.stringify(result);
    //   console.log("SaveClientDaysSelection procedure" + JSON.stringify(result));
    //    console.log(result)
        callback(undefined, result);
       
    },
        function (err) {
            console.log("there is an error",err)
            callback(err, undefined);
        });
        // console.log("clientweekdaysparams",params);     
};
