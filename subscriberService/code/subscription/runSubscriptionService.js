let getSubscriptionDetails = require("./getSubscriptionDetails");
let moment = require("moment")

module.exports = async (config, params) => {
    let subscriptionDetail = await getSubscriptionDetails(config, params)
    return new Promise((resolve, reject)=>{
        const requestParams = config.dbwrapper.getNewRequest();
        let noOfExecutions = 0;
        requestParams.input('RequestId', mssql.Int, subscriptionDetail.ParentId);
        requestParams.input('Frequency', mssql.Int, subscriptionDetail.Frequency);
        requestParams.input('LastDateOfSubscription', mssql.date, moment.utc(subscriptionDetail.LastDateOfSubscription).format("YYYY-MM-DD"));
        
        if(subscriptionDetail.RemainingCount){
            if(subscriptionDetail.Frequency == 1){
                noOfExecutions =  15 - subscriptionDetail.RemainingCount;
            }
            else if(subscriptionDetail.Frequency == 2){
                noOfExecutions =  20 - subscriptionDetail.RemainingCount;
            }
            else if(subscriptionDetail.Frequency == 3){
                noOfExecutions =  4 - subscriptionDetail.RemainingCount;
            }
            else if(subscriptionDetail.Frequency == 4){
                noOfExecutions =  3 - subscriptionDetail.RemainingCount;
            }
            else if(subscriptionDetail.Frequency == 5){
                noOfExecutions =  1 - subscriptionDetail.RemainingCount;
            }
            else if(subscriptionDetail.Frequency == 6){
                noOfExecutions =  1 - subscriptionDetail.RemainingCount;
            }
        }

        if(noOfExecutions){
            requestParams.input('NoOfExecutions', mssql.int, noOfExecutions);
                requestParams.execute("ExecuteSubscribeFromCronJob", (err, result) => {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    }

                    return resolve(result.recordsets[0]);
                });
        }
        else{
            resolve(true);
        }
    })
}