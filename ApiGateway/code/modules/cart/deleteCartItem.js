const mssql = require("mssql");

module.exports = (config, params, callback) => {
  const requestParams = config.dbwrapper.getNewRequest();
  requestParams.input("UserId", mssql.INT, params.systemParams.UserId);
  requestParams.input("Id", mssql.INT, params.CartItemId);

  requestParams.execute("DeleteUserCartItem", (err, result) => {
    if (err) {
      console.log(err);
      callback(err);
      return;
    }

    // console.log(result);
    return callback(null);
  });
};
