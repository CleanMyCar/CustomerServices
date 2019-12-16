const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('ServiceId', mssql.Int, params.serviceId);

    requestParams.execute('GetServiceDetail', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        let serviceSubscribeTypes = [];
        for (let sIndex = 0; sIndex < result.recordsets[4].length; sIndex++) {
            serviceSubscribeTypes.push(result.recordsets[4][sIndex]["SubscribeTypeId"])
        }

        let serviceFourWheelerTypes = [];
        for (let sIndex = 0; sIndex < result.recordsets[5].length; sIndex++) {
            serviceFourWheelerTypes.push(result.recordsets[5][sIndex]["VehicleCategoryType"])
        }

        let serviceDetail = result.recordsets[0][0];
        if (!serviceDetail) {
            serviceDetail = {};
        }
        serviceDetail.serviceSubscribeTypes = serviceSubscribeTypes
        serviceDetail.serviceFourWheelerTypes = serviceFourWheelerTypes

        return callback(null, {
            serviceDetail: serviceDetail,
            vehicleTypes: result.recordsets[1],
            fourWheelerTypes: result.recordsets[2],
            subscribeTypes: result.recordsets[3],

        });
    })
}