const sharp = require('sharp');
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();



module.exports = (configDB, params, callback) => {
    let config = {}
    config['accessKeyId'] = "AKIAJ27DJOG5BWHGUJWQ"
    config['secretAccessKey'] = "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"
    config['region'] = "us-east-1"
    let AWS = require('aws-sdk');
    AWS.config.update(config);
    let bucketName = "app.roomtempo.com"
    let s3 = new AWS.S3();
    let s3Bucket = new AWS.S3({ params: { Bucket: bucketName } })
    let convertImage = (params) => {                                            //  convert image size
        if (params.width && params.height) {
            sharp(params.imageData)
                // .resize(params.width, params.height)
                .toBuffer((err, data, info) => {
                    // console.log(data, info)
                    if (info) {
                        let width = params.width
                        let height = params.height
                        if (info.height > info.width) {
                            width = Math.round(info.width * height / info.height)
                        }
                        else if (info.height < info.width) {
                            height = Math.round(width * info.height / info.width)
                        }
                        sharp(params.imageData)
                            .resize(Math.round(width), height)
                            .toBuffer((err, data, info) => {
                                // console.log(data, info)
                                if (err) {
                                    callback(err, null)
                                }
                                else {
                                    callback(err, data)
                                }
                            });
                    }
                });
        }
        else {
            callback(null, params.imageData)
        }

    }
    

    let downloadImageFromS3 = (params) => {                                                                                     // download image from amazon
        console.log("downloadImageFromS3params", params);
        s3Bucket.getObject(params.downloadParams, function (err, res) {
            if (err) {
                callback(err)
            }
            else if (params.height && params.width) {
                params['imageData'] = res.Body
                convertImage(params);
            }

            else {
                let data = {}
                data.imageGuid = params.downloadParams.Key
                data.imageData = res.Body
                data.ContentType = res.ContentType

                callback(err, data.imageData)
                // callback(err, data)
            }
        })
    }
    let saveImageToS3 = (params) => {                                                                                            // upload image to amazon
        let dataObj = { Key: params.imageGuid, Body: params.image, ContentType: params.mimetype }          // Expected params.Body to be a string, Buffer, Stream, Blob, or typed array object

        s3Bucket.putObject(dataObj, function (err, data) {
            if (err) {
                console.log('Error uploading data: ', err);
                callback(err)
            } else {
                let obj = {}
                callback(err, { 'imageGuid': dataObj.Key })
                // console.log('succesfully uploaded the image and created document! with ' + dataObj.Key);
            }
        });
    };
    if (params.method == 30031) {
        uidgen.generate((err, uid) => {
            if (err) {
                return callback(err)
            }
            // console.log(uid)
            params.imageGuid = uid;
            saveImageToS3(params)
        });

    }
    else if (params.method == 30032) {
        var urlParams = { Bucket: bucketName, Key: params.imageGuid };
        var urlParams = { width: params.width, height: params.height, downloadParams: { Bucket: bucketName, Key: params.imageGuid } };

        downloadImageFromS3(urlParams)                                                                  // download image
    }

    else if (params.method == 30033) {                                                                  // delete image
        var paramsObj = {
            Bucket: bucketName,
            Key: params.imageGuid,
        };
        s3.deleteObjectTagging(paramsObj, function (err, data) {
            if (!err) {
                console.log(err); // an error occurred
                data['success'] = true
                callback(err, data)
            }
            else {
                callback(err, data)
                // console.log(data);           // successful response
            }
        });

    }


}