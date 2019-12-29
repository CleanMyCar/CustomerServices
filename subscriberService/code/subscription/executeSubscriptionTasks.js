const mssql = require("mssql");
let getSubscriptionServices = require("./getSubscriptionServices");
let runSubscriptionService = require("./runSubscriptionService");

// subscriptTypes
//     1	Daily
//     2	Weekly
//     3	Monthly
//     4	Alternate Day
//     5	Quarterly
//     6	Half Yearly

module.exports = async (config, params) => {
  let subscriptionServices = await getSubscriptionServices(config);
  if (subscriptionServices && subscriptionServices.length) {
    for (let subscription of subscriptionServices) {
      await runSubscriptionService(config, subscription);
    }
  }
  return true;
};
