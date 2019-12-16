﻿const express = require('express');
const httpModule = require('http');
const socketio = require('socket.io');
let bodyParser = require('body-parser');
let request = require('request');
let moment = require('moment');
let promise = require('promise');
let app = express();
let http = httpModule.createServer(app);
let io = socketio(http);
let log4js = require("log4js");
let logger = log4js.getLogger();
const fileUpload = require('express-fileupload');

let config = require('./code/core/core');

config.socketIo = io;
config.logger = logger;

//config.moment = moment;
app.use(fileUpload());
app.use(bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' }));
app.use(bodyParser.urlencoded(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' })));
// app.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//modules
const modules = require('./code/modules/modules.js');
const awsImageService = require('./code/modules/imageUploadServices/awsStorageService.js')
const configParams = (() => {
    let p = {
        sql: {
            server: 'localhost',
            user: 'sa',
            password: 'Apple#123',
            database: 'RoomTempo_Dev_ISS',
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
        rentalUnitedApiUrl: 'http://localhost:3000',
        sessionTimeOut: 30000, //minutes        
    };

    //override from env variables    
    if (process.env.sqlserver && process.env.sqluser && process.env.sqlpassword && process.env.sqldatabase) {
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
    if (process.env.port) {
        p.sql.port = process.env.port;
    }
    if (process.env.rentalUnitedApiUrl) {
        p.rentalUnitedApiUrl = process.env.rentalUnitedApiUrl;
    }
    if (process.env.sessionTimeOut) {
        p.sessionTimeOut = process.env.sessionTimeOut
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
    return p
})();


require('./code/core/core')(configParams)
    .then(config => {
        io.sockets.on('connection', (socket) => {
            console.log('user connected');

            socket.on('disconnect', () => {
                console.log(config.userId + ': user disconnected on ');
            });

            modules.forEach((module) => {
                socket.on(module.key, (params, responseCallback) => {

                    let ContinueNextStep = function () {
                        if (params.systemParams && params.systemParams.token) {
                            config.utils.JwtToken.VerifyToken(config, { "token": params.systemParams.token }, function (decodedObj) {
                                if (decodedObj && decodedObj.decoded.header && decodedObj.decoded.header.UserId) {

                                    params.systemParams.UserId = decodedObj.decoded.header.UserId;
                                    params.systemParams.EmailId = decodedObj.decoded.header.EmailId;

                                    module.callback(config, params, (err, response) => {

                                        if (module.isLoggingEnabled === true) {

                                            let loggingParams = {
                                                vwUserIdText: '',
                                                moduleKey: module.key,
                                                stackTrace: '',
                                                calledFrom: '',
                                                requestParams: {},
                                                responseParams: {},
                                                logTypeId: -1,
                                                logMessage: ''
                                            };

                                            loggingParams.vwUserIdText = params.systemParams.userId;
                                            loggingParams.calledFrom = params.systemParams.Source;
                                            loggingParams.requestParams = JSON.stringify(params);
                                            loggingParams.responseParams = JSON.stringify(response);
                                            if (err) {
                                                loggingParams.logTypeId = 2;
                                                loggingParams.logMessage = JSON.stringify(err);
                                                if (err.stack) {
                                                    loggingParams.stackTrace = JSON.stringify(err.stack);
                                                }
                                            } else {
                                                loggingParams.logTypeId = 1;
                                                loggingParams.logMessage = "Success";
                                            }

                                            let saveLoggingInformationCallback = function (error, response) {
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

                                        config.utils.JwtToken.GetToken(config, { "header": headerObj }, function (tokenObj) {
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
                                                    responseCallback({ "error": 1, "ErrorMessage": "Invalid Paremeters" }, responseObj);
                                                else {
                                                    return responseObj;
                                                }
                                            }

                                        });


                                    });

                                } else {

                                    let responseObj = {
                                        token: null,
                                        response: null,
                                        message: "Session Expired"
                                    };

                                    if (typeof responseCallback === "function")
                                        responseCallback(responseObj);
                                    else
                                        return responseObj;
                                    //socket.emit(module.key, { message: "Session Expired" });
                                }
                            });
                        } else {
                            let responseObj = {
                                token: null,
                                response: null,
                                message: "Session Expired"
                            };

                            if (typeof responseCallback === "function")
                                responseCallback(responseObj);
                            else
                                return responseObj;
                        }
                    };

                    if (params.updateToken) {

                        if (params.systemParams.token) {
                            config.utils.JwtToken.UpdateToken(config, {
                                "expiresIn": 60,
                                token: params.systemParams.token,
                                namespaceId: params.namespaceId
                            }, function (tokenObj) {
                                if (tokenObj) {
                                    params.systemParams.token = tokenObj.token;
                                    responseCallback(undefined, params);
                                    //ContinueNextStep();
                                } else {
                                    //config.removeUserFromUsersKeyStore(socket.id);
                                    if (typeof responseCallback === "function")
                                        responseCallback({ message: "Session Expired" });
                                    else
                                        return { message: "Session Expired" };
                                }
                            });
                        } else {
                            //config.removeUserFromUsersKeyStore(socket.id);
                            if (typeof responseCallback === "function")
                                responseCallback({ message: "Session Expired" });
                            else
                                return { message: "Session Expired" };
                        }
                    } else {
                        ContinueNextStep();
                    }

                });
            });

            modules.forEach((module) => {
                app.post("/beApi/" + module.key, function (req, res) {
                    console.log(req.body);
                    let params = req.body;

                    config.utils.JwtToken.VerifyToken(config, { "token": params.systemParams.token }, function (decodedObj) {
                        if (decodedObj && decodedObj.decoded.header && decodedObj.decoded.header.ClientId) {

                            params.systemParams.ClientId = decodedObj.decoded.header.ClientId;
                            params.systemParams.ClientName = decodedObj.decoded.header.ClientName;
                            params.systemParams.BE_Id = decodedObj.decoded.header.BE_Id;
                            params.systemParams.BE_Name = decodedObj.decoded.header.BE_Name;
                            params.systemParams.BE_Type = decodedObj.decoded.header.BE_Type;
                            params.systemParams.SubDomainName = decodedObj.decoded.header.SubDomainName;
                            params.systemParams.TLD_Name = decodedObj.decoded.header.TLD_Name;
                            params.systemParams.socketId = socket.id.toString()

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
                    });
                });
            })

        });


        console.log("port: " + process.env.PORT);



        // ==================== Stripe response Uri =============================
        let rp = require("request-promise")
        app.get('/getConnectAccountId', function (req, res) {
            let statusValue = {
                code: null,
                rawdata: null,
                error: null
            }
            const sendResponse = () => {
                res.redirect(JSON.parse(req.query.state).url + "/#integrationPage?" + Object.keys(statusValue).map(key => `${key}=${statusValue[key]}`).join("&"));
            }

            if (req.query && req.query.error) {
                console.log("getConnectAccountId", req.query.error)
                statusValue.error = req.query.error
                sendResponse()
            } else if (req.query && req.query.code) {
                console.log("getConnectAccountId", req.query.code)

                var options = {
                    method: 'POST',
                    url: 'https://connect.stripe.com/oauth/token',
                    body: {
                        client_secret: JSON.parse(req.query.state).SecretKey, //JSON.parse(req.query.state).SecretKey,
                        code: req.query.code,
                        grant_type: "authorization_code",
                    },
                    json: true // Automatically stringifies the body to JSON
                };

                rp(options)
                    .then(function (parsedBody) {
                        // POST succeeded...
                        console.log("parsedBody.stripe_user_id", parsedBody.stripe_user_id);
                        statusValue.code = parsedBody.stripe_user_id
                        sendResponse();
                    })
                    .catch(function (err) {
                        console.log(err)
                        statusValue.error = err.message;
                        sendResponse();
                    });


            }
            console.log("getConnectAccountId")
            // if(JSON.parse(req.query.state).paramName == "clientDetail"){
            // }

        })



        // ==================== files uploading =================================

        // const fileUpload = require('express-fileupload');


        // const fs = require('fs');
        // const Jimp = require("jimp");


        app.post('/upload', function (req, res) {
            console.log("Calling 3003")
            let multiResponse = [];
            if (req.files && Array.isArray(req.files.photos)) { // Multiple files upload
                for (let index = 0; index < req.files.photos.length; index++) {
                    let imgRequest = Object.assign({}, req.body);
                    imgRequest.imageGuid = "";
                    imgRequest.image = req.files.photos[index].data;
                    imgRequest.method = 30031,
                        imgRequest.mimetype = req.files.photos[index].mimetype
                    awsImageService(config, imgRequest, function (err, response) {
                        multiResponse.push(response);
                        if (multiResponse.length == req.files.photos.length)
                            res.send(multiResponse);
                    });
                }
            } else { // Single file upload
                let imgData = "";
                let imageType = "";
                if (!req.files && req.body.Source === "Mobile") {
                    imgData = new Buffer(req.body.image, 'base64');
                    imageType = null;
                } else {
                    imgData = req.files.photos.data;
                    imageType = req.files.photos.mimetype;
                }
                let imgRequest = Object.assign({}, req.body);

                if (req.body && req.body.dimensionId == 1) { // get image size
                    imgRequest.width = 100
                    imgRequest.height = 100
                } else if (req.body && req.body.dimensionId == 2) {
                    imgRequest.width = 200
                    imgRequest.height = 200
                } else {
                    imgRequest.width = null
                    imgRequest.height = null
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
        app.get('/downloadImage/:imageGuid/:size', function (req, res) {
            res.set('Cache-Control', 'public, max-age=31557600'); // one year
            // config.logger.info("received request in express /downloadImage", "Cookies: ", req.cookies, "body: ", req.body);
            //console.log("body: ", req.body)

            let imageFormat = "image/jpeg"
            // console.log("format" + imageFormat)
            let reqObj = {}
            let size = req.params.size
            console.log("size====>", size);
            if (size != 'null') {
                let imageSize = req.params.size.split('x')
                console.log("imageSize==>", imageSize);
                reqObj.width = Number(imageSize[0])
                reqObj.height = Number(imageSize[1])
            }
            reqObj.image = null
            reqObj.imageGuid = req.params.imageGuid
            reqObj.method = 30032
            awsImageService(config, reqObj, function (err, response) {
                if (response) {
                    let img = response
                    console.log(img)
                    res.writeHead(200, { 'Content-Type': imageFormat });
                    res.end(img, 'binary');
                } else {
                    res.send(err)
                }
            });

        });
        // app.post('/downloadImage', function (req, res) {
        //     getInstanceImage(config, req.body, function (err, response) {
        //         res.send([response]);
        //     });
        // });


        app.post('/imageUpload', function (req, res) {
            console.log("image from mobile");
            //console.log(req);
            let imageObj = req.body.image;

            let response = {};

            response.type = "image/" + req.body.type;
            response.data = new Buffer(req.body.image, 'base64');


            Jimp.read(response.data, function (err, image) {
                image.resize(200, 200) // resize 
                    .quality(80) // set JPEG quality                                 
                    .write("android-small-bw." + image.getExtension())
                    .getBase64(image.getMIME(), function (img, base64Image, data) {
                        res.send(base64Image);
                    });
            });

        });

        let embedVideo = require("embed-video");
        let getVideoId = require('get-video-id');
        app.post('/getVimeoImage', function (req, res) {
            if (req.body && req.body.videoUrl && req.body.videoUrl !== "")
                embedVideo.image('https://vimeo.com/' + getVideoId(req.body.videoUrl).id, { image: 'thumbnail_medium' }, function (err, thumbnail) {
                    if (err) throw err;
                    //console.log(thumbnail.src);
                    thumbnail.videoId = getVideoId(req.body.videoUrl).id;
                    // http://i.vimeocdn.com/video/122513613_200x150.jpg
                    res.send(thumbnail);
                });
            else
                res.send({ "requestInReturn": req.body });
        });


        const validateUser = require('./code/modules/user/validateUser.js');
        const updateUserPassword = require('./code/modules/user/updateUserPassword.js');
        const generateOtpForUser = require('./code/modules/user/generateOtpForUser.js');
        const verifyUserOtp = require('./code/modules/user/verifyUserOtp.js');
        const addAppIdToUser = require('./code/modules/user/addAppIdToUser.js');
        const registerNewUser = require('./code/modules/user/registerUser');



        app.post("/api", function (req, res) {
            //   console.log("loginconsoleapi",req);
            let apiRequestParams = req.body.requestParams;
            let apiSystemParams = req.body.systemParams;

            if (typeof req.body.requestParams == 'string') {
                apiRequestParams = JSON.parse(req.body.requestParams);
            }
            if (typeof req.body.systemParams == 'string') {
                apiSystemParams = JSON.parse(req.body.systemParams);
            }

            if (apiRequestParams.APIReg === "10000") { //Register new user                
                registerNewUser(config, apiRequestParams, function (error, responseObj) {
                    res.end(JSON.stringify(responseObj));
                });
            }
            else if (apiRequestParams.APIReg === "10001" || apiRequestParams.APIReg === 10001) { // Validate User credentials - from Login Page

                validateUser(config, apiRequestParams, function (error, responseObj) {

                    if (error) {
                        res.end(JSON.stringify({ response: error, token: null }));
                        return;
                    }

                    let headerObj = {};
                    if (responseObj.recordsets.length === 0 || (responseObj.recordsets.length > 0 && responseObj.recordsets[0].length === 0)) {
                        res.end(JSON.stringify({ response: responseObj, token: null }));
                        return;
                    }
                    if (responseObj.recordsets.length > 0 && responseObj.recordsets[0].length > 0) {
                        console.log("responseObj in validate user", responseObj.recordsets[0]);
                        headerObj = {
                            UserId: responseObj.recordsets[0][0]["UserId"],
                            EmailId: responseObj.recordsets[0][0]["Email"]
                        };

                        config.utils.JwtToken.GetToken(config, { "header": headerObj }, function (tokenObj) {
                            if (tokenObj) {
                                responseObj.recordsets[0][0]["token"] = tokenObj.token;
                                res.end(JSON.stringify({ response: responseObj.recordsets[0], token: tokenObj.token }));
                            } else {
                                res.end(JSON.stringify({ response: { "error": 1, "ErrorMessage": "Invalid Parameters" }, token: null }));
                            }
                        });
                    } else {
                        console.log("Else condition");
                        res.end(JSON.stringify({ response: responseObj, token: null }));
                    }
                });
            } else if (apiRequestParams.APIReg === "10005" || apiRequestParams.APIReg === 10005) { //Forgot password - send OTP to registerd mobile number based on provided User Name
                validateUser(config, apiRequestParams, function (error, responseObj) {

                    if (error) {
                        res.end(JSON.stringify(error));
                        return;
                    }

                    if (responseObj && responseObj.length === 0) {
                        apiRequestParams.ErrorMessage = "Please provide valid user name";
                        res.end(JSON.stringify(apiRequestParams));
                    }

                    if (responseObj && responseObj.length > 0) {

                        generateOtpForUser(config, { vwUserIdText: responseObj[0]["vwUserIdText"] }, function (err, userOtpObj) {
                            if (config.utils.sendOtp) {
                                sendOtp.send(userOtpObj[0][0]["MobileNumber"], "OTPSMS", userOtpObj[0][0]["Otp"], function (err, response) {
                                    console.log(err, response);
                                    let clientResponseObj = {
                                        userId: responseObj[0]["vwUserIdText"],
                                        ErrorMessage: response.type === "success" ? "" : "OTP not sent",
                                        successMessage: response.type === "success" ? "OTP sent to registered mobile number" : ""
                                    };

                                    res.end(JSON.stringify(clientResponseObj));
                                });
                            } else {

                                let clientResponseObj = {
                                    userId: responseObj[0]["vwUserIdText"],
                                    mobileNumber: responseObj[0]["MobileNumber"],
                                    ErrorMessage: "",
                                    successMessage: "OTP sent to registered mobile number"
                                };

                                res.end(JSON.stringify(clientResponseObj));
                            }
                        });

                    } else {
                        apiRequestParams.ErrorMessage = "Please provide valid user name";
                        res.end(JSON.stringify(apiRequestParams));
                    }
                });


            } else if (apiRequestParams.APIReg === "10006" || apiRequestParams.APIReg === 10006) { //Validate OTP which is entered by user        

                verifyUserOtp(config, apiRequestParams, function (error, response) {
                    if (response.length > 0) {
                        apiRequestParams.successMessage = "OTP verified successfully, please change password";
                        apiRequestParams.ErrorMessage = "";
                    } else {
                        apiRequestParams.successMessage = "";
                        apiRequestParams.ErrorMessage = "Invalid OTP, please try again";
                    }
                    res.end(JSON.stringify(apiRequestParams));
                });


            } else if (apiRequestParams.APIReg === "10007" || apiRequestParams.APIReg === 10007) { // Change user password
                updateUserPassword(config, apiRequestParams, function (error, responseObj) {

                    apiRequestParams.successMessage = "Password changed successfully";
                    apiRequestParams.ErrorMessage = "";
                    res.end(JSON.stringify(apiRequestParams));
                });
            } else if (apiRequestParams.APIReg === "10008" || apiRequestParams.APIReg === 10008) {
                apiRequestParams.IsFromRentalsUnited = 1;
                saveReservationGuestInfo(config, apiRequestParams, function (error, responseObj) {
                    if (error) {
                        console.log("Error in save guest info: ", error);
                        res.end(JSON.stringify({
                            customMessage: 'SaveReservation_GuestInfo Failed',
                            errorMessage: error
                        }))
                    }
                    // apiRequestParams.successMessage = "successfully";
                    // apiRequestParams.ErrorMessage = "";
                    // console.log("responseObj of saveReservationGuestInfo" + responseObj[0][0].ErrorMessage)
                    if (responseObj) {
                        if (responseObj[0] && responseObj[0][0] && (responseObj[0][0].ErrorMessage === "" || responseObj[0][0].ErrorMessage === null)) {
                            console.log("responseObj[0][1]" + JSON.stringify(responseObj[1]))
                            if (responseObj[1] && responseObj[1][0] && responseObj[1][0] && responseObj[1][0].ReservationId) {
                                let assignRoomParams = apiRequestParams
                                assignRoomParams.ReservationId = responseObj[1][0].ReservationId
                                assignRoomParams.IsFromRentalsUnited = 1;

                                SaveReservationAssignRooms(config, assignRoomParams, function (err, responseObj) {
                                    if (err) {
                                        console.log("Error in assign rooms: ", err);
                                    }
                                    // apiRequestParams.successMessage = "successfully";
                                    // apiRequestParams.ErrorMessage = "";
                                    // console.log("responseObj[0][0].ErrorMessage", responseObj[8]);
                                    if (responseObj && responseObj[0] && responseObj[0].length > 0 && responseObj[0][0].ErrorMessage != " ") {
                                        res.end(JSON.stringify({
                                            customMessage: 'SaveReservation_AssignRooms Failed',
                                            errorMessage: responseObj[0][0].ErrorMessage
                                        }));
                                    } else if (responseObj && responseObj.length > 1) {
                                        if (responseObj && responseObj[6] && responseObj[6].length > 0 && responseObj[6][0].reservationID) {
                                            res.end(JSON.stringify({
                                                customMessage: 'assign rooms save sucess ',
                                                errorMessage: responseObj[0][0].ErrorMessage
                                            }));
                                            let saveNotesObj = {
                                                NoteTypeId: 2,
                                                NoteSubject: "Turnover cleaning",
                                                IsActionReqd: 1,
                                                noteStatusId: 0,
                                                taskTypeId: 1,
                                                isAutoGenerated: 1,
                                                DateOrTimeDue: moment(assignRoomParams.EndDate).format("YYYY-MM-DD"),
                                                ReservationId: responseObj[6][0].reservationID,
                                                NoteId: null,
                                                NoteDetails: "Ru Reservation Turnover cleaning",
                                                systemParams: { UserId: 17 }
                                            }
                                            // SaveNotesDetails(config, saveNotesObj, function (err, responseObj) {
                                            //     if (err) {
                                            //         console.log("Error in assign rooms: ", err);
                                            //     }
                                            // })
                                        } else {
                                            res.end(JSON.stringify({
                                                customMessage: 'assign rooms save failed ',
                                                errorMessage: "no reservationId"
                                            }));
                                        }
                                    } else {
                                        res.end(JSON.stringify({
                                            customMessage: 'assign rooms save sucess ',
                                            Message: "multiple call no change in data"
                                        }));
                                    }
                                });
                            } else {
                                console.log("No reservation id returned from SP");
                                res.end(JSON.stringify({
                                    customMessage: 'No reservation id returned from SP and assign rooms save Failed',
                                    errorMessage: responseObj[0][0].ErrorMessage
                                }))
                            }
                        } else {
                            res.end(JSON.stringify({
                                customMessage: 'SaveReservation_GuestInfo Failed',
                                errorMessage: responseObj[0][0].ErrorMessage
                            }))
                        }
                    }
                });

            } else if (apiRequestParams.APIReg === "10009" || apiRequestParams.APIReg === 10009) {
                console.log("request for the updated reservations in apigateway.js file")
                updateResevationStatus(config, apiRequestParams, function (error, responseObj) {
                    if (error) {
                        console.log("Error in updateResevationStatus: ", error);
                    }
                    res.end('updateResevationStatus sucess')
                })
            } else if (apiRequestParams.APIReg === "10010" || apiRequestParams.APIReg === 10010) {

                apiRequestParams.systemParams = apiSystemParams;

                config.utils.JwtToken.VerifyToken(config, { "token": apiRequestParams.systemParams.token }, function (decodedObj) {
                    if (decodedObj && decodedObj.decoded.header && decodedObj.decoded.header.UserId) {

                        apiRequestParams.systemParams.UserId = decodedObj.decoded.header.UserId;
                        apiRequestParams.systemParams.EmailId = decodedObj.decoded.header.EmailId;
                        apiRequestParams.systemParams.UserClientId = decodedObj.decoded.header.UserClientId;
                        apiRequestParams.systemParams.SelectedClientId = decodedObj.decoded.header.SelectedClientId;
                        apiRequestParams.systemParams.PropertyId = decodedObj.decoded.header.PropertyId;

                        getTapechartUnassignedresList(config, apiRequestParams, function (err, response) {
                            res.send({ err: err, response: response });
                        });
                    } else {
                        res.send({ response: null, token: null });
                    }
                });

            } else {
                res.end("Request received");
            }
        });

        /* Route for writing data to an excel and downloading it */

        app.post('/getExcelData', function (req, res) {
            // data which needs to be sent in the response.
            let params = req.body;
            params.systemParams = {
                token: req.body.token,
                Source: req.body.Source,
                SourceId: req.body.SourceId,
            }
            //   console.log("req in /getExcelData", systemParams);
            console.log("params in /getExcelData", params);
            //   let getExcelData = function(){};
            if (params.systemParams && params.systemParams.token) {
                config.utils.JwtToken.VerifyToken(config, { "token": params.systemParams.token }, function (decodedObj) {
                    if (decodedObj && decodedObj.decoded.header && decodedObj.decoded.header.UserId) {

                        params.systemParams.UserId = decodedObj.decoded.header.UserId;
                        params.systemParams.EmailId = decodedObj.decoded.header.EmailId;
                        // params.systemParams.ClientId = decodedObj.decoded.header.ClientId;
                        params.systemParams.UserClientId = decodedObj.decoded.header.UserClientId;
                        params.systemParams.SelectedClientId = decodedObj.decoded.header.SelectedClientId;
                        params.systemParams.PropertyId = decodedObj.decoded.header.PropertyId;

                        console.log("UserInstanceId: " + params.systemParams.UserId);
                        // console.log("ClientId: " + params.systemParams.ClientId);
                        console.log("userClientId: " + params.systemParams.SelectedClientId)
                    }
                })
            }
            if (req.body.modulename == 'reservations') {
                getExcelData(config, params, function (error, responseObj) {
                    console.log("responseobj", responseObj);
                    if (error) {
                        console.log("err in getExcelData", res.end(JSON.stringify(error)));
                    }
                    if (responseObj) {
                        console.log("responseObj in getExcelData", responseObj);
                        let responseObjToSend = {
                            reservationList: responseObj,
                            headerColumnList: {
                                ConfirmationNumber: { Label: "Confirmation Number", IsChecked: true, ColumnName: "ConfirmationNumber" },
                                GuestFirstName: { Label: "Guest FirstName", IsChecked: true, ColumnName: "GuestFirstName" },
                                GuestLastName: { Label: "Guest LastName", IsChecked: true, ColumnName: "GuestLastName" },
                                PhoneNumber: { Label: "Phone Number", IsChecked: true, ColumnName: "PhoneNumber" },
                                Email: { Label: "Email", IsChecked: true, ColumnName: "Email" },
                                CityName: { Label: "City", IsChecked: true, ColumnName: "CityName" },
                                StateName: { Label: "State", IsChecked: true, ColumnName: "StateName" },
                                CountryName: { Label: "Country", IsChecked: true, ColumnName: "CountryName" },
                                Persons: { Label: "Persons", IsChecked: true, ColumnName: "Persons" },
                                NumberOfAdults: { Label: "Number Of Adults", IsChecked: true, ColumnName: "NumberOfAdults" },
                                NumberOfChildren: { Label: "Number Of Children", IsChecked: true, ColumnName: "NumberOfChildren" },
                                PropertyName: { Label: "Property Name", IsChecked: true, ColumnName: "PropertyName" },
                                PropertyNickName: { Label: "Property Nick Name", IsChecked: true, ColumnName: "propertyNickName" },
                                UnitName: { Label: "Unit Name", IsChecked: true, ColumnName: "UnitName" },
                                UnitNickName: { Label: "Unit Nick Name", IsChecked: true, ColumnName: "UnitNickName" },
                                UnitTypeName: { Label: "Unit TypeName", IsChecked: true, ColumnName: "UnitTypeName" },
                                StartDate: { Label: "Arrival", IsChecked: true, ColumnName: "checkInDateForExcel" },
                                EndDate: { Label: "Departure", IsChecked: true, ColumnName: "checkOutDateForExcel" },
                                Nights: { Label: "Nights", IsChecked: true, ColumnName: "Nights" },
                                // EndDate: { Label: "", IsChecked: true, ColumnName: "EndDate" },
                                UnitCharges: { Label: "Unit Charges", IsChecked: true, ColumnName: "UnitCharges" },
                                CleaningFees: { Label: "Cleaning Fees", IsChecked: true, ColumnName: "CleaningFees" },
                                Taxes: { Label: "Taxes", IsChecked: true, ColumnName: "Taxes" },
                                OtherCharges: { Label: "Other Charges", IsChecked: true, ColumnName: "OtherCharges" },
                                TotalAmount: { Label: "Total Amount", IsChecked: true, ColumnName: "TotalRate" },
                                DueAmount: { Label: "Due Amount", IsChecked: true, ColumnName: "BalanceRate" },
                                Payments: { Label: "Payments", IsChecked: true, ColumnName: "Payments" },
                                Last4: { Label: "Last4", IsChecked: true, ColumnName: "Last4" },
                                ExpiryDate: { Label: "Expiry Date", IsChecked: true, ColumnName: "ExpiryDate" },
                                Tag: { Label: "Tag", IsChecked: true, ColumnName: "Tag" },
                                StatusName: { Label: "Status Name", IsChecked: true, ColumnName: "StatusName" },
                                SourceName: { Label: "Source Name", IsChecked: true, ColumnName: "SourceName" },
                                SubSourceName: { Label: "SubSource Name", IsChecked: true, ColumnName: "SubSourceName" },
                                DateBooked: { Label: "DateBooked", IsChecked: true, ColumnName: "bookedDateForExcel" },
                                SourceConfirmationNumber: { Label: "Source Confirmation Number", IsChecked: true, ColumnName: "SourceConfirmationNumber" },
                                CrsConfirmationNumber: { Label: "Crs Confirmation Number", IsChecked: true, ColumnName: "CrsConfirmationNumber" },
                                Notes: { Label: "Notes", IsChecked: true, ColumnName: "Notes" },

                            },
                            listType: "list",
                            RowsPerPage: 10,
                            totalCount: 0
                        }
                        console.log("responseObjToSend in getExcelData", responseObjToSend);
                        res.send(responseObjToSend);
                    }


                });
            }
            if (req.body.modulename == 'PaymentsReports') {
                getPaymentExcel(config, params, function (error, responseObj) {
                    if (error) {
                        console.log("err in getPaymentExcel", res.end(JSON.stringify(error)));
                    }
                    if (responseObj) {
                        let responseObjToSend = {
                            paymentReports: responseObj,
                            headerColumnList: JSON.parse(req.body.columnList),
                            listType: "list",
                            RowsPerPage: 10,
                            totalCount: 0
                        }
                        res.send(responseObjToSend);
                    }
                })
            }
            if (req.body.modulename == 'SalesReports') {
                getSalesExcel(config, params, function (error, responseObj) {
                    if (error) {
                        console.log("err in getSalesExcel", res.end(JSON.stringify(error)));
                    }
                    if (responseObj) {
                        let responseObjToSend = {
                            paymentReports: responseObj,
                            headerColumnList: JSON.parse(req.body.columnList),
                            listType: "list",
                            RowsPerPage: 10,
                            totalCount: 0
                        }
                        res.send(responseObjToSend);
                    }
                })
            }


        });
        /* Route for writing data to an excel and downloading it */

        // ==================== files uploading =================================

        http.listen(process.env.PORT || 1339);
    })

    .catch(reason => {
        console.log(reason);
    });

    
process.on('uncaughtException', (err) => {
    console.log("uncaughtException", err)
    logger.fatal((new Date).toUTCString() + ' uncaughtException:', err.message, err.stack);
    process.exit(1);
});