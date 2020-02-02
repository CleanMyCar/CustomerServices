
const mssql = require('mssql');
const moment = require("moment");

module.exports = (config, params, callback) => {
	const requestParams = config.dbwrapper.getNewRequest();

	requestParams.input('RequestId', mssql.Int, params.RequestId);
	requestParams.input("Frequency", mssql.NVarChar, params.Frequency);
	requestParams.input("TimeSlot", mssql.NVarChar, params.TimeSlot);
	requestParams.input("WeeklyDay", mssql.Int, params.WeeklyDay);
	requestParams.input('UserId', mssql.Int, params.systemParams.UserId);

	requestParams.execute('UpdateSubscription', (err, result) => {
		if (err) {
			console.log(err);
			callback(err);
			return
		}

		if (result.recordsets[0] && result.recordsets[0][0] && result.recordsets[0][0]["IsChanged"] == 1) {
			runDailySubscriptionService(config, params);
			if (params.StatusId && params.ServiceType == 1) {

				if (result.recordsets[0][0]["MobileNumber"]) {
					config.sendSms(config, {
						message: `Dear Customer, \nYour subscription ${result.recordsets[1][0]["ServiceName"]} is modified successfully. You can modify\/pause service using CleanMyCar app.\nThanks, \nTeam CleanMyCar`,
						mobileNumber: result.recordsets[0][0]["MobileNumber"]
					}, function (err, resp) {

					})
				}

				if (result.recordsets[0][0]["Email"]) {
					config.sendEmail(config, {
						MessageBody: `Dear Customer, \nYour subscription ${result.recordsets[1][0]["ServiceName"]} is modified successfully. You can modify\/pause service using CleanMyCar app.\nThanks, \nTeam CleanMyCar`,
						Email: result.recordsets[0][0]["Email"],
						MessageTitle: "CleanMyCar - Subscription Updated",
					}, function (err, resp) {

					})
				}
			}

		}
		return callback(null, result.recordsets[0]);
	})
}

let runDailySubscriptionService = function (config, params) {
	return new Promise((resolve, reject) => {
		const requestParams = config.dbwrapper.getNewRequest();
		requestParams.input("RequestId", mssql.Int, params.RequestId);
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