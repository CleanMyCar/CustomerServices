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

  requestParams.execute("DeleteSubscription", (err, result) => {
    if (err) {
      console.log(err);
      callback(err);
      return;
    }

    // console.log(result);
    return callback(null, result.recordsets[0][0]);
  });
};
