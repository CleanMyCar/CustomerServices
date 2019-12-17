const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('SearchText', mssql.NVarChar, params.SearchText);
    requestParams.input('NumberOfRecords', mssql.Int, params.NumberOfRecords);

    requestParams.execute('GetServiceList', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);

        let vehiclesWithTypes = {};

        for (let vtIndex = 0; vtIndex < result.recordsets[1].length; vtIndex++) {
            let currVehicleType = result.recordsets[1][vtIndex];
            if (!vehiclesWithTypes.hasOwnProperty(currVehicleType.VehicleTypeId)) {
                vehiclesWithTypes[currVehicleType.VehicleTypeId] = {
                    VehicleCategoryType: currVehicleType.VehicleTypeId,
                    VehicleCategoryTypeName: currVehicleType.VehicleTypeName,
                    services: []
                }
            }
        }

        for (let vIndex = 0; vIndex < result.recordsets[0].length; vIndex++) {
            let currVehicle = result.recordsets[0][vIndex];          
            vehiclesWithTypes[currVehicle.VehicleCategoryType].services.push(currVehicle);
        }

        return callback(null, vehiclesWithTypes);
    })
}