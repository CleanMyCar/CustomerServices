// module.exports = (config, params, callback) => {
//     config.utils.sqlConnectionCall(params, 'GetUserDetail',
//         function (result) {

//             callback(undefined, result);
//         },
//         function (err) {
//             callback(err, undefined);
//         }
//     );
// };





// roles



const mssql = require('mssql');
module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();
    if(params.UserId){

        requestParams.input('UserId', mssql.Int, params.UserId);
        requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
        requestParams.input('loggedInUserId', mssql.Int, params.systemParams.UserId);
        
            }
            else{
                requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
                requestParams.input('loggedInUserId', mssql.Int, params.systemParams.UserId);
                
            }
        
    let userDetailObjToReturn = {
        ErrorMessage: null,
        userObj: null,
        rolesList: null,
        propertylist: null,
        statusList: null
    };

    requestParams.execute('GetUserDetail', (err, result) => {
        
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        if (result.hasOwnProperty("recordsets") && Array(result.recordsets) && result.recordsets.length > 0) {
            // console.log("recordsets in userdetail", result.recordsets);
            // console.log("GetUserDetail========>",result)
           

            if (Array.isArray(result.recordsets[0]) && result.recordsets[0].length > 0) {
                userDetailObjToReturn.userObj = result.recordsets[0][0];
                console.log()

            }

            if (Array.isArray(result.recordsets[1]) && result.recordsets[1].length > 0) {
                userDetailObjToReturn.rolesList = result.recordsets[1];
            }

            if (Array.isArray(result.recordsets[2]) && result.recordsets[2].length > 0) {
                userDetailObjToReturn.propertylist = result.recordsets[2];
            }

            if (Array.isArray(result.recordsets[3]) && result.recordsets[3].length > 0){

                // console.log("result.recordsets[4]", result.recordsets[4]);
                userDetailObjToReturn.statusList = result.recordsets[3];
            }
        }

      
        callback(null, userDetailObjToReturn);
        // console.log("userDetailObjToReturn=====>",result.recordsets)
    })
};
