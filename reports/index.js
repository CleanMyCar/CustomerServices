const express = require('express');
const httpModule = require('http');
var bodyParser = require('body-parser');
var cors = require('cors');
let app = express();
app.use(cors());
let http = httpModule.createServer(app);
const request = require('request-promise');
var Excel = require('exceljs');
var PhantomPDF = require('phantom-pdf');
var fs = require('fs');
var path = require('path');
var conversion = require("phantom-html-to-pdf")();
var moment = require("moment");

app.use(bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' }));
app.use(bodyParser.urlencoded(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' })));
// var config = require('./config');

/* This is a backend route to write data to excel and download it */
const configParams = (() => {
    let p = {
        // logger: logger,      
        roomTempoApiUrl: "http://localhost:1339"
    }

    //override from env variables
    if (process.env.roomTempoApiUrl) {
        p.roomTempoApiUrl = process.env.roomTempoApiUrl;
    }
    return p
})();

app.post('/exportToExcel', function (req, res) {

    // console.log("req in /exportToExcel", req);
    console.log("params in /exportToExcel", req.body);
    // console.log("res in ", res);
    //  Excel sheet properties. You may access properties which are sent from web client.
    var fileNameExcel = req.body.filename;
    var workbook = new Excel.Workbook();
    workbook.created = new Date();
    var worksheet = workbook.addWorksheet(fileNameExcel + "list");
    var fileName = fileNameExcel + '.xlsx';



    // Request properties to make a call to a route in ApiGateway
    const options = {
        method: 'POST',
        uri: configParams.roomTempoApiUrl + '/getExcelData',
        body:
            req.body

        ,
        json: true
    }

    // Making a call to ApiGateway URL.
    request(options).then(function (response) {
        // console.log(response)
        if (req.body.modulename == 'reservations') {
            if (req.body.format == 'Excel') {
                // console.log("response", response.reservationList.reservationList)
                var valid = true;
                var columnHeaders = [];
                var reservationList = response.reservationList.reservationList;
                var headerValues = response.headerColumnList;
                // Fetching all the header values that needs to be written into an excel sheet and pushing it to an array.
                Object.keys(headerValues).forEach(function (keyheader) {
                    if (headerValues[keyheader].IsChecked == true) {
                        columnHeaders.push({ header: headerValues[keyheader].Label, key: headerValues[keyheader].ColumnName, width: 32 });
                    } else {
                        return;
                    }
                });

                // Fetching all the row values that needs to be written into an excel sheet and pushing into an object.    
                if (columnHeaders.length != 0) {
                    // for (var i = 0; i < reservationList.length; i++) {
                        for(var i in reservationList){
                        var excelObject = {};
                        var currentObj = reservationList[i];
                        // console.log("reservationList[i]", currentObj);
                        // for (var k = 0; k < columnHeaders.length; k++) {
                            for (var k in columnHeaders) {
                            if (currentObj.hasOwnProperty(columnHeaders[k].key)) {
                                var filteredData = null;
                                // code to format any column values 
                                worksheet.getRow(1).font = { name: 'Arial Black', family: 2, size: 10, bold: true };

                                worksheet.views = [
                                    { state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'G10', activeCell: 'A1' }
                                ];
                                if (columnHeaders[k].key == 'GuestFirstName') {
                                    // filteredData = currentObj[columnHeaders[k].key] + " " + currentObj.NumberOfAdults + " Adults, " + currentObj.NumberOfChildren + " Children ";
                                    // excelObject[columnHeaders[k].key] = filteredData;
                                    filteredData = currentObj[columnHeaders[k].key];
                                    excelObject[columnHeaders[k].key] = filteredData;
                                    // console.log("column name" + columnHeaders[k].header + "value " + filteredData)
                                }
                                else if (columnHeaders[k].key == 'GuestLastName') {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    excelObject[columnHeaders[k].key] = filteredData;
                                    // filteredData = currentObj[columnHeaders[k].key] + " - " + currentObj.EndDate + "(" + currentObj.Nights + " Nights) ";
                                    // excelObject[columnHeaders[k].key] = filteredData;
                                    // console.log("column name" + columnHeaders[k].header + "value " + filteredData)
                                }
                                else if (columnHeaders[k].key == 'checkInDateForExcel') {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(17).numFmt = 'DD-MMM-YY'
                                    // excelObject[columnHeaders[k].key] = filteredData;
                                    // var cell = worksheet.getColumn(17);
                                    // cell.value = currentObj[columnHeaders[k].key];
                                    // expect(cell.type).toEqual(Excel.ValueType.Date);
                                    excelObject[columnHeaders[k].key] = new Date(currentObj[columnHeaders[k].key]);

                                }
                                else if (columnHeaders[k].key == 'checkOutDateForExcel') {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(18).numFmt = 'DD-MMM-YY'
                                    // excelObject[columnHeaders[k].key] = filteredData;
                                    // var cell = worksheet.getColumn(17);
                                    // cell.value = currentObj[columnHeaders[k].key];
                                    // expect(cell.type).toEqual(Excel.ValueType.Date);
                                    excelObject[columnHeaders[k].key] = new Date(currentObj[columnHeaders[k].key]);

                                }
                                else if (columnHeaders[k].key == 'bookedDateForExcel') {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(33).numFmt = 'DD-MMM-YY\\ h:mm\\ AM/PM'
                                    excelObject[columnHeaders[k].key] = new Date(currentObj[columnHeaders[k].key]);

                                }
                                else if(columnHeaders[k].key == 'UnitCharges'){
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(20).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;

                                }
                                else if(columnHeaders[k].key == 'Taxes'){
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(22).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;

                                }
                                else if(columnHeaders[k].key == 'CleaningFees'){
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(21).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;

                                }
                                else if(columnHeaders[k].key == 'OtherCharges'){
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(23).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;

                                }
                                else if(columnHeaders[k].key == 'TotalRate'){
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(24).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;

                                }
                                else if(columnHeaders[k].key == 'Payments'){
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(26).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;

                                }
                                else if(columnHeaders[k].key == 'BalanceRate'){
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(25).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;

                                }
                                // else if (['bookedDateForExcel', 'UnitCharges', 'Taxes', 'CleaningFees', 'OtherCharges', 'TotalRate', 'Payments', 'BalanceRate'].indexOf(columnHeaders[k].key) > -1) {
                                //     filteredData = currentObj[columnHeaders[k].key];

                                //     worksheet.getColumn(26).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                //     worksheet.getColumn(25).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                //     worksheet.getColumn(24).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                //     worksheet.getColumn(23).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                   
                                //     worksheet.getColumn(21).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    
                                //     excelObject[columnHeaders[k].key] = filteredData;
                                // }
                                else {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    excelObject[columnHeaders[k].key] = filteredData;
                                    //console.log("column name" + columnHeaders[k].header + "value " + filteredData)
                                }
                            }
                        }
                        // Adding headers to the excel sheet.
                        if (valid) {
                            worksheet.columns = columnHeaders;
                            valid = false;
                        }
                        // Adding all reservation row values to the excel sheet.
                        worksheet.addRow(excelObject);
                    }
                    // Header properties
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
                    // Writing the response to the excel file and downloading it .
                    workbook.xlsx.write(res).then(function () {
                        res.end();
                    }).catch((err) => {
                        console.log(err);
                        res.send({ "errorMessage": "Failed" });
                    });
                } else {
                    res.send({ "errorMessage": "Failed" });
                }
            }

            if (req.body.format == 'Pdf') {
                // -------------------------------------------------------------------------------------
                let tableData = response.reservationList.reservationList;
                var table;
                console.log("response.reservationList.reservationList pdf", tableData[1])
                var stylesheet = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
                if (tableData.length > 0) {
                    //create table
                    // table = `<div class="table-responsive"><table class="table table-bordered table-space"><thead><tr>`
                    table = `<table class="table table-bordered table-space"><tr>`
                    Object.keys(tableData[0]).forEach((key) => {
                        // console.log("keys in pdf", tableData[1][key]);
                        table += `<th style="page-break-inside:avoid;">` + [key] + `</th>`;
                    })
                    table += `</tr>`;
                    for (var i = 0; i < tableData.length; i++) {

                        //create table body
                        let tbody = `<tr style="page-break-inside:avoid; page-break-after:auto">`;

                        Object.keys(tableData[0]).forEach((key) => {
                            if (tableData[i][key] !== null || tableData[i][key] === undefined) {
                                // console.log("tableData[i][key]", tableData[i][key], key);

                                tbody += `<td style="page-break-inside:avoid;">` + tableData[i][key] + `</td>`;
                            }
                            else if ((tableData[i][key] === undefined || tableData[i][key] === null)) {
                                // console.log("tableData[i][key] in else", tableData[i][key], key);
                                tbody += `<td>` + ' ' + `</td>`;
                            }

                        })
                        table += tbody
                    }

                    table += `</tr></table>`;

                }
                // console.log("tabledata", tableData)
                let head = `<head>
                            <title>busy</title>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                            <link rel="stylesheet" href="`+ stylesheet + `">
                            </head>
                            <style>
                            .heading{color:blue !important}
                            .headimage{height:150px;width:100%}
                            .table-space{
                                margin-top:50px
                            }
                            
                            </style><body>`+ table + `</body>`
                // let content = head;
                var options_landscape = {
                    "html": head,
                    "header": '<div></div>',
                    "footer": '<div style="float:right">Page : {#pageNum}</div>',
                    paperSize: {
                        format: 'A1',
                        orientation: 'landscape',
                        margin: '1.1cm',
                        headerHeight: '0.5in',
                        footerHeight: '0.5in',
                        zoom: '0.2'
                    },
                    allowLocalFilesAccess: true
                    // pagesplit: true

                }

                var filename = 'reservationsList.pdf';

                conversion(options_landscape, function (err, pdf) {
                    if (pdf) {
                        // console.log('dhjdf')
                        res.header('Content-disposition', 'inline; filename=' + filename);
                        res.header('Content-type', 'application/pdf');
                        res.attachment(filename);
                        pdf.stream.pipe(res);               //creating pdf file landscap view
                    }
                    else if (err) {
                        res.send({ errorMessage: "Session Expired" });
                    }
                })



                // ------------------------------------------------------------------
            }

        }
        else if (req.body.modulename == 'PaymentsReports') {
            if (req.body.format == 'Excel') {
                var valid = true;
                var columnHeaders = [];
                // console.log("response.paymentReports=", response.paymentReports[0][0])
                var paymentReports = response.paymentReports[0]
                var headerValues = response.headerColumnList;
                // Fetching all the header values that needs to be written into an excel sheet and pushing it to an array.
                Object.keys(headerValues).forEach(function (keyheader) {
                    if (headerValues[keyheader].IsChecked == true) {
                        columnHeaders.push({ header: headerValues[keyheader].ColumnName, key: headerValues[keyheader].Label, width: 32 });
                    } else {
                        return;
                    }
                });

                if (columnHeaders.length != 0) {
                    for (var i = 0; i < paymentReports.length; i++) {
                        var excelObject = {};
                        var currentObj = paymentReports[i];
                        for (var k = 0; k < columnHeaders.length; k++) {
                            if (currentObj.hasOwnProperty(columnHeaders[k].key)) {
                                var filteredData = null;
                                // code to format any column values 
                                worksheet.getRow(1).font = { name: 'Arial Black', family: 2, size: 10, bold: true };

                                worksheet.views = [
                                    { state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'G10', activeCell: 'A1' }
                                ];
                                if (columnHeaders[k].key == 'TotalFoliocharges') {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = "$#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == 'Balance') {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = "$#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == 'Amount') {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = "$#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == 'FeeCollected') {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = "$#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                } else if (columnHeaders[k].key == 'NetAmount') {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = "$#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }

                            }
                        }
                        if (valid) {
                            worksheet.columns = columnHeaders;
                            valid = false;
                        }
                        // Adding all reservation row values to the excel sheet.
                        worksheet.addRow(excelObject);
                    }
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
                    // Writing the response to the excel file and downloading it .
                    workbook.xlsx.write(res).then(function () {
                        res.end();
                    }).catch((err) => {
                        console.log(err);
                        res.send({ "errorMessage": "Failed" });
                    });
                } else {
                    res.send({ "errorMessage": "Failed" });
                }
            }
        }
        else if (req.body.modulename == 'SalesReports') {
            if (req.body.format == 'Excel') {
                var valid = true;
                var columnHeaders = [];
                console.log("response.paymentReports=", response.paymentReports[1])
                var paymentReports = response.paymentReports[1]
                var headerValues = response.headerColumnList;
                // Fetching all the header values that needs to be written into an excel sheet and pushing it to an array.
                Object.keys(headerValues).forEach(function (keyheader) {
                    if (headerValues[keyheader].IsChecked == true) {
                        columnHeaders.push({ header: headerValues[keyheader].ColumnName, key: headerValues[keyheader].Label, width: 32 });
                    } else {
                        return;
                    }
                });

                if (columnHeaders.length != 0) {
                    for (var i = 0; i < paymentReports.length; i++) {
                        var excelObject = {};
                        var currentObj = paymentReports[i];
                        for (var k = 0; k < columnHeaders.length; k++) {
                            // console.log("columnHeaders[k].key = ",columnHeaders[k].key)
                            if (currentObj.hasOwnProperty(columnHeaders[k].key)) {
                                var filteredData = null;
                                // code to format any column values 
                                worksheet.getRow(1).font = { name: 'Arial Black', family: 2, size: 10, bold: true };

                                worksheet.views = [
                                    { state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'G10', activeCell: 'A1' }
                                ];
                                if (columnHeaders[k].key == 'ResCount') {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = " #,##0"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == "Nights") {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = " #,##0"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == "Occ") {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = "#,##0"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == "CancOcc") {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = " #,##0"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == "TotalStaycharges") {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == "TotalCleaningFees") {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == "TotalOtherCharges") {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == "TotalTaxes") {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == "Totalcharges") {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == "AvgLOS") {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = " #,##0.00"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == "ADR") {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else if (columnHeaders[k].key == "RevPAR") {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    worksheet.getColumn(k+1).numFmt = " $#,##0.00;[Red]$(#,##0.00)"
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }
                                else {
                                    filteredData = currentObj[columnHeaders[k].key];
                                    excelObject[columnHeaders[k].key] = filteredData;
                                }

                            }
                        }
                        if (valid) {
                            worksheet.columns = columnHeaders;
                            valid = false;
                        }
                        // Adding all reservation row values to the excel sheet.
                        worksheet.addRow(excelObject);
                    }
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
                    // Writing the response to the excel file and downloading it .
                    workbook.xlsx.write(res).then(function () {
                        res.end();
                    }).catch((err) => {
                        console.log(err);
                        res.send({ "errorMessage": "Failed" });
                    });
                } else {
                    res.send({ "errorMessage": "Failed" });
                }
            }
        }
        else {
            res.send({ "errorMessage": "Module not found" })
        }
    })



});


app.post('/FolioInvoice', function (req, res) {
    const options = {
        method: 'POST',
        uri: configParams.roomTempoApiUrl + '/getFolioInvoiceData',
        body:
            req.body
        ,
        json: true
    }
    request(options).then(function (response) {
        // console.log("response.folioData", response.folioData);
        let tableData = response.folioData;
        // var table;
        var stylesheet = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
        // var css = './content/scssStyles.scss'


        let table = '<div class="row">'
            + '<div class="col-md-6">'
        if (tableData.clientDetail && tableData.clientDetail.ClientName) {
            table += '<span>' + tableData.clientDetail.ClientName + '</span>'
            table += '<br>'

        }
        if (tableData.clientDetail && tableData.clientDetail.PropertyName) {
            table += '<span>' + tableData.clientDetail.PropertyName + '</span>'
            table += '<br>'
        }
        if (tableData.clientDetail && tableData.clientDetail.CityName !== undefined && tableData.clientDetail.CityName !== null) {
            table += '<span>' + tableData.clientDetail.CityName + '</span>'
        }
        else if (invoiceDetails.clientDetail) {
            table += '<span>' + invoiceDetails.clientDetail.CountryName + '</span>'
        }
        table += '</div>'
        table += '</div>'
        table += '<div class="row">'
        table += '<div class="col-md-6">'
        if (tableData.reservationDetail && tableData.reservationDetail.GuestFirstName) {
            table += '<span>Bill To:</span>'
            table += '<br>'
            table += '<span>' + tableData.reservationDetail.GuestFirstName + '</span>'
        }
        if (tableData.reservationDetail && tableData.reservationDetail.GuestLastName) {
            table += '<span>' + tableData.reservationDetail.GuestLastName + '</span>'
            table += '<br>'
        }
        if (tableData.reservationDetail && tableData.reservationDetail.CityName !== undefined && tableData.reservationDetail.CityName !== null) {
            table += '<span>' + tableData.reservationDetail.CityName + '' + tableData.reservationDetail.StateName + '</span>'
        }
        else if (tableData.reservationDetail) {
            table += '<span>' + tableData.reservationDetail.CountryName + '</span>'
        }
        table += '</div>'
        table += '</div>'
        table += '<table class="table table-striped">'
        table += '<thead>'
        table += '<tr>'
        table += '<th>#</th>'
        table += '<th>Date</th>'
        table += '<th>Item Description</th>'
        table += '<th>Qty</th>'
        table += '<th>Amount</th>'
        table += '</tr>'
        table += '</thead>'
        table += '<tbody>'

        var index = 1
        for (var i in tableData.folioItems) {
            console.log("tableData.folioItems[i][MasterItem].DateEffective", tableData.folioItems[i]["MasterItem"].DateEffective);
            table += '<tr>'
                + '<td>' + index + '</td>'
                + '<td>' + moment(tableData.folioItems[i]["MasterItem"].DateEffective).format('DD MMM') + '</td>'
                + '<td>' + tableData.folioItems[i]["MasterItem"].ItemDescription + '</td>'
                + '<td>'
                + '<span>' + 1 + '</span>'
            if (tableData.folioItems[i].ChildItems && tableData.folioItems[i].ChildItems.length > 0) {
                table += '<br>'
                for (var j in tableData.folioItems[i].ChildItems) {
                    console.log("tableData.folioItems[i].ChildItems[j].ItemDescription", tableData.folioItems[i].ChildItems[j].ItemDescription)
                    table += '<span>' + tableData.folioItems[i].ChildItems[j].ItemDescription + '</span>'
                    table += '<br>'
                }
            }
            table += '</td>'

            table += '<td>'
                + '<span>' + tableData.folioItems[i]["MasterItem"].Amount + '</span>'

            if (tableData.folioItems[i].ChildItems && tableData.folioItems[i].ChildItems.length > 0) {
                table += '<br>'
                console.log("tableData.folioItems[i].ChildItems[j].Amount", tableData.folioItems[i].ChildItems[j].Amount)
                for (var j in tableData.folioItems[i].ChildItems) {
                    table += '<span>' + tableData.folioItems[i].ChildItems[j].Amount + '</span>'
                    table += '<br>'
                }
            }
            table += '</td>'
            index++

        }

        table += '</tr>'
        table += '</tbody>'
        table += '</table>'
        table += '<div>'
        if (tableData.folioSummary && tableData.folioSummary.GrandTotal) {
            table += '<span>' + 'Grand Total:' + tableData.folioSummary.GrandTotal + '</span>'
            table += '<br>'
        }
        if (tableData.paymentDetails && tableData.paymentDetails.Payments) {
            table += '<span>' + 'Payments:' + tableData.paymentDetails.Payments + '</span>'
            table += '<br>'
        }
        if (tableData.paymentDetails && tableData.paymentDetails.Balance) {
            table += '<span>' + 'Balance:' + tableData.paymentDetails.Balance + '</span>'
        }
        table += '</div>'
        let head = `<head>
                    <title>busy</title>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                    <link rel="stylesheet" href="`+ stylesheet + `">
                    </head>
                    <style>
                    .heading{color:blue !important}
                    .headimage{height:150px;width:100%}
                    .table-space{
                        margin-top:50px
                    }
                    
                    </style><body>`+ table + `</body>`
        // let content = head;

        var options_landscape = {
            "html": head,
            "header": '<div></div>',
            "footer": '<div style="float:right">Page : {#pageNum}</div>',
            paperSize: {
                format: 'A4',
                orientation: 'landscape',
                margin: '1.1cm',
                headerHeight: '0.5in',
                footerHeight: '0.5in',
                zoom: '0.2'
            },
            // pagesplit: true

        }

        var filename = 'invoice.pdf';

        conversion(options_landscape, function (err, pdf) {
            if (pdf) {
                console.log('dhjdf')
                res.header('Content-disposition', 'inline; filename=' + filename);
                res.header('Content-type', 'application/pdf');
                res.attachment(filename);
                pdf.stream.pipe(res);               //creating pdf file landscap view
            }
            else if (err) {
                res.send({ errorMessage: "Session Expired" });
            }
        })

    })
})

/* This is a backend route to write data to excel and download it */

http.listen(process.env.PORT || 3002);
http.timeout = 400000;
console.log("Server started");
process.on('uncaughtException', (err) => {
    console.log((new Date).toUTCString() + ' uncaughtException:', err.message, err.stack);

    process.abort();
});