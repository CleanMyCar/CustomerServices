const mssql = require('mssql');

module.exports = (config, params, callback) => {
    // console.log("params.clientContent.CanExpire",params.clientContent.CanExpire)
    return new Promise((resolve, reject) => {
       

        let spName;
        let requestParams = config.dbwrapper.getNewRequest();

        if (params.section == "ClientInfo") {
            spName = 'SaveClientInformation';
            // console.log("clientinfo id", params.basicData.ClientId);
            requestParams.input('ClientId', mssql.Int, params.clientId);
            requestParams.input('ClientName', mssql.NVarChar, params.basicData.ClientName);
            requestParams.input('ClientCode', mssql.NVarChar, params.clientContent.ClientCode);
            requestParams.input('StatusId', mssql.INT, params.StatusId);
            requestParams.input('PhoneNumber', mssql.NVARCHAR, params.basicData.PhoneNumber);
            requestParams.input('EmailAddress', mssql.NVarChar, params.basicData.Email);
            requestParams.input('Address', mssql.NVarChar, params.basicData.Address1);
            requestParams.input('Address2', mssql.NVarChar, params.basicData.Address2);
            requestParams.input('CountryId', mssql.Int, params.CountryId);
            requestParams.input('StateId', mssql.Int, params.StateId);
            requestParams.input('CityId', mssql.Int, params.CityId);
            requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
            requestParams.input('PostalCode', mssql.NVarChar, params.basicData.PostalCode);
            requestParams.input('countryName', mssql.NVarChar, params.basicData.CountryName);
            requestParams.input('cityName', mssql.NVarChar, params.CityName);
            requestParams.input('stateName', mssql.NVarChar, params.basicData.StateName);

            requestParams.input('emailservice', mssql.NVarChar, params.basicData.emailservice);
            requestParams.input('emailpassword', mssql.NVarChar, params.basicData.emailpassword);

            requestParams.input('sendemail', mssql.Bit, params.basicData.sendemail);

          
        }
      
        else if (params.section == "clientPolicy") {
             console.log("SaveClientPolicyDetails");
            spName = 'SaveClientPolicyDetails';
        //    console.log("policycontent title===>",params.PolicyData.ContentTitle)
            requestParams.input('ClientId', mssql.Int, params.ClientId);
            requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
            requestParams.input('ContentId', mssql.INT, params.ContentId);
            requestParams.input('ContentTitle', mssql.NVARCHAR, params.PolicyData.ContentTitle);
            requestParams.input('Description', mssql.NVARCHAR, params.PolicyData.Content);
            requestParams.input('StatusId', mssql.NVARCHAR,params.PolicyData.StatusId);
            // console.log("SaveClientPolicyDetails===>",params.PolicyData.StatusId);

        }
        else if (params.section == "clientContent") {                
          console.log("SaveClientContentDetails");
           spName = 'SaveClientContentDetails';

           requestParams.input('ClientId', mssql.Int, params.ClientId);
           requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
           requestParams.input('ContentId', mssql.INT, params.ContentId);
           requestParams.input('clientLogo', mssql.NVarChar, params.clientContent.ClientLogo);
           requestParams.input('Description', mssql.NVARCHAR, params.clientContent.Content);
           requestParams.input('ClientWebsite', mssql.NVARCHAR, params.clientContent.WebSiteURL);
           requestParams.input('CurrencyId', mssql.Int, params.basicData.CurrencyId);
           requestParams.input('Timezone', mssql.NVARCHAR, params.basicData.TimeZone);
           requestParams.input('StatusId', mssql.INT, 1);
           requestParams.input('CanExpire', mssql.Bit, params.clientContent.CanExpire == "1" || params.clientContent.CanExpire == 1 || params.clientContent.CanExpire == true ? 1 : 0);
           requestParams.input('ExpiryTime', mssql.NVarChar, params.clientContent.ExpiryTime);

       }
  



        else {
            resolve(null);
            return;
        }

        if (spName) {
            requestParams.execute(spName, (err, result) => {
                if (err) {
                    console.log("the basic error", err);
                    callback(err);
                    //return
                    reject(err);
                }

                // console.log("newDetail", result);
                var actualObj = JSON.stringify(result);
                // console.log("new json data in saveClient====================>" , result.recordsets);
                callback(null, result);
                resolve(result);
                // console.log("basic info result",result);

            })
        }

    })
}


