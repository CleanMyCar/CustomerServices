// const mssql = require('mssql');

// const config = {
//     // server: 'roomtempo.c9p1injyxoz6.ap-south-1.rds.amazonaws.com',
//     // port:1401,
//     server: '192.168.1.126',
//     user: 'sa',
//     password:'sa@1234',
//     // password: 'Apple#123',
//     database: 'RoomTempo',
//     pool: {
//         max: 10,
//         min: 0,
//         idleTimeoutMillis: 30000
//     },
//     options: {
//         appName: "abhi-dev-1"
//     }
// };

// mssql.connect(config).then((_pool) => {
//     //pool = _pool;
//     console.log("MSSQLSERVER Connection Established..!")
// });

// mssql.on('error', err => {
//     // ... error handler
//     console.log(err)
// });

module.exports = (mssql) => {
    return new mssql.Request();
};