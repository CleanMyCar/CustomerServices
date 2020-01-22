const express = require("express");
const httpModule = require("http");
const socketio = require("socket.io", { path: '/api/socket-io'});
let bodyParser = require("body-parser");
let request = require("request");
let moment = require("moment");
let promise = require("promise");
let app = express();
let http = httpModule.createServer(app);
let io = socketio({ path: '/api/socket.io' }).listen(http);
let log4js = require("log4js");
let logger = log4js.getLogger();
const fileUpload = require("express-fileupload");
const https = require("https")
let config = require("./code/core/core");

io.origins('*:*') 

config.socketIo = io;
config.logger = logger;

//config.moment = moment;
app.use(fileUpload());
app.use(bodyParser.json({ limit: 1024 * 1024 * 20, type: "application/json" }));
app.use(
	bodyParser.urlencoded(
		bodyParser.urlencoded({
			extended: true,
			limit: 1024 * 1024 * 20,
			type: "application/x-www-form-urlencoding"
		})
	)
);
// app.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
//modules
const modules = require("./code/modules/modules.js");
const awsImageService = require("./code/modules/imageUploadServices/awsStorageService.js");
const configParams = (() => {
	let p = {
		sql: {
			server: "14.192.1.221",
			user: "sa",
			password: "Apple#123",
			database: "master",
			port: 1433,
			pool: {
				max: 10,
				min: 0,
				idleTimeoutMillis: 30000
			},
			options: {
				encrypt: false,
				appName: "cloud-Rajendra"
			}
			// Bucket: {
			//     AccessKeyId: "AKIAJ27DJOG5BWHGUJWQ",
			//     SecretAccessKey: "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",
			//     BucketName: "app.roomtempo.com",
			//     Region: "us-east-1"
			// },
		},
		rentalUnitedApiUrl: "http://localhost:3000",
		sessionTimeOut: 30000 //minutes
	};

	//override from env variables
	if (
		process.env.sqlserver &&
		process.env.sqluser &&
		process.env.sqlpassword &&
		process.env.sqldatabase
	) {
		p.sql.server = process.env.sqlserver;
		p.sql.user = process.env.sqluser;
		p.sql.password = process.env.sqlpassword;
		p.sql.database = process.env.sqldatabase;
		if (process.env.sqlencrypt) {
			p.sql.options.encrypt = process.env.sqlencrypt;
		}
		//console.log(process.env.sqldatabase);
		console.log("p", p);
	}
	if (process.env.sqlPort) {
		p.sql.port = process.env.sqlPort;
	}
	if (process.env.rentalUnitedApiUrl) {
		p.rentalUnitedApiUrl = process.env.rentalUnitedApiUrl;
	}
	if (process.env.sessionTimeOut) {
		p.sessionTimeOut = process.env.sessionTimeOut;
	}

	// if (process.env.BucketAccessKeyId && process.env.BucketSecretAccessKey && process.env.BucketBucketName && process.env.BucketRegion) {
	//     p.sql.AccessKeyId = process.env.BucketAccessKeyId;
	//     p.sql.SecretAccessKey = process.env.BucketSecretAccessKey;
	//     p.sql.BucketName = process.env.BucketBucketName;
	//     p.sql.Region = process.env.BucketRegion;
	//     console.log(process.env.BucketAccessKeyId);
	//     console.log(process.env.BucketSecretAccessKey);
	//     console.log(process.env.BucketBucketName);
	//     console.log(process.env.BucketRegion);
	// }
	return p;
})();

require("./code/core/core")(configParams)
	.then(config => {
		io.sockets.on("connection", socket => {
			console.log("user connected");

			socket.on("disconnect", () => {
				console.log(config.userId + ": user disconnected on ");
			});

			modules.forEach(module => {
				socket.on(module.key, (params, responseCallback) => {
					let ContinueNextStep = function () {
						if (params.systemParams && params.systemParams.token) {
							config.utils.JwtToken.VerifyToken(
								config,
								{ token: params.systemParams.token },
								function (decodedObj) {
									if (
										decodedObj &&
										decodedObj.decoded.header &&
										decodedObj.decoded.header.UserId
									) {
										params.systemParams.UserId =
											decodedObj.decoded.header.UserId;
										params.systemParams.EmailId =
											decodedObj.decoded.header.EmailId;

										module.callback(config, params, (err, response) => {
											if (module.isLoggingEnabled === true) {
												let loggingParams = {
													vwUserIdText: "",
													moduleKey: module.key,
													stackTrace: "",
													calledFrom: "",
													requestParams: {},
													responseParams: {},
													logTypeId: -1,
													logMessage: ""
												};

												loggingParams.vwUserIdText = params.systemParams.userId;
												loggingParams.calledFrom = params.systemParams.Source;
												loggingParams.requestParams = JSON.stringify(params);
												loggingParams.responseParams = JSON.stringify(response);
												if (err) {
													loggingParams.logTypeId = 2;
													loggingParams.logMessage = JSON.stringify(err);
													if (err.stack) {
														loggingParams.stackTrace = JSON.stringify(
															err.stack
														);
													}
												} else {
													loggingParams.logTypeId = 1;
													loggingParams.logMessage = "Success";
												}

												let saveLoggingInformationCallback = function (
													error,
													response
												) {
													// console.log("Error => ", error);
													// console.log("Response => ", response);
												};

												//saveLoggingInformation(config, loggingParams, saveLoggingInformationCallback);
											}

											let headerObj = {
												UserId: params.systemParams.UserId,
												EmailId: params.systemParams.EmailId,
												PropertyId: params.systemParams.PropertyId,
												UserClientId: params.systemParams.UserClientId,
												SelectedClientId: params.systemParams.SelectedClientId,
												Source: params.systemParams.Source
											};

											config.utils.JwtToken.GetToken(
												config,
												{ header: headerObj },
												function (tokenObj) {
													if (tokenObj) {
														//responseObj.recordsets[0][0]["token"] = tokenObj.token;
														//res.end(JSON.stringify(responseObj.recordsets[0]));
														let responseObj = {
															token: tokenObj.token,
															response: response
														};

														if (err) {
															if (typeof responseCallback === "function")
																responseCallback(err, responseObj);
															return;
														}

														if (typeof responseCallback === "function")
															responseCallback(err, responseObj);
														else {
															return responseObj;
														}
													} else {
														let responseObj = {
															token: null,
															response: response
														};

														if (typeof responseCallback === "function")
															responseCallback(
																{
																	error: 1,
																	ErrorMessage: "Invalid Paremeters"
																},
																responseObj
															);
														else {
															return responseObj;
														}
													}
												}
											);
										});
									} else {
										let responseObj = {
											token: null,
											response: null,
											message: "Session Expired"
										};

										if (typeof responseCallback === "function")
											responseCallback(responseObj);
										else return responseObj;
										//socket.emit(module.key, { message: "Session Expired" });
									}
								}
							);
						} else {
							let responseObj = {
								token: null,
								response: null,
								message: "Session Expired"
							};

							if (typeof responseCallback === "function")
								responseCallback(responseObj);
							else return responseObj;
						}
					};

					if (params.updateToken) {
						if (params.systemParams.token) {
							config.utils.JwtToken.UpdateToken(
								config,
								{
									expiresIn: 60,
									token: params.systemParams.token,
									namespaceId: params.namespaceId
								},
								function (tokenObj) {
									if (tokenObj) {
										params.systemParams.token = tokenObj.token;
										responseCallback(undefined, params);
										//ContinueNextStep();
									} else {
										//config.removeUserFromUsersKeyStore(socket.id);
										if (typeof responseCallback === "function")
											responseCallback({ message: "Session Expired" });
										else return { message: "Session Expired" };
									}
								}
							);
						} else {
							//config.removeUserFromUsersKeyStore(socket.id);
							if (typeof responseCallback === "function")
								responseCallback({ message: "Session Expired" });
							else return { message: "Session Expired" };
						}
					} else {
						ContinueNextStep();
					}
				});
			});

			modules.forEach(module => {
				app.post("/beApi/" + module.key, function (req, res) {
					console.log(req.body);
					let params = req.body;

					config.utils.JwtToken.VerifyToken(
						config,
						{ token: params.systemParams.token },
						function (decodedObj) {
							if (
								decodedObj &&
								decodedObj.decoded.header &&
								decodedObj.decoded.header.ClientId
							) {
								params.systemParams.ClientId =
									decodedObj.decoded.header.ClientId;
								params.systemParams.ClientName =
									decodedObj.decoded.header.ClientName;
								params.systemParams.BE_Id = decodedObj.decoded.header.BE_Id;
								params.systemParams.BE_Name = decodedObj.decoded.header.BE_Name;
								params.systemParams.BE_Type = decodedObj.decoded.header.BE_Type;
								params.systemParams.SubDomainName =
									decodedObj.decoded.header.SubDomainName;
								params.systemParams.TLD_Name =
									decodedObj.decoded.header.TLD_Name;
								params.systemParams.socketId = socket.id.toString();

								module.callback(config, params, (err, response) => {
									if (err) {
										res.send(err);
										return;
									}
									res.send(response);
								});
							} else {
								res.send({ message: "Session Expired" });
							}
						}
					);
				});
			});
		});

		console.log("applicationPort: " + process.env.PORT);

		// ==================== Stripe response Uri =============================
		let rp = require("request-promise");
		app.get("/getConnectAccountId", function (req, res) {
			let statusValue = {
				code: null,
				rawdata: null,
				error: null
			};
			const sendResponse = () => {
				res.redirect(
					JSON.parse(req.query.state).url +
					"/#integrationPage?" +
					Object.keys(statusValue)
						.map(key => `${key}=${statusValue[key]}`)
						.join("&")
				);
			};

			if (req.query && req.query.error) {
				console.log("getConnectAccountId", req.query.error);
				statusValue.error = req.query.error;
				sendResponse();
			} else if (req.query && req.query.code) {
				console.log("getConnectAccountId", req.query.code);

				var options = {
					method: "POST",
					url: "https://connect.stripe.com/oauth/token",
					body: {
						client_secret: JSON.parse(req.query.state).SecretKey, //JSON.parse(req.query.state).SecretKey,
						code: req.query.code,
						grant_type: "authorization_code"
					},
					json: true // Automatically stringifies the body to JSON
				};

				rp(options)
					.then(function (parsedBody) {
						// POST succeeded...
						console.log("parsedBody.stripe_user_id", parsedBody.stripe_user_id);
						statusValue.code = parsedBody.stripe_user_id;
						sendResponse();
					})
					.catch(function (err) {
						console.log(err);
						statusValue.error = err.message;
						sendResponse();
					});
			}
			console.log("getConnectAccountId");
			// if(JSON.parse(req.query.state).paramName == "clientDetail"){
			// }
		});

		// ==================== files uploading =================================

		// const fileUpload = require('express-fileupload');

		// const fs = require('fs');
		// const Jimp = require("jimp");

		app.post("/upload", function (req, res) {
			console.log("Calling 3003");
			let multiResponse = [];
			if (req.files && Array.isArray(req.files.photos)) {
				// Multiple files upload
				for (let index = 0; index < req.files.photos.length; index++) {
					let imgRequest = Object.assign({}, req.body);
					imgRequest.imageGuid = "";
					imgRequest.image = req.files.photos[index].data;
					(imgRequest.method = 30031),
						(imgRequest.mimetype = req.files.photos[index].mimetype);
					awsImageService(config, imgRequest, function (err, response) {
						multiResponse.push(response);
						if (multiResponse.length == req.files.photos.length)
							res.send(multiResponse);
					});
				}
			} else {
				// Single file upload
				let imgData = "";
				let imageType = "";
				if (!req.files && req.body.Source === "Mobile") {
					imgData = new Buffer(req.body.image, "base64");
					imageType = null;
				} else {
					imgData = req.files.photos.data;
					imageType = req.files.photos.mimetype;
				}
				let imgRequest = Object.assign({}, req.body);

				if (req.body && req.body.dimensionId == 1) {
					// get image size
					imgRequest.width = 100;
					imgRequest.height = 100;
				} else if (req.body && req.body.dimensionId == 2) {
					imgRequest.width = 200;
					imgRequest.height = 200;
				} else {
					imgRequest.width = null;
					imgRequest.height = null;
				}
				imgRequest.imageGuid = req.body.imageGuid;
				imgRequest.image = imgData;
				imgRequest.method = 30031;
				imgRequest.mimetype = imageType;
				awsImageService(config, imgRequest, function (err, response) {
					res.send([response]);
				});
			}
		});
		app.get("/downloadImage/:imageGuid/:size", function (req, res) {
			res.set("Cache-Control", "public, max-age=31557600"); // one year
			// config.logger.info("received request in express /downloadImage", "Cookies: ", req.cookies, "body: ", req.body);
			//console.log("body: ", req.body)

			let imageFormat = "image/jpeg";
			// console.log("format" + imageFormat)
			let reqObj = {};
			let size = req.params.size;
			console.log("size====>", size);
			if (size != "null") {
				let imageSize = req.params.size.split("x");
				console.log("imageSize==>", imageSize);
				reqObj.width = Number(imageSize[0]);
				reqObj.height = Number(imageSize[1]);
			}
			reqObj.image = null;
			reqObj.imageGuid = req.params.imageGuid;
			reqObj.method = 30032;
			awsImageService(config, reqObj, function (err, response) {
				if (response) {
					let img = response;
					console.log(img);
					res.writeHead(200, { "Content-Type": imageFormat });
					res.end(img, "binary");
				} else {
					res.send(err);
				}
			});
		});
		// app.post('/downloadImage', function (req, res) {
		//     getInstanceImage(config, req.body, function (err, response) {
		//         res.send([response]);
		//     });
		// });

		app.post("/imageUpload", function (req, res) {
			console.log("image from mobile");
			//console.log(req);
			let imageObj = req.body.image;

			let response = {};

			response.type = "image/" + req.body.type;
			response.data = new Buffer(req.body.image, "base64");

			Jimp.read(response.data, function (err, image) {
				image
					.resize(200, 200) // resize
					.quality(80) // set JPEG quality
					.write("android-small-bw." + image.getExtension())
					.getBase64(image.getMIME(), function (img, base64Image, data) {
						res.send(base64Image);
					});
			});
		});

		// let embedVideo = require("embed-video");
		// let getVideoId = require('get-video-id');
		app.post("/getVimeoImage", function (req, res) {
			if (req.body && req.body.videoUrl && req.body.videoUrl !== "")
				embedVideo.image(
					"https://vimeo.com/" + getVideoId(req.body.videoUrl).id,
					{ image: "thumbnail_medium" },
					function (err, thumbnail) {
						if (err) throw err;
						//console.log(thumbnail.src);
						thumbnail.videoId = getVideoId(req.body.videoUrl).id;
						// http://i.vimeocdn.com/video/122513613_200x150.jpg
						res.send(thumbnail);
					}
				);
			else res.send({ requestInReturn: req.body });
		});

		const validateUser = require("./code/modules/user/validateUser.js");
		const updateUserPassword = require("./code/modules/user/updateUserPassword.js");
		const generateOtpForUser = require("./code/modules/user/generateOtpForUser.js");
		const verifyUserOtp = require("./code/modules/user/verifyUserOtp.js");
		const addAppIdToUser = require("./code/modules/user/addAppIdToUser.js");
		const registerNewUser = require("./code/modules/user/registerUser"),
			validateUserByEmailMobileNumber = require("./code/modules/user/validateUserByEmailMobileNumber"),
			sendSms = require("./code/modules/common/sendSms");

		app.post("/api", function (req, res) {
			//   console.log("loginconsoleapi",req);
			let apiRequestParams = req.body.requestParams;
			let apiSystemParams = req.body.systemParams;

			if (typeof req.body.requestParams == "string") {
				apiRequestParams = JSON.parse(req.body.requestParams);
			}
			if (typeof req.body.systemParams == "string") {
				apiSystemParams = JSON.parse(req.body.systemParams);
			}

			if (apiRequestParams.APIReg === "10000") {
				//Register new user
				registerNewUser(config, apiRequestParams, function (error, responseObj) {
					res.end(JSON.stringify(responseObj));
				});
			} else if (
				apiRequestParams.APIReg === "10001" ||
				apiRequestParams.APIReg === 10001
			) {
				// Validate User credentials - from Login Page

				validateUser(config, apiRequestParams, function (error, responseObj) {
					if (error) {
						res.end(JSON.stringify({ response: error, token: null }));
						return;
					}

					let headerObj = {};
					if (
						responseObj.recordsets.length === 0 ||
						(responseObj.recordsets.length > 0 &&
							responseObj.recordsets[0].length === 0)
					) {
						res.end(JSON.stringify({ response: responseObj, token: null }));
						return;
					}
					if (
						responseObj.recordsets.length > 0 &&
						responseObj.recordsets[0].length > 0
					) {
						console.log(
							"responseObj in validate user",
							responseObj.recordsets[0]
						);
						headerObj = {
							UserId: responseObj.recordsets[0][0]["UserId"],
							EmailId: responseObj.recordsets[0][0]["Email"]
						};

						config.utils.JwtToken.GetToken(
							config,
							{ header: headerObj },
							function (tokenObj) {
								if (tokenObj) {
									responseObj.recordsets[0][0]["token"] = tokenObj.token;
									res.end(
										JSON.stringify({
											response: responseObj.recordsets[0],
											token: tokenObj.token
										})
									);
								} else {
									res.end(
										JSON.stringify({
											response: {
												error: 1,
												ErrorMessage: "Invalid Parameters"
											},
											token: null
										})
									);
								}
							}
						);
					} else {
						console.log("Else condition");
						res.end(JSON.stringify({ response: responseObj, token: null }));
					}
				});
			} else if (
				apiRequestParams.APIReg === "10005" ||
				apiRequestParams.APIReg === 10005
			) {
				//Forgot password - send OTP to registerd mobile number based on provided User Name
				validateUserByEmailMobileNumber(config, apiRequestParams, function (
					error,
					responseObj
				) {
					if (error) {
						res.end(JSON.stringify(error));
						return;
					}
					if (
						(responseObj && responseObj.length === 0) ||
						(responseObj[0] && responseObj[0].ErrorMessage)
					) {
						apiRequestParams.ErrorMessage =
							"Please provide registered Email/Mobile Number";
						res.end(JSON.stringify(apiRequestParams));
					}

					if (responseObj && responseObj.length > 0) {
						generateOtpForUser(
							config,
							{ userId: responseObj[0]["UserId"] },
							function (err, userOtpObj) {
								if (err) {
									console.log("Error in Generate OTP");
									apiRequestParams.ErrorMessage =
										"Error in Generate OTP, please contact support team";
									res.end(JSON.stringify(apiRequestParams));
									return;
								}

								let clientResponseObj = {
									UserId: responseObj[0]["UserId"],
									ErrorMessage: "",
									SuccessMessage: "OTP sent to registered mobile number"
								};

								res.end(JSON.stringify(clientResponseObj));

								// sendSms(config,
								//     {
								//         MobileNumber: userOtpObj[0]["MobileNumber"],
								//         Message: "Please use this OTP " + userOtpObj[0]["UserOtp"] + " to change password"
								//     },
								//     function (err, response) {
								//         let clientResponseObj = {
								//             UserId: responseObj[0]["UserId"],
								//             ErrorMessage: response.type === "success" ? "" : "OTP not sent",
								//             SuccessMessage: response.type === "success" ? "OTP sent to registered mobile number" : ""
								//         };

								//         res.end(JSON.stringify(clientResponseObj));
								//     });
							}
						);
					} else {
						apiRequestParams.ErrorMessage =
							"Please provide valid Email/Mobile Number";
						res.end(JSON.stringify(apiRequestParams));
					}
				});
			} else if (
				apiRequestParams.APIReg === "10006" ||
				apiRequestParams.APIReg === 10006
			) {
				//Validate OTP which is entered by user

				verifyUserOtp(config, apiRequestParams, function (error, response) {
					if (response.length > 0 && response[0].UserId) {
						apiRequestParams.successMessage =
							"OTP verified successfully, please change password";
						apiRequestParams.ErrorMessage = "";
					} else {
						apiRequestParams.successMessage = "";
						apiRequestParams.ErrorMessage = "Invalid OTP, please try again";
					}
					res.end(JSON.stringify(apiRequestParams));
				});
			} else if (
				apiRequestParams.APIReg === "10007" ||
				apiRequestParams.APIReg === 10007
			) {
				// Change user password
				updateUserPassword(config, apiRequestParams, function (
					error,
					responseObj
				) {
					if (error) {
						apiRequestParams.ErrorMessage =
							"There is an error while updating password";
						return res.end(JSON.stringify(apiRequestParams));
					}
					apiRequestParams.successMessage = "Password changed successfully";
					apiRequestParams.ErrorMessage = "";
					res.end(JSON.stringify(apiRequestParams));
				});
			} else {
				res.end("Request received");
			}
		});

		let saveTransactionDetails = require("./code/modules/wallet/rechargeWallet");
		const checksum_lib = require("./code/modules/wallet/checksum");

		app.get("/api/rechargeWallet", function (req, res) {
			let apiRequestParams = req.query;

			if (typeof req.query == "string") {
				apiRequestParams = JSON.parse(req.body);
			}

			config.utils.JwtToken.VerifyToken(
				config, { token: apiRequestParams.token }, function (decodedObj) {
					if (decodedObj && decodedObj.decoded.header && decodedObj.decoded.header.UserId) {
						apiRequestParams.systemParams = {};
						apiRequestParams.systemParams.UserId = decodedObj.decoded.header.UserId;
						apiRequestParams.systemParams.EmailId = decodedObj.decoded.header.EmailId;
						apiRequestParams.IsCredited = 1;

						saveTransactionDetails(config, apiRequestParams, function (err, response) {
							if (err || !response || !(response && response.walletDetails && response.walletDetails.WalletTransactionId)
								|| !(response && response.paytmConfig && response.paytmConfig.MID)) {
								console.log("Error while saving recharge details");
								return res.send(err);
							}
							config.paytmConfig = response.paytmConfig;
							var paytmParams = {
								/* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
								MID: response.paytmConfig.MID,
								/* Find your WEBSITE in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
								WEBSITE: response.paytmConfig.WEBSITE,
								/* Find your INDUSTRY_TYPE_ID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
								INDUSTRY_TYPE_ID: response.paytmConfig.INDUSTRY_TYPE_ID,
								/* WEB for website and WAP for Mobile-websites or App */
								CHANNEL_ID: response.paytmConfig.CHANNEL_ID,
								/* Enter your unique order id */
								ORDER_ID: response.walletDetails.WalletTransactionId.toString(),
								/* unique id that belongs to your customer */
								CUST_ID: response.userDetails.UserId.toString(),
								/* customer's mobile number */
								MOBILE_NO: response.userDetails.MobileNumber,
								/* customer's email */
								EMAIL: response.userDetails.Email,
								/**
								 * Amount in INR that is payble by customer
								 * this should be numeric with optionally having two decimal points
								 */
								TXN_AMOUNT: response.walletDetails.Amount.toString(),

								/* on completion of transaction, we will send you the response on this URL */
								CALLBACK_URL: response.paytmConfig.CALLBACK_URL
							};

							/**
							 * Generate checksum for parameters we have
							 * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
							 */
							checksum_lib.genchecksum(paytmParams, response.paytmConfig.MERCHANTKEY, function (
								err,
								checksum
							) {
								/* for Staging */
								var url = response.paytmConfig.PaytmUrl;

								/* for Production */
								// var url = "https://securegw.paytm.in/order/process";

								/* Prepare HTML Form and Submit to Paytm */
								res.writeHead(200, { "Content-Type": "text/html" });
								res.write("<html>");
								res.write("<head>");
								res.write("<title>Merchant Checkout Page</title>");
								res.write("</head>");
								res.write("<body>");
								res.write("<center><h1>Please do not refresh this page...</h1></center>");
								res.write('<form method="post" action="' + url + '" name="paytm_form">');
								for (var x in paytmParams) {
									res.write(
										'<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">'
									);
								}
								res.write(
									'<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">'
								);
								res.write("</form>");
								res.write('<script type="text/javascript">');
								res.write("document.paytm_form.submit();");
								res.write("</script>");
								res.write("</body>");
								res.write("</html>");
								res.end();
							});
						})
					}
					else {
						res.send({ error: true, message: "Session expired" })
					}
				}
			);
		})

		app.post("/api/paytmCallback", function (req, res) {
			// console.log(req);

			// let body = "";
			// req.on("data", function (data) {
			// 	body += data;
			// 	console.log(data);
			// });

			// req.on("end", function () {
			var html = "";
			var response_data = req.body;
			var post_data = req.body;

			// received params in callback
			console.log("Callback Response: ", post_data, "\n");
			html += "<b>Callback Response</b><br>";
			for (var x in post_data) {
				html += x + " => " + post_data[x] + "<br/>";
			}
			html += "<br/><br/>";

			// verify the checksum
			var checksumhash = post_data.CHECKSUMHASH;
			// delete post_data.CHECKSUMHASH;
			var result = checksum_lib.verifychecksum(
				post_data,
				config.paytmConfig.MERCHANTKEY,
				checksumhash
			);
			console.log("Checksum Result => ", result, "\n");
			html += "<b>Checksum Result</b> => " + (result ? "True" : "False");
			html += "<br/><br/>";

			// Send Server-to-Server request to verify Order Status
			var params = {
				MID: config.paytmConfig.MID,
				ORDERID: post_data.ORDERID
			};

			checksum_lib.genchecksum(params, config.paytmConfig.MERCHANTKEY, function (
				err,
				checksum
			) {
				params.CHECKSUMHASH = checksum;
				post_data = "JsonData=" + JSON.stringify(params);

				var options = {
					hostname: config.paytmConfig.VerificationUrl, // for staging
					// hostname: 'securegw.paytm.in', // for production
					port: 443,
					path: "/merchant-status/getTxnStatus",
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Content-Length": post_data.length
					}
				};

				// Set up the request
				var response = "";
				var post_req = https.request(options, function (post_res) {
					post_res.on("data", function (chunk) {
						response += chunk;
					});

					post_res.on("end", function () {
						console.log("S2S Response: ", response, "\n");

						var _result = JSON.parse(response);
						html += "<b>Status Check Response</b><br>";
						for (var x in _result) {
							html += x + " => " + _result[x] + "<br/>";
						}						
					});
				});

				// post the data
				// post_req.write(post_data);

				post_req.end();
				saveTransactionDetails(config, {
					WalletTransactionId: response_data.ORDERID,
					PaymentTransactionId: response_data.TXNID,
					PaymentMode: response_data.PAYMENTMODE,
					PaymentCurrency: response_data.CURRENCY,
					PaymentTransactionDate: response_data.TXNDATE.toString(),
					TransactionStatus: response_data.STATUS,
					TransactionRespCode: response_data.RESPCODE,
					TransactionRespMessage: response_data.RESPMSG,
					PaymentGatewayName: response_data.GATEWAYNAME,
					BankTransactionId: response_data.BANKTXNID,
					BankName: response_data.BANKNAME,
					RefundAmount: response_data.REFUNDAMT,
					PaymentTransactionType: response_data.TXNTYPE,
					systemParams: {
						UserId: null
					}

				}, function (err, resp) {
					if (err) {
						console.log("Payment details saving failed", err);
						return res.send({ error: err });
					}
					// res.writeHead(200, { "Content-Type": "text/html" });
					// res.write(html);
					// res.end();
					res.redirect("/index.html#/recharge/" + response_data.TXNID)
				})
				
				// res.writeHead(200, { "Content-Type": "text/html" });
				// res.write("<html>");
				// res.write("<head>");
				// res.write("<title>Merchant Checkout Page</title>");
				// res.write("</head>");
				// res.write("<body>");				
				// res.write('<script type="text/javascript">');
				// // res.write("window.opener && window.opener.postMessage({ transactionId: '" + response_data.TXNID + "', from: 'paytmsuccess' }, window.location.origin);window.close();");
				// res.write("</script>");
				// res.write("</body>");
				// res.write("</html>");
				// res.end();
				// res.redirect("http://localhost/index.html#/recharge/" + response_data.TXNID)
				
				// res.writeHead(200, { "Content-Type": "text/html" });
				// res.write("<html>");
				// res.write("<head>");
				// res.write("<title>Merchant Checkout Page</title>");
				// res.write("</head>");
				// res.write("<body>");				
				// res.write('<script type="text/javascript">');
				// res.write("window.location.href='http://localhost:8080/index.html#/recharge/" + response_data.TXNID + "'");
				// res.write("</script>");
				// res.write("</body>");
				// res.write("</html>");
				// return res.end();
				// return res.location("http://localhost:8080/index.html#/recharge/" + response_data.TXNID)

				// });
			});

			console.log(post_data);
			// res.send(body);
		});

		/* Route for writing data to an excel and downloading it */

		app.post("/getExcelData", function (req, res) {
			// data which needs to be sent in the response.
			let params = req.body;
			params.systemParams = {
				token: req.body.token,
				Source: req.body.Source,
				SourceId: req.body.SourceId
			};
			//   console.log("req in /getExcelData", systemParams);
			console.log("params in /getExcelData", params);
			//   let getExcelData = function(){};
			if (params.systemParams && params.systemParams.token) {
				config.utils.JwtToken.VerifyToken(
					config,
					{ token: params.systemParams.token },
					function (decodedObj) {
						if (
							decodedObj &&
							decodedObj.decoded.header &&
							decodedObj.decoded.header.UserId
						) {
							params.systemParams.UserId = decodedObj.decoded.header.UserId;
							params.systemParams.EmailId = decodedObj.decoded.header.EmailId;
							// params.systemParams.ClientId = decodedObj.decoded.header.ClientId;
							params.systemParams.UserClientId =
								decodedObj.decoded.header.UserClientId;
							params.systemParams.SelectedClientId =
								decodedObj.decoded.header.SelectedClientId;
							params.systemParams.PropertyId =
								decodedObj.decoded.header.PropertyId;

							console.log("UserInstanceId: " + params.systemParams.UserId);
							// console.log("ClientId: " + params.systemParams.ClientId);
							console.log(
								"userClientId: " + params.systemParams.SelectedClientId
							);
						}
					}
				);
			}
		});
		/* Route for writing data to an excel and downloading it */

		// ==================== files uploading =================================

		http.listen(process.env.PORT || 1339);
	})

	.catch(reason => {
		console.log(reason);
	});

process.on("uncaughtException", err => {
	console.log("uncaughtException", err);
	logger.fatal(
		new Date().toUTCString() + " uncaughtException:",
		err.message,
		err.stack
	);
	process.exit(1);
});
