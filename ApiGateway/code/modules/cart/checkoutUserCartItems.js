const mssql = require('mssql');

module.exports = (config, params, callback) => {
    const requestParams = config.dbwrapper.getNewRequest();    
    requestParams.input('UserId', mssql.INT, params.systemParams.UserId);

    let CartItemsQuantity = new mssql.Table();
    CartItemsQuantity.columns.add('Id', mssql.Int);
    CartItemsQuantity.columns.add('Quantity', mssql.INT);

    if(params.cartItems && params.cartItems.length > 0){
        
        for (let i = 0; i < params.cartItems.length; i++) {
            if (params.cartItems[i].Quantity > 1 && params.cartItems[i].VehicleCategoryType == 3)
                CartItemsQuantity.rows.add(params.cartItems[i].RequestId, params.cartItems[i].Quantity);
        }
    }

    requestParams.input('CartItemsQuantity', CartItemsQuantity);

    requestParams.execute('CheckoutUserCartItems', (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return
        }

        // console.log(result);
        callback(null, result.recordsets[0][0])
    })
}