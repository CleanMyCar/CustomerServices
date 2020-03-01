const mssql = require("mssql");

module.exports = (config, params, callback) => {
  const requestParams = config.dbwrapper.getNewRequest();
  requestParams.input("RequestId", mssql.Int, params.serviceObj.RequestId);

  let deletedReasons = new mssql.Table();
  deletedReasons.columns.add("ReasonId", mssql.Int);
  for (let i = 0; i < params.selectedReasons.length; i++) {
    deletedReasons.rows.add(params.selectedReasons[i]);
  }
  requestParams.input("DeletedReasons", deletedReasons);

  requestParams.input("DeletedReason", mssql.NVarChar, params.serviceObj.OtherReason);
  requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
  
  requestParams.execute("DeleteSubscription", (err, result) => {
    if (err) {
      console.log(err);
      callback(err);
      return;
    }

    let message = `Dear Customer, \nYour deleted subscription for ${result.recordsets[1][0]["ServiceName"]}. If you have not done please report to customer care.\nThanks, \nTeam CleanMyCar`
    if (result.recordsets[1] && result.recordsets[1].length > 0) {

        for (let deviceObj of result.recordsets[1]) {

            config.pushNotification(config, {
                deviceId: deviceObj.UserDeviceToken,
                message: message
            }, function (err, response) {
                if (err) {
                    console.log("push notification failed", err);
                }
            });
        }
    }
    // console.log(result);
    return callback(null, result.recordsets[0][0]);
  });
};
