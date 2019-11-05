const mssql = require('mssql');
module.exports = (config, params, callback) => {
    // console.log("params => ", params);
    // console.log("userId => ", params.systemParams.UserId);
    const requestParams = config.dbwrapper.getNewRequest();
    requestParams.input('user_id', mssql.Int, params.systemParams.UserId);
    requestParams.execute('GetUserEntitlementsAndDefaultProperty', (err, result) => {
        if (err) {
            console.log("GetUserEntitlementsAndDefaultProperty.error => ", err);
            callback(err, null);
            return;
        }

        let returnObj = {
            userEntitlementList: {},
            defaultPropertyId: -1,
            properties: {},
            EntityNames:{}
        };
        
        //  console.log("GetUserEntitlementsAndDefaultProperty=>" ,result)
        if (result && result.hasOwnProperty("recordsets") && Array.isArray(result.recordsets) && result.recordsets.length > 1) {
            // console.log("userEntitlementList===>result",result);
            if (Array.isArray(result.recordsets[0]) && result.recordsets[0].length > 0) {
                result.recordsets[0].forEach((recordObj) => {
                    if (!returnObj.userEntitlementList.hasOwnProperty(recordObj.functionId)) {
                        returnObj.userEntitlementList[recordObj.functionId] = {
                            functionState: recordObj.functionState,
                            isAssigned: recordObj.isAssigned
                        };
                      
                    }
                });
                // console.log("userEntitlementList============>", returnObj.userEntitlementList);
            }
            if (Array.isArray(result.recordsets[1]) && result.recordsets[1].length > 0) {
                if (result.recordsets[1][0].hasOwnProperty("PropertyId")) {
                    returnObj.defaultPropertyId = result.recordsets[1][0]["PropertyId"];
                }
            }
            if (Array.isArray(result.recordsets[2]) && result.recordsets[2].length > 0) {
                if (result.recordsets[2][0].hasOwnProperty("PropertyId")) {
                    returnObj.properties = result.recordsets[2];
                }
            }
            if (Array.isArray(result.recordsets[3]) && result.recordsets[3].length > 0) {
                if (result.recordsets[3][0].hasOwnProperty("EntityName")) {
                    returnObj.EntityNames = result.recordsets[3];
                }
                // console.log("result.recordsets[3]",returnObj.EntityNames);
            }

        }

        
        callback(null, returnObj);
    });
};