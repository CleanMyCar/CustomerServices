const mssql = require("mssql");
const moment = require("moment");

module.exports = (config, params, callback) => {
  try {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input("RequestId", mssql.Int, params.RequestId);
    requestParams.input("VehicleId", mssql.Int, params.VehicleId);
    requestParams.input("ServiceType", mssql.NVarChar, params.ServiceType);
    requestParams.input("ServiceId", mssql.NVarChar, params.ServiceId);
    requestParams.input("Frequency", mssql.NVarChar, params.Frequency);
    requestParams.input("Promocode", mssql.NVarChar, params.Promocode);
    // requestParams.input('StatusId', mssql.Int, 1);
    requestParams.input("UserId", mssql.Int, params.systemParams.UserId);
    requestParams.input("TimeSlot", mssql.NVarChar, params.TimeSlot);
    requestParams.input("WeeklyDay", mssql.Int, params.WeeklyDay);
    requestParams.input(
      "ServiceDate",
      mssql.Date,
      moment(params.ServiceDate).format("YYYY-MM-DD")
    );
    requestParams.input("Quantity", mssql.Int, params.Quantity);
    requestParams.input(
      "ServiceStausId",
      mssql.Int,
      params.StatusId || params.StatusId == 0 ? params.StatusId : 1
    );
    requestParams.input("OtherAddressId", mssql.Int, params.OtherAddressId);

    requestParams.execute("SaveVehicleRequest", (err, result) => {
      if (err) {
        console.log(err);
        callback(err);
        return;
      }

      if (
        (params.RequestId == -1 || !params.RequestId) &&
        result.recordsets[0][0]
      ) {
        //When it is new service request, create subscription items for the Request
        
        runDailySubscriptionService(config, result.recordsets[0][0], params.Frequency);
        
      }

      return callback(null, result.recordsets[0][0]);
    });
  } catch (ex) {
    console.log(ex);
  }
};

let runDailySubscriptionService = function(config, params, frequency) {
  return new Promise((resolve, reject) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input("RequestId", mssql.Int, params.RequestId);
    requestParams.input("Frequency", mssql.Int, frequency);
    requestParams.execute("CreateDailySubscriptionItems", (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  });
};

