
const mssql = require('mssql');
const moment = require("moment");

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    
    requestParams.input('RequestId', mssql.Int, params.RequestId);
    requestParams.input("Frequency", mssql.NVarChar, params.Frequency);
    requestParams.input("TimeSlot", mssql.NVarChar, params.TimeSlot);
    requestParams.input("WeeklyDay", mssql.Int, params.WeeklyDay);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);

    requestParams.execute('UpdateSubscription', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        if(result.recordsets[0] && result.recordsets[0][0] && result.recordsets[0][0]["IsChanged"] == 1){
            runDailySubscriptionService(config, params);
        }
        return callback(null, result.recordsets[0]);
    })
}

let runDailySubscriptionService = function(config, params) {
    return new Promise((resolve, reject) => {
      const requestParams = config.dbwrapper.getNewRequest();
      requestParams.input("RequestId", mssql.Int, params.RequestId);
      requestParams.input("Frequency", mssql.Int, params.Frequency);
      requestParams.input("WeekDay", mssql.Int, params.WeeklyDay);
      requestParams.input("ServiceDate", mssql.Date, moment(params.ServiceDate).format("YYYY-MM-DD"));
  
      requestParams.execute("CreateDailySubscriptionItems", (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    });
  };