const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('VehicleId', mssql.Int, params.VehicleId);
    requestParams.input('VehicleNumber', mssql.NVarChar, params.VehicleNumber.toUpperCase());
    requestParams.input('VehicleMake', mssql.NVarChar, params.VehicleMake ? params.VehicleMake.toUpperCase() : null);
    requestParams.input('VehicleModel', mssql.NVarChar, params.VehicleModel ? params.VehicleModel.toUpperCase() : null);
    requestParams.input('ParkingLot', mssql.NVarChar, params.ParkingLot.toUpperCase());
    requestParams.input('AddressId', mssql.Int, params.AddressId);
    requestParams.input('IsPersonal', mssql.Int, params.IsPersonal ? 1 : 0);
    requestParams.input('VehicleTypeId', mssql.Int, params.VehicleTypeId);
    requestParams.input('FourWheelerTypeId', mssql.Int, params.FourWheelerTypeId);
    requestParams.input('StatusId', mssql.Int, 1);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('VehicleName', mssql.NVarChar, params.VehicleName);
    requestParams.input('VehicleImage', mssql.Text, params.VehicleImage);
    requestParams.execute('SaveVehicleDetails', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        return callback(null, result.recordsets[0][0]);
    })
}