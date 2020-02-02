const mssql = require("mssql");
const moment = require("moment");
const updateSuspendedServices = require("./updateSuspendedServices");

module.exports = (config, params, callback) => {
    try {
        const requestParams = config.dbwrapper.getNewRequest();
        requestParams.input("WalletTransactionId", mssql.Int, params.WalletTransactionId);
        requestParams.input("WalletId", mssql.Int, params.WalletId);
        requestParams.input("Amount", mssql.Money, params.Amount);
        requestParams.input("TransactionDate", mssql.DateTime, params.TransactionDate ? moment(params.TransactionDate).format("YYYY-MM-DD HH:mm:ss") : null);
        requestParams.input("IsCredited", mssql.Int, params.IsCredited);
        requestParams.input("PaymentTransactionId", mssql.NVarChar, params.PaymentTransactionId);
        requestParams.input("UserId", mssql.Int, params.systemParams.UserId);
        requestParams.input("PaymentMode", mssql.NVarChar, params.PaymentMode);
        requestParams.input("PaymentCurrency", mssql.NVarChar, params.PaymentCurrency);
        requestParams.input(
            "PaymentTransactionDate",
            mssql.DateTime,
            null
        );
        requestParams.input("TransactionStatus", mssql.NVarChar, params.TransactionStatus);
        requestParams.input("TransactionRespCode", mssql.NVarChar, params.TransactionRespCode);
        requestParams.input("TransactionRespMessage", mssql.NVarChar, params.TransactionRespMessage);
        requestParams.input("PaymentGatewayName", mssql.NVarChar, params.PaymentGatewayName);
        requestParams.input("BankTransactionId", mssql.NVarChar, params.BankTransactionId);
        requestParams.input("BankName", mssql.NVarChar, params.BankName);
        requestParams.input("RequestId", mssql.Int, params.RequestId);
        requestParams.input("RefundAmount", mssql.Money, params.RefundAmount);
        requestParams.input("PaymentTransactionType", mssql.NVarChar, params.PaymentTransactionType);

        requestParams.execute("SaveRechargeTransaction", (err, result) => {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }

            if (result.recordsets[0][0]&& result.recordsets[0][0].WalletTransactionId && params.TransactionStatus == "01") {
                updateSuspendedServices(config, params, function(err, response){
                    if(err){
                        console.log("activate services failed", err);
                    }
                })
            }

            return callback(null, {
                walletDetails: result.recordsets[0][0],
                userDetails: result.recordsets[1][0],
                paytmConfig: result.recordsets[2][0]
            });
        });
    } 
    catch (ex) {
        console.log(ex);
        callback(ex);
    }
};