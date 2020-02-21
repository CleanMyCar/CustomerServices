var FCM = require('fcm-node');
var fcm = new FCM("AAAA3rQHCLQ:APA91bFQsPC4vEtdIlvmIu6MrVxZm4E_Zvb9xunBMtXYTIo3llNDiZditEt0e4pM6CKEBKGecoPoavjm2m_7ZgFakEweCDkKWdT3lXQuGTKwVQwU8N_7uM8JkgBG75oA6rOr6H-Qn3rg");

module.exports = (config, params, callback) => {

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
        to: params.deviceId,
        collapse_key: 'your_collapse_key',

        notification: {
            title: params.title,
            body: params.message
        },

        data: {  //you can send only notification or only data(or include both) 
            message: params.message,
            // image: "https://lh4.ggpht.com/mJDgTDUOtIyHcrb69WM0cpaxFwCNW6f0VQ2ExA7dMKpMDrZ0A6ta64OCX3H-NMdRd20=w300"
        }
    };

    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!", err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
        callback(err, response);
    });
}