var md5 = require("md5");
const mssql = require("mssql");
const generateOtp = require("./generateOtp");
const sendSms = require("../common/sendSms");
const sendEmail = require("../common/sendEmail")

module.exports = async (config, params, callback) => {
	var userOtp = null;
	var sp_name = "SaveRegisterUserDetail";

	let saveuser = function (isMobileNumberVerified) {
		const requestParams = config.dbwrapper.getNewRequest();
		requestParams.input("UserId", mssql.Int, params.UserId);
		requestParams.input("UserLastName", mssql.NVarChar, params.lastName);
		requestParams.input("UserFirstName", mssql.NVarChar, params.firstName);
		requestParams.input("Email", mssql.NVarChar, params.email);
		requestParams.input("UserPassword", mssql.NVarChar, md5(params.password));
		requestParams.input("StatusId", mssql.Int, 1);
		requestParams.input("LoggedinUser", mssql.Int, 1);
		requestParams.input("ProfileImage", mssql.NVarChar, params.profileImage);
		requestParams.input("MobileNumber", mssql.NVarChar, params.mobileNumber);
		requestParams.input("ReferralCode", mssql.NVarChar, params.referralCode);
		requestParams.input("UserOtp", mssql.NVarChar, userOtp);
		requestParams.input(
			"UserRoleId",
			mssql.Int,
			params.userRoleId ? params.userRoleId : 2
		);
		requestParams.input("IsMobileNumberVerified", mssql.Int, isMobileNumberVerified);

		requestParams.execute(sp_name, (err, result) => {
			if (err) {
				console.log(err);
				callback(err);
			}
			callback(null, result.recordsets);

			//Send E-mail and SMS about registration
			if (isMobileNumberVerified) {
				let message = `Thank you for registering CleanMyCar service.`;
				if (result.recordsets[2] && result.recordsets[2][0] && result.recordsets[2][0].WalletAmount && result.recordsets[2][0].Validity) {
					message += `Rs.${result.recordsets[2][0].WalletAmount}/- FREE CASH added to your CelanMyCar wallet. Valid up to next  ${result.recordsets[2][0].Validity} days.`
				}
				message += ` We look forward to serve you with world class cleaning services for your vehicle. \nThanks, \nTeam CleanMyCar`
				sendSms(config, {
					message: message,
					mobileNumber: params.mobileNumber
				}, function (err, resp) {
					if (err) {
						console.log("New Registration - SMS sending failed", err)
					}
				})
				sendSms(config, {
					message: `Hi Team, \nNew customer ${params.firstName} registered just now with ${params.mobileNumber}`,
					mobileNumber: "7095889988,7095444498"
				}, function (err, resp) {
					if (err) {
						console.log("New Registration - SMS sending failed", err)
					}
				})
				sendEmail(config, {
					Email: "Contact@cleanmycar.in",
					MessageTitle: "Customer Registration",
					MessageBody: `Hi Team, \nNew customer ${params.firstName} registered just now with ${params.mobileNumber}`
				}, function (err, response) {
					if (err) {
						console.log("New Registration - email sending failed ", err)
					}
				});

			}
		});
	};

	let valdiateRegisteredUserOtp = function () {
		const requestParams = config.dbwrapper.getNewRequest();
		requestParams.input("MobileNumber", mssql.NVarChar, params.mobileNumber);
		requestParams.input("Otp", mssql.NVarChar, params.userOtp);
		requestParams.input("UserId", mssql.Int, params.userId);
		requestParams.execute("ValidateRegisterUserOtp", (err, result) => {
			if (err) {
				console.log(err);
				callback(err);
			}
			if (result.recordsets[0] && result.recordsets[0][0] && result.recordsets[0][0].UserId) {
				saveuser(1);
			}
			else {
				callback(null, [[{ ErrorMessage: "OTP entered is not valid" }]])
			}
		});

	}

	if (params.isVerify) {
		sp_name = "SaveUserDetail";
		valdiateRegisteredUserOtp();
	}
	else {
		userOtp = await generateOtp();
		saveuser();
		sendSms(config, {
			message: `Please use OTP ${userOtp} to complete your registration in CleanMyCar`,
			mobileNumber: params.mobileNumber
		}, function (err, resp) {

		})
	}
};
