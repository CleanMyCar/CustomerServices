// import jwt from "jsonwebtoken";
let jwt = require("jsonwebtoken");
module.exports = {

    GetToken: function (config, params, callback) {
        let expiryTime = 30* 24 * 10 * 60; //(30 days for the mobiles)
        try {

            if (params.header.Source && params.header.Source == "Web") {
                expiryTime = 1 * (config.sessionTimeOut) * 60
            }

            //params.expiresIn = 1 * (config.sessionTimeOut) * 60;
            let token = jwt.sign(params, config.jwtsecretcode, {
                expiresIn: expiryTime //24 * 60 * 60 // expires in 24 hours, number is seconds
            });

            let tokenData = {
                token: token
            };
            if (callback)
                callback(tokenData);
            else
                return tokenData;
        } catch (ex) {
            callback(undefined);
        }
    },
    VerifyToken: function (config, params, callback) {

        let dataToSend = {};
        // verifies secret and checks exp
        try {
            let decoded = jwt.verify(params.token, config.jwtsecretcode);
            dataToSend.decoded = decoded;

        } catch (ex) {
            //token expired
            if (ex.message = "jwt expired") {
                if (callback) {
                    callback(undefined);
                    return;
                }
                else
                    return undefined;
            }
        }
        if (callback)
            callback(dataToSend);
        else
            return dataToSend;
    },
    UpdateToken: function (config, params, callback) {
        try {
            let decoded = jwt.verify(params.token, config.jwtsecretcode);

            params.UserId = decoded.header.UserId;

            let token = jwt.sign(
                {"expiresIn": 60,
                 "header": {
                     PropertyId: params.PropertyId,
                     UserClientId: params.UserClientId,
                     UserId: params.UserId, 
                     SelectedClientId: params.SelectedClientId
                    }
                }, config.jwtsecretcode, 
                {
                    expiresIn: 24 * 60 * 60 //24 * 60 // expires in 24 hours, number is seconds
                }
            );

               

            let tokenData = {
                token: token
            };

            if (callback)
                callback(tokenData);
            else
                return tokenData;
        }
        catch (ex) {
            if (callback)
                callback(undefined);
            else
                return undefined;
        }
    },
    DecryptToken: function (token, key, callback) {
        try {
            let decoded = jwt.verify(token, key);

            let tokenData = {
                token: decoded
            };

            if (callback)
                callback(tokenData);
            else
                return tokenData;
        }
        catch (ex) {
            if (callback)
                callback(undefined);
            else
                return undefined;
        }

    },
    EncryptToken: function (callback) {
        try {
            let token = jwt.sign({admNo: 178379941, campusId: 91}, "scaits");

            let tokenData = {
                token: token
            };
            if (callback)
                callback(tokenData);
            else
                return tokenData;
        } catch (ex) {
            callback(undefined);
        }
    }
};