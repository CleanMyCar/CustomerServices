module.exports = (config, params, callback) => {

    let headerObj = {
        UserId: params.systemParams.UserId,
        EmailId: params.systemParams.EmailId,                    
        PropertyId: params.systemParams.PropertyId,
        UserClientId: params.systemParams.UserClientId,
        SelectedClientId: params.ClientId
        
    };
    // console.log("SelectedClientId=>",params.ClientId);

    config.utils.JwtToken.GetToken(config, { "expiresIn": 60, "header": headerObj }, function (tokenObj) {
        if (tokenObj) {
            callback(null, tokenObj);
            console.log("tokenObj=>",tokenObj)
        }
        else {
            callback({ "error": 1, "ErrorMessage": "Invalid Paremeters" }, null);
        }
    });
        
        // console.log("SelectedClientId=>",this.SelectedClientId);
        // console.log("UserId=>",this.UserId);
}