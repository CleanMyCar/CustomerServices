const mssql = require("mssql");

module.exports = async (config, params) => {
  return new Promise((resolve, reject) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('RequestId', mssql.Int, params.RequestId);
    requestParams.input('Frequency', mssql.Int, params.Frequency);

    requestParams.execute("GetSubscriptionDetailsToRun", (err, result) => {
      if (err) {
        console.log(err);
        resolve(false);
      }

      return resolve(result.recordsets[0][0]);
    });
  });
};
