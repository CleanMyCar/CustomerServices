const mssql = require("mssql");
const moment = require("moment");

module.exports = (config, params, callback) => {
	try {
		const requestParams = config.dbwrapper.getNewRequest();
		requestParams.input("RequestId", mssql.Int, params.RequestId);
		requestParams.input("VehicleId", mssql.Int, params.VehicleId ? params.VehicleId : null);
		requestParams.input("ServiceType", mssql.NVarChar, params.ServiceType);
		requestParams.input("ServiceId", mssql.NVarChar, params.ServiceId);
		requestParams.input("Frequency", mssql.NVarChar, params.Frequency);
		requestParams.input("Promocode", mssql.NVarChar, params.Promocode);
		// requestParams.input('StatusId', mssql.Int, 1);
		requestParams.input("UserId", mssql.Int, params.systemParams.UserId);
		requestParams.input("TimeSlot", mssql.NVarChar, params.TimeSlot);
		requestParams.input("WeeklyDay", mssql.Int, params.WeeklyDay);
		requestParams.input(
			"ServiceDate",
			mssql.Date,
			moment(params.ServiceDate).format("YYYY-MM-DD")
		);
		requestParams.input("Quantity", mssql.Int, params.Quantity);
		requestParams.input(
			"ServiceStausId",
			mssql.Int,
			params.StatusId || params.StatusId == 0 ? params.StatusId : 1
		);
		requestParams.input("OtherAddressId", mssql.Int, params.OtherAddressId);

		requestParams.execute("SaveVehicleRequest", (err, result) => {
			if (err) {
				console.log(err);
				callback(err);
				return;
			}

			if ((params.RequestId == -1 || !params.RequestId) && result.recordsets[0][0]
				&& result.recordsets[0][0].RequestId) {
				//When it is new service request, create subscription items for the Request

				if (params.Frequency)
					runDailySubscriptionService(config, params, result.recordsets[0][0]);

				if (params.StatusId && params.ServiceType == 1) {
					let message = `Dear Customer, \nYour subscription ${result.recordsets[1][0]["ServiceName"]} is submitted successfully. You can modify\/pause service using CleanMyCar app.\nThanks, \nTeam CleanMyCar`
					if (result.recordsets[2] && result.recordsets[2].length > 0) {

						for (let deviceObj of result.recordsets[2]) {

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
					else if (result.recordsets[0][0]["MobileNumber"]) {
						config.sendSms(config, {
							message: message,
							mobileNumber: result.recordsets[0][0]["MobileNumber"]
						}, function (err, resp) {

						})
					}

					if (result.recordsets[0][0]["Email"]) {
						config.sendEmail(config, {
							MessageBody: `Dear Customer, \nYour subscription ${result.recordsets[1][0]["ServiceName"]} is submitted successfully. You can modify\/pause service using CleanMyCar app.\nThanks, \nTeam CleanMyCar`,
							Email: result.recordsets[0][0]["Email"],
							MessageTitle: "CleanMyCar - Subscription activation",
						}, function (err, resp) {

						})
					}
				}

				if(result.recordsets[0][0].Email)
				config.sendEmail(config, {
                    MessageBody: `Sir, \nCustomer has requested new service, please find the details below\n                                  
                                  Name: ${result.recordsets[0][0]["UserFirstName"]} \n
								  Mobile: ${result.recordsets[0][0]["MobileNumber"]} \n
								  Service: ${result.recordsets[1][0]["ServiceName"]} \n
								  VehicleNumber: ${result.recordsets[1][0]["VehicleNumber"]} \n\n								  
                                  Please keep this reference number for future #${result.recordsets[0][0]["RequestId"]} 
                                  `,
                    Email: "contact@cleanmycar.in",
                    MessageTitle: "New Service Request",
                }, function (err, resp) {
                    
                })

			}

			return callback(null, result.recordsets[0][0]);
		});
	} catch (ex) {
		console.log(ex);
	}
};

let runDailySubscriptionService = function (config, params, result) {
	return new Promise((resolve, reject) => {
		const requestParams = config.dbwrapper.getNewRequest();
		requestParams.input("RequestId", mssql.Int, result.RequestId);
		requestParams.input("Frequency", mssql.Int, params.Frequency);
		requestParams.input("WeekDay", mssql.Int, params.WeeklyDay);
		requestParams.input("ServiceDate", mssql.Date, moment(params.ServiceDate).format("YYYY-MM-DD"));

		requestParams.execute("CreateDailySubscriptionItems", (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
		});
	});
};

