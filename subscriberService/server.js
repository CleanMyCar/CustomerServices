const express = require('express');
const httpModule = require('http');
var bodyParser = require('body-parser');
var cors = require('cors');
let app = express();
app.use(cors());
let http = httpModule.createServer(app);
const request = require('request-promise');
var fs = require('fs');
var moment = require("moment");

app.use(bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' }));
app.use(bodyParser.urlencoded(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' })));

const configParams = (() => {
    let p = {
        sql: {
            server: '127.0.0.1',
            user: 'sa',
            password: 'Apple#123',
            database: 'master',
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            },
            options: {
                encrypt: false,
                appName: "cloud-Rajendra"
            }
        },
        rentalUnitedApiUrl: 'http://localhost:3000',
        sessionTimeOut: 30000, //minutes        
    };

    //override from env variables    
    if (process.env.sqlserver && process.env.sqluser && process.env.sqlpassword && process.env.sqldatabase) {
        p.sql.server = process.env.sqlserver;
        p.sql.user = process.env.sqluser;
        p.sql.password = process.env.sqlpassword;
        p.sql.database = process.env.sqldatabase;
        if (process.env.sqlencrypt) {
            p.sql.options.encrypt = process.env.sqlencrypt;
        }
    }
    if (process.env.port) {
        p.sql.port = process.env.port;
    }
    return p
})();

var schedule = require('node-schedule');
let executeSubscriptionTasks = require("./code/subscription/executeSubscriptionTasks");
let suspendTasks = require("./code/subscription/suspendTasks");

require('./code/core/core')(configParams)
    .then(config => {
        var j = schedule.scheduleJob('*/1 * * * *', async function () {
            console.log('Running subscription task - Create recurrence tasks !!');
            await executeSubscriptionTasks(config);
        });

        var j = schedule.scheduleJob('*/1 * * * *', async function () {
            console.log('Running nightly job - to suspend the tasks which are not having sufficient wallet amount!');
            await suspendTasks(config);
        });
    })
    .catch((ex) => {
        console.log('core init failed: ', ex.message, ex.stack);
    })

process.on('uncaughtException', (err) => {
    console.log((new Date).toUTCString() + ' uncaughtException:', err.message, err.stack);
    process.abort();
});