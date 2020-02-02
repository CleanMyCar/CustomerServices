let _dbwrapper = require('./db/dbWrapper');
let jwtAuthorization = require("./jwtAuthorization");
let mssql = require('mssql');
let _createSqlParams = require('./db/sql/sqlParamsRequest');
let sendSms = require("../modules/common/sendSms");
let sendEmail = require("../modules/common/sendEmail")

module.exports = async function (configParams) {
    try {
		console.log("configParams:" + JSON.stringify(configParams))
        var config = {
            server: configParams.sql.server,
            user: configParams.sql.user,
            password: configParams.sql.password,
            // password: 'Apple#123',
            database: configParams.sql.database,
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            },
            options: {
                encrypt: configParams.sql.options.encrypt,
                appName: "cloud-roomtemp0"
            },
            connectionTimeout: 50000,
            requestTimeout: 50000,
        };

        if (configParams.sql.port) {
            config.port = configParams.sql.port;
        }

        console.log("config:" + JSON.stringify(config))

        var pool = new mssql.ConnectionPool(config);
		pool.connect().catch(err => {
			// ... error handler
            console.log('SQLConnError:',err);
		});

        

        let dbwrapper = await _dbwrapper(pool);
        let createSqlParams = await _createSqlParams(dbwrapper);

        return {
            dbwrapper: dbwrapper,
            socketIo: null,
            moment: null,
            utils: {
                Decrypt: function (encrypted, salt) {
                    let decrypted = CryptoJS.TripleDES.decrypt(encrypted, salt);
                    let plaintext = decrypted.toString(CryptoJS.enc.Utf8);
                    return plaintext;
                },
                EncryptionForCookie: function (val) {

                    let crypto = require('crypto'),
                        algorithm = 'aes-128-cbc',
                        password = new Buffer('NextGenerationPO', "utf8"), //C12345
                        iv = new Buffer('NextGenerationPO', "utf8"),
                        clearEncoding = 'utf8',
                        cipherEncoding = 'base64'; // hex, base64  

                    let decipher = crypto.createCipheriv(algorithm, password, iv);
                    let plaintext = decipher.update(val, clearEncoding, cipherEncoding);
                    plaintext += decipher.final(cipherEncoding);
                    return plaintext;
                },

                JwtToken: jwtAuthorization,
                GenerateOtp: function () {
                    let otp;
                    otp = Math.floor(Math.random() * 9999 + 1000);
                    while (otp.toString().length !== 4) {
                        otp = Math.floor(Math.random() * 9999 + 1000);
                    }
                    return otp;
                },
                sendOtp: false,
                scaitsSecretKey: 'scaits',
                sqlConnectionCall: createSqlParams.sqlConnectionCall,
            },
            jwtsecretcode: "$RVW#123$",
            logger: null,
            smsProvider: {
                url: 'http://api.smscountry.com/SMSCwebservice_bulk.aspx',
                userName: "gunnamsubhash",
                password: "78381981",
                senderId: "SMSCountry"
            },
            rentalUnitedApiUrl: configParams.rentalUnitedApiUrl,
            sessionTimeOut: configParams.sessionTimeOut,
            // googleAnalyticsJwt : configParams.googleAnalyticsJwt
            paytmConfig: null,
            sendSms: sendSms,
            sendEmail: sendEmail
        }
    }
    catch (e) {
        return Promise.reject(e);
    }
};