const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('ServiceId', mssql.Int, params.serviceDetail.ServiceId);
    requestParams.input('ServiceName', mssql.NVarChar, params.serviceDetail.ServiceName);
    requestParams.input('IsEnabled', mssql.Int, params.serviceDetail.IsEnabled ? 1 : 0);
    requestParams.input('ServiceImage', mssql.Text, params.serviceDetail.ServiceImage);
    requestParams.input('ServiceDescription', mssql.Text, params.serviceDetail.ServiceDescription);
    requestParams.input('SubscriptionPrice', mssql.Money, params.serviceDetail.SubscriptionPrice);
    requestParams.input('Price', mssql.Money, params.serviceDetail.Price);

    requestParams.input('VehicleCategoryType', mssql.INT, params.serviceDetail.VehicleCategoryType);
    requestParams.input('IsSubscriptionEnabled', mssql.INT, params.serviceDetail.IsSubscriptionEnabled ? 1 : 0);
    requestParams.input('IsPurchaseOnceEnabled', mssql.INT, params.serviceDetail.IsPurchaseOnceEnabled ? 1 : 0);

    let ServiceFourWheelerTypes = new mssql.Table();
    ServiceFourWheelerTypes.columns.add('VehicleCategoryType', mssql.Int);
    for (let i = 0; i < params.serviceDetail.serviceFourWheelerTypes.length; i++) {

        ServiceFourWheelerTypes.rows.add(params.serviceDetail.serviceFourWheelerTypes[i]);
    }
    requestParams.input('ServiceFourWheelerTypes', ServiceFourWheelerTypes);

    let ServiceSubscriptionTypes = new mssql.Table();
    ServiceSubscriptionTypes.columns.add('SubscribeTypeId', mssql.Int);
    for (let i = 0; i < params.serviceDetail.serviceSubscribeTypes.length; i++) {

        ServiceSubscriptionTypes.rows.add(params.serviceDetail.serviceSubscribeTypes[i]);
    }
    requestParams.input('ServiceSubscriptionTypes', ServiceSubscriptionTypes);

    let VehicleServicePrice = new mssql.Table();
    VehicleServicePrice.columns.add('VehicleCategoryType', mssql.Int);
    VehicleServicePrice.columns.add('SubscriptionPrice', mssql.Money);
    VehicleServicePrice.columns.add('Price', mssql.Money);
    for (let i = 0; i < params.fourWheelerTypes.length; i++) {
        if (params.fourWheelerTypes[i].Price || params.fourWheelerTypes[i].SubscriptionPrice)
            VehicleServicePrice.rows.add(params.fourWheelerTypes[i].Id, params.fourWheelerTypes[i].SubscriptionPrice, params.fourWheelerTypes[i].Price);
    }
    requestParams.input('VehicleServicePrice', VehicleServicePrice);
    
    requestParams.execute('SaveServiceDetails', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}