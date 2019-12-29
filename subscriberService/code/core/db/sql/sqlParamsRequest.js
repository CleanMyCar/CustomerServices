// import mssql from "mssql";
// import dbwrapper from "../dbWrapper";
let mssql = require("mssql");
let dbwrapper; // = require("../dbWrapper");
const md5 = require('md5');


let sqlConnectionCall = function (params, spName, successCallback, errorCallback) {

    let requestParams;
    if (params.ModuleAction === "UserProfile") {
        requestParams = getUserProfileParams(params, mssql);
    }
    else if (params.ModuleAction === "UpdatePassword") {
        requestParams = getUpdatePasswordParams(params, mssql);
    }

    else if (params.ModuleAction === "ResetPassword") {
        requestParams = getResetPasswordParams(params, mssql);
    }
    else if (params.ModuleAction === "UpdateLogginPassword") {
        requestParams = getUpdateLogginPasswordParams(params, mssql);
    }

    else if (params.ModuleAction === "GetClientProfile") {
        requestParams = getClientDetailsParams(params, mssql);
    }
    else if (params.ModuleAction === "UpdateUserProfile") {
        requestParams = getUpdateUserProfileParams(params, mssql);
    }

    else if (params.ModuleAction === "DeletePropertyDetailById") {
        requestParams = deletePropertyDetailByIdParams(params, mssql);
    }
    else if (params.ModuleAction === "GetUserList") {
        requestParams = getUserListParams(params, mssql);
    }
    else if (params.ModuleAction === "GetUserDetails") {
        requestParams = getUserDetailParams(params, mssql);
    }
    else if (params.ModuleAction === "SaveUserDetail") {
        requestParams = getSaveUserDetailParams(params, mssql);
    }
    else if (params.ModuleAction === "GetUnitDetailById") {

        requestParams = getUnitDetailByIdParams(params, mssql);
    }
    else if (params.ModuleAction === "AddUnitDetail") {

        requestParams = getAddUnitDetailParams(params, mssql);
    }
    else if (params.ModuleAction === "GetPropertyMetaData") {

        requestParams = getPropertyMetaDataParams(params, mssql);
    }
    else if (params.ModuleAction === "GetUnitList") {
        requestParams = getUnitListParams(params, mssql);
    }
    else if (params.ModuleAction === "AddClientDetails") {
        requestParams = getaddclientdetailsParams(params, mssql);
    }

    else if (params.ModuleAction === "GetNewReservationDetail") {
        requestParams = getNewReservationDetailParams(params, mssql);
    }
    else if (params.ModuleAction === "SaveReservationDetail") {
        requestParams = createReservationParams(params, mssql);
    }
    else if (params.ModuleAction === "GetReservationDetailById") {
        requestParams = getReservationDetailByIdParams(params, mssql);
    }
    else if (params.ModuleAction === "GetCityStateCountryById") {
        requestParams = getCityStateCountryByIdParams(params, mssql);
    }
    else if (params.ModuleAction === "UpdateReservationStatus") {
        requestParams = updateReservationStatusParams(params, mssql);
    }

    else if (params.ModuleAction === "Get_Folio_Summary_Details") {
        requestParams = Get_Folio_Summary_DetailsParams(params, mssql);
    }

    else if (params.ModuleAction === "Get_FolioSummary") {
        requestParams = Get_FolioSummaryParams(params, mssql);
    }

    else if (params.ModuleAction === "GetAvailableRooms") {
        requestParams = getAvailableRoomsParams(params, mssql);
    }

    else if (params.ModuleAction === "SaveFolioLedgerTransDetails") {
        requestParams = SaveFolioLedgerTransDetailsParams(params, mssql);
    }
    else if (params.ModuleAction === "SaveClientDaysSelection") {
        requestParams = SaveClientDaysSelectionParams(params, mssql);
    }
    else if (params.ModuleAction === "GetCitySearch") {
        requestParams = getCitySearchParams(params, mssql);
    }

    else if (params.ModuleAction === "Get_NotesDetails") {
        requestParams = get_NotesDetailsParams(params, mssql);
    }

    else if (params.ModuleAction === "Get_PaymentCardDetails") {
        requestParams = get_PaymentCardDetailsParams(params, mssql);
    }

    else if (params.ModuleAction === "SaveGuestProfile") {
        requestParams = saveGuestProfileParams(params, mssql);
    }

    else if (params.ModuleAction === "Get_PaymentDetails") {
        requestParams = getPaymentDetailsParams(params, mssql);
    }
    else if (params.ModuleAction === "GetUserDetailById") {
        requestParams = GetUserDetailByIdParams(params, mssql);
    }
    else if (params.ModuleAction === "SaveOwnerId") {
        requestParams = SaveOwnerIdParams(params, mssql);
    }
    // else if(params.ModuleAction === "Insert_UnitAmenities"){
    //     requestParams = Insert_UnitAmenitiesParams(params, mssql);
    // }
    else {
        requestParams = validateUserParams(params, mssql);
    }

    requestParams.execute(spName, (err, result) => {
        if (err) {
            if (errorCallback)
                errorCallback(err);
            else
                console.log(err);
        }
        else
            successCallback(result);

    });
};

let SaveClientDaysSelectionParams = function (params, sqlRequest) {
    const requestParams = dbwrapper.getNewRequest();
    console.log("saveClientDaysSelection=>", params.CheckedweekDays);

    let checkweek = new mssql.Table();
    checkweek.columns.add('ClientId', mssql.Int);
    checkweek.columns.add('DayId', mssql.Int);
    if(params.CheckedweekDays.length >0 ){
    for (let t = 0; t < params.CheckedweekDays.length; t++) {

        checkweek.rows.add(params.DayId, params.CheckedweekDays[t]);
        params.SelectedDays = checkweek;
    }
}
else{
    checkweek.rows.add(null);
        params.SelectedDays = checkweek;
}
    requestParams.input('ClientId', mssql.INT, params.ClientId);
    requestParams.input('SelectedDays', params.SelectedDays);
    requestParams.input('userID', mssql.INT, params.systemParams.UserId);
    console.log("ClientId", params.ClientId);
    console.log("SelectedDays=>", params.SelectedDays);

    return requestParams;
}

let validateUserParams = function (params, sqlRequest, dbwrapper) {
    //var requestParams = new mssql.Request();
    const requestParams = dbwrapper.getNewRequest();
    requestParams.input('LoginID', mssql.NVarChar, params.UserName);
    requestParams.input('UserPassword', mssql.NVarChar, md5(params.Password));
    requestParams.input('ClientCode', mssql.NVarChar, params.ClientCode);
    requestParams.input('FunctionId', mssql.NVarChar, params.FunctionId);


    return requestParams;
};


let getUpdateLogginPasswordParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('OldPassword', mssql.NVarChar, md5(params.OldPassword));
    requestParams.input('NewPassword', mssql.NVarChar, md5(params.NewPassword));
    requestParams.input('LoggedInUser', mssql.Int, params.systemParams.UserId);

    // console.log("old password=>", params.CurrentPassword);
    // console.log("New Password=>", params.Password);


    return requestParams;
};

let getUserProfileParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    requestParams.input('userID', mssql.Int, params.systemParams.UserId);
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);

    return requestParams;
};


let SaveOwnerIdParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    requestParams.input('CrsId', mssql.Int, params.CrsId);
    requestParams.input('UnitId', mssql.int, params.UnitId);
    requestParams.input('OwnerId', mssql.NVarChar, params.OwnerId);

    return requestParams;
};

let getUpdatePasswordParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.UserId);
    requestParams.input('OldPassword', mssql.NVarChar, md5(params.OldPassword));
    requestParams.input('NewPassword', mssql.NVarChar, md5(params.NewPassword));
    requestParams.input('LoggedInUser', mssql.Int, params.systemParams.UserId);

    // console.log("old password=>", params.CurrentPassword);
    // console.log("New Password=>", params.Password);


    return requestParams;
};

let getResetPasswordParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.UserId);
    requestParams.input('OldPassword', mssql.NVarChar, params.OldPassword);
    requestParams.input('NewPassword', mssql.NVarChar, md5(params.NewPassword));
    requestParams.input('LoggedInUser', mssql.Int, params.systemParams.UserId);

    // console.log("old password=>", params.CurrentPassword);
    // console.log("New Password=>", params.Password);


    return requestParams;
};

let getClientDetailsParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    requestParams.input('ClientCode', mssql.NVarChar, params.ClientCode);

    return requestParams;
};

let get_NotesDetailsParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    requestParams.input('ReservationId', mssql.Int, params.ReservationId);
    requestParams.input('NoteId', mssql.Int, params.NoteId);

    return requestParams;
};

let getPaymentDetailsParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    requestParams.input('ReservationId', mssql.Int, params.ReservationId);
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId ? params.systemParams.SelectedClientId : params.systemParams.ClientId);
    return requestParams;
};

let getUpdateUserProfileParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('ProfileImage', params.ProfileImage);

    return requestParams;
};

let deletePropertyDetailByIdParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    console.log("request" + params.PropertyIdList);
    requestParams.input('PropertyId', mssql.NVarChar, params.PropertyIdList);
    return requestParams;
};

// let GetUserDetailById = function (params, sqlRequest) {
//     let requestParams = dbwrapper.getNewRequest();
//     console.log("request" + params.PropertyIdList);
//     requestParams.input('PropertyId', mssql.NVarChar, params.PropertyIdList);
//     return requestParams;
// };
let GetUserDetailByIdParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();

    requestParams.input('UserId', mssql.Int, params.UserId);
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
    requestParams.input('loggedInUserId', mssql.Int, params.systemParams.UserId);
    console.log("loggedInUserId", params.systemParams.UserId);
    console.log("UserId==>", params.UserId);
    return requestParams;
};


let getUserListParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    // requestParams.input('ClientId', mssql.Int, params.systemParams.ClientId);
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('SortBy', mssql.NVarChar, params.filterObj ? params.filterObj.SortBy: null);
    requestParams.input('SortOrder', mssql.NVarChar, params.filterObj ? params.filterObj.SortOrder : null);

    return requestParams;
};

let getUserDetailParams = function (params, sqlRequest) {
    let requestParams = dbwrapper.getNewRequest();
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    // requestParams.input('ClientId', mssql.Int, params.systemParams.ClientId);
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
    requestParams.input('loggedInUserId', mssql.Int, params.systemParams.UserId);
    console.log("loggedInUserId", params.systemParams.UserId);
    console.log("UserId==>", params.UserId);
    return requestParams;
};

let getUnitDetailByIdParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    requestParams.input('UnitId', mssql.Int, params.UnitId);
    requestParams.input('PropertyId', mssql.Int, params.PropertyId);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId ? params.systemParams.UserId : 1);
    return requestParams;
};



let getAddUnitDetailParams = function (params, sqlRequest) {

    const requestParams = dbwrapper.getNewRequest();

    let checkAminity = new mssql.Table();

    checkAminity.columns.add('ListId', mssql.Int);

    for (let t = 0; t < params.unitData.checkedAminities.length; t++) {

        checkAminity.rows.add(params.unitData.checkedAminities[t]);
        params.UnitLOV = checkAminity;
    }


    console.log("params.UnitLOV=>", params);
    requestParams.input('UnitId', mssql.Int, params.unitData.UnitId);
    requestParams.input('PropertyId', mssql.Int, params.unitData.PropertyId);
    requestParams.input('UnitName', mssql.NVarChar, params.unitData.UnitName);
    requestParams.input('NickName', mssql.NVarChar, params.unitData.NickName);
    requestParams.input('Description', mssql.NVarChar, params.unitData.Description);
    requestParams.input('unitLogo', mssql.NVarChar, params.unitData.unitLogo);
    requestParams.input('turnOverCleaningCharge', mssql.Int, params.unitData.turnOverCleaningCharge);
    requestParams.input('interimCleaningCharge', mssql.Int, params.unitData.interimCleaningCharge);
    requestParams.input('BedRooms', mssql.Int, params.unitData.BedRooms);
    requestParams.input('UnitTypeId', mssql.Int, params.unitData.UnitTypeId);
    requestParams.input('UnitRank', mssql.Int, params.unitData.UnitRank);
    requestParams.input('SortOrder', mssql.Int, params.unitData.SortOrder);
    requestParams.input('StatusId', mssql.Int, params.unitData.StatusId);
    requestParams.input('UnitNumber', mssql.NVarChar, params.unitData.UnitNumber);
    requestParams.input('MaxAdults', mssql.Int, params.unitData.MaxAdults);
    requestParams.input('MaxPersons', mssql.Int, params.unitData.MaxPersons);
    requestParams.input('Updatedby', mssql.Int, params.systemParams.UserId);
    requestParams.input('WeekdayRate', mssql.Int, params.unitData.AmountInWeekday);
    requestParams.input('MaxPersons_Weekday', mssql.Int, params.unitData.NoOfPersonsInWeekday);
    requestParams.input('AdditionalAdult_WeekdayRate', mssql.Int, params.unitData.AdditionalNoOfAdultsInWeekday);
    requestParams.input('AdditionalChild_WeekdayRate', mssql.Int, params.unitData.AdditionalNoOfChildrenInWeekday);
    requestParams.input('WeekendRate', mssql.Int, params.unitData.AmountInWeekend);
    requestParams.input('MaxPersons_Weekend', mssql.Int, params.unitData.NoOfPersonsInWeekend);
    requestParams.input('AdditionalAdult_WeekendRate', mssql.Int, params.unitData.AdditionalNoOfAdultsInWeekend);
    requestParams.input('AdditionalChild_WeekendRate', mssql.Int, params.unitData.AdditionalNoOfChildrenInWeekend);
    requestParams.input('FunctionId', mssql.NVarChar, params.FunctionId);
    requestParams.input('UnitLOV', params.UnitLOV);
    requestParams.input('IsSync', mssql.Bit, params.unitData.IsSync);
    console.log("PropertyId Aminities=>", params.unitData.PropertyId);



    return requestParams;
};


let getPropertyMetaDataParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
    requestParams.input('PropertyId', mssql.Int, params.PropertyId);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    return requestParams;
};

let getUnitListParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    requestParams.input('PropertyId', mssql.Int, params.PropertyId);
    requestParams.input('StatusId', mssql.Int, params.StatusId);
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('SearchText', mssql.NVarChar, params.SearchText);
    requestParams.input('SortBy', mssql.NVarChar, params.filterObj ? params.filterObj.SortBy : null);
    requestParams.input('SortOrder', mssql.NVarChar, params.filterObj ? params.filterObj.SortOrder : null);


    return requestParams;
};

let getNewReservationDetailParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    // requestParams.input('ClientId', mssql.Int, params.systemParams.ClientId),
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId),
        requestParams.input('UserId', mssql.Int, params.systemParams.UserId),
        requestParams.input('PropertyId', mssql.Int, params.systemParams.PropertyId);

    return requestParams;
};


let get_PaymentCardDetailsParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    // requestParams.input('ClientId', mssql.Int, params.systemParams.ClientId),
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId ? params.systemParams.SelectedClientId : params.systemParams.ClientId),
        requestParams.input('ReservationId', mssql.Int, params.ReservationId)

    return requestParams;
};

let SaveFolioLedgerTransDetailsParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    requestParams.input('ReservationId', mssql.Int, params.ReservationId);
    requestParams.input('LedgerAccountId', mssql.Int, params.LedgerAccountId);
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId),
        requestParams.input('UserId', mssql.Int, params.systemParams.UserId),
        requestParams.input('UnitId', mssql.Int, params.UnitId);
    requestParams.input('IsMaster', mssql.Bit, params.IsMaster);
    requestParams.input('FolioId', mssql.Int, params.FolioId);
    requestParams.input('Amount', mssql.Decimal, params.Amount);


    return requestParams;
};

let createReservationParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    requestParams.input('GuestProfileId', mssql.Int, params.GuestProfileId),
        requestParams.input('PropertyId', mssql.Int, params.PropertyId),
        // requestParams.input('ClientId', mssql.Int, params.systemParams.ClientId),
        requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId),
        requestParams.input('AddressTypeId', mssql.Int, params.AddressTypeId),
        requestParams.input('GuestFirstName', mssql.NVarChar, params.GuestFirstName),
        requestParams.input('GuestLastName', mssql.NVarChar, params.GuestLastName),
        requestParams.input('PhoneCountryCode', mssql.NVarChar, params.PhoneCountryCode),
        requestParams.input('PhoneAreaCode', mssql.NVarChar, params.PhoneAreaCode),
        requestParams.input('PhoneNumber', mssql.NVarChar, params.PhoneNumber),
        requestParams.input('PhoneExtension', mssql.NVarChar, params.PhoneExtension),
        requestParams.input('FaxCountryCode', mssql.NVarChar, params.FaxCountryCode),
        requestParams.input('FaxAreaCode', mssql.NVarChar, params.FaxAreaCode),
        requestParams.input('FaxNumber', mssql.NVarChar, params.FaxNumber),
        requestParams.input('FaxExtension', mssql.NVarChar, params.FaxExtension),
        requestParams.input('Email', mssql.NVarChar, params.Email),
        requestParams.input('Address1', mssql.NVarChar, params.Address1),
        requestParams.input('Address2', mssql.NVarChar, params.Address2),
        requestParams.input('Address3', mssql.NVarChar, params.Address3),
        // requestParams.input('City', mssql.NVarChar, params.City),
        requestParams.input('CityId', mssql.NVarChar, params.CityId),
        requestParams.input('StateId', mssql.NVarChar, params.StateId),
        // requestParams.input('TerritoryId', mssql.Int, params.TerritoryId),
        requestParams.input('PostalCode', mssql.NVarChar, params.PostalCode),
        requestParams.input('CountryId', mssql.Int, params.CountryId),
        requestParams.input('StatusId', mssql.Int, params.StatusId),
        requestParams.input('NumberOfAdults', mssql.Int, params.NumberOfAdults),
        requestParams.input('NumberOfChildren', mssql.Int, params.NumberOfChildren),
        requestParams.input('UpdatedBy', mssql.Int, params.systemParams.UserId);
    requestParams.input('PartyAddressId', mssql.Int, params.PartyAddressId);
    requestParams.input('ReservationId', mssql.Int, params.ReservationId);
    requestParams.input('StatusIdOfUE', mssql.Int, params.StatusIdOfUE);
    requestParams.input('UnitId', mssql.Int, params.UnitId);
    requestParams.input('UixId', mssql.Int, params.UixId);
    requestParams.input('SourceId', mssql.Int, params.SourceId);
    // requestParams.input('DateEffective', mssql.DateTime2, params.DateEffective);
    requestParams.input('StartDate', mssql.DateTime2, params.StartDate);
    requestParams.input('EndDate', mssql.DateTime2, params.EndDate);
    requestParams.input('ClientPrice', mssql.Decimal, params.ClientPrice);
    requestParams.input('FunctionId', mssql.NVarChar, params.FunctionId);


    requestParams.input('Ext_ReservationId', mssql.VarChar, params.Ext_ReservationId);

    return requestParams;
};

let getReservationDetailByIdParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    requestParams.input('ReservationId', mssql.Int, params.ReservationId);
    // requestParams.input('GuestProfileId', mssql.Int, params.GuestProfileId);
    // requestParams.input("StatusId", mssql.Int, params.StatusId);
    // requestParams.input('PropertyId', mssql.Int, params.PropertyId);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId ? params.systemParams.SelectedClientId : params.systemParams.ClientId);
     requestParams.input('BE_Id', mssql.Int, params.BE_Id);

    // requestParams.input('FunctionId', mssql.NVarChar, params.FunctionId);

    return requestParams;
};




let getAvailableRoomsParams = function (params, sqlRequest) {
    console.log("params", params);

    const requestParams = dbwrapper.getNewRequest();


    let checkAmenity = new mssql.Table();

    checkAmenity.columns.add('ListId', mssql.Int);

    for (let t = 0; t < params.FilteredAmenities.length; t++) {

        checkAmenity.rows.add(params.FilteredAmenities[t]);
        // params.UnitLOV = checkAmenity;
    }
    // let requestParams = new sqlRequest.Request();
    requestParams.input('Adults', mssql.Int, params.Adults);
    requestParams.input('Persons', mssql.Int, params.Persons);
    requestParams.input('NoOfChildren', mssql.Int, params.NoOfChildren);
    
    // requestParams.input('UnitId', mssql.Int, params.UnitId);
    requestParams.input('StartDate', mssql.NVarChar, params.StartDate);
    requestParams.input('EndDate', mssql.NVarChar, params.EndDate);
    requestParams.input('PropertyID', mssql.NVarChar, params.PropertyID);
    requestParams.input('UnitTypeId', mssql.NVarChar, params.UnitTypeId);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('reservationId', mssql.Int, params.reservationId);
    
    // requestParams.input('showactualinventory', mssql.Int, params.showactualinventory);
    // requestParams.input('ClientId', mssql.Int, params.systemParams.ClientId)
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
    requestParams.input('UnitLOV', checkAmenity);

    return requestParams;
};

let getCityStateCountryByIdParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    requestParams.input('CityId', mssql.Int, params.CityId);
    console.log("CityId=>", params.CityId);

    return requestParams;
};

let getCitySearchParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    requestParams.input('SearchLocation', mssql.NVarChar, params.SearchLocation);
    requestParams.input('SearchId', mssql.Int, params.SearchId);

    return requestParams;
};

let updateReservationStatusParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    // requestParams.input('FunctionId', mssql.NVarChar, params.FunctionId);
    requestParams.input('ReservationId', mssql.Int, params.ReservationId);
    // requestParams.input('Ext_ReservationId', mssql.Int, params.Ext_ReservationId);
    requestParams.input('StatusId', mssql.INT, params.StatusId);
    requestParams.input('UserId', mssql.Int, params.systemParams.UserId);
    requestParams.input('IsFromRU', mssql.Int, params.IsFromRU);
    requestParams.input('userdate', mssql.DateTime2, params.userdate);

    return requestParams;
};


let Get_Folio_Summary_DetailsParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId);
    requestParams.input('ReservationId', mssql.Int, params.ReservationId);

    return requestParams;
};


let Get_FolioSummaryParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    requestParams.input('ClientId', mssql.Int, params.systemParams.SelectedClientId ? params.systemParams.SelectedClientId : params.systemParams.ClientId);
    requestParams.input('ReservationId', mssql.Int, params.ReservationId);

    return requestParams;
};

let saveGuestProfileParams = function (params, sqlRequest) {
    let requestParams = new sqlRequest.Request();
    requestParams.input('GuestProfileId', mssql.Int, params.GuestProfileId);
    requestParams.input('PropertyId', mssql.Int, params.systemParams.PropertyId);
    requestParams.input('ClientId', mssql.Int, params.systemParams.ClientId);
    requestParams.input('AddressTypeId', mssql.Int, params.AddressTypeId);
    requestParams.input('GuestFirstName', mssql.NVarChar, params.GuestFirstName);
    requestParams.input('GuestLastName', mssql.NVarChar, params.GuestLastName);
    requestParams.input('PhoneCountryCode', mssql.NVarChar, params.PhoneCountryCode);
    requestParams.input('PhoneAreaCode', mssql.NVarChar, params.PhoneAreaCode);
    requestParams.input('PhoneNumber', mssql.NVarChar, params.PhoneNumber);
    requestParams.input('PhoneExtension', mssql.NVarChar, params.PhoneExtension);
    requestParams.input('FaxCountryCode', mssql.NVarChar, params.FaxCountryCode);
    requestParams.input('FaxAreaCode', mssql.NVarChar, params.FaxAreaCode);
    requestParams.input('FaxNumber', mssql.NVarChar, params.FaxNumber);
    requestParams.input('FaxExtension', mssql.NVarChar, params.FaxExtension);
    requestParams.input('Email', mssql.NVarChar, params.Email);
    requestParams.input('Address1', mssql.NVarChar, params.Address1);
    requestParams.input('Address2', mssql.NVarChar, params.Address2);
    requestParams.input('Address3', mssql.NVarChar, params.Address3);
    requestParams.input('CityId', mssql.INT, params.CityId);
    requestParams.input('PostalCode', mssql.NVarChar, params.PostalCode);
    requestParams.input('CountryId', mssql.Int, params.CountryId);
    requestParams.input('StateId', mssql.Int, params.StateId);
    requestParams.input('UpdatedBy', mssql.Int, params.systemParams.UserId);
    requestParams.input('PartyAddressId', mssql.Int, params.PartyAddressId);

    return requestParams;
}

module.exports = (_dbwrapper) => {
    dbwrapper = _dbwrapper;
    return {
        validateUserParams: function (params, sqlRequest) {
            //var requestParams = new mssql.Request();
            const requestParams = dbwrapper.getNewRequest();
            requestParams.input('LoginID', mssql.NVarChar, params.UserName);
            requestParams.input('UserPassword', mssql.NVarChar, md5(params.Password));
            requestParams.input('ClientCode', mssql.NVarChar, params.ClientCode);
            requestParams.input('FunctionId', mssql.NVarChar, params.FunctionId);


            return requestParams;
        },
        getUserProfileParams: getUserProfileParams,
        getUpdatePasswordParams: getUpdatePasswordParams,
        getClientDetailsParams: getClientDetailsParams,
        getUpdateUserProfileParams: getUpdateUserProfileParams,
        SaveOwnerIdParams: SaveOwnerIdParams,
        sqlConnectionCall: function (params, spName, successCallback, errorCallback) {

            let requestParams;
            if (params.ModuleAction === "UserProfile") {
                requestParams = getUserProfileParams(params, mssql);
            }
            else if (params.ModuleAction === "UpdatePassword") {
                requestParams = getUpdatePasswordParams(params, mssql);
            }
        
            else if (params.ModuleAction === "ResetPassword") {
                requestParams = getResetPasswordParams(params, mssql);
            }
            else if (params.ModuleAction === "UpdateLogginPassword") {
                requestParams = getUpdateLogginPasswordParams(params, mssql);
            }
        
            else if (params.ModuleAction === "GetClientProfile") {
                requestParams = getClientDetailsParams(params, mssql);
            }
            else if (params.ModuleAction === "UpdateUserProfile") {
                requestParams = getUpdateUserProfileParams(params, mssql);
            }
        
            else if (params.ModuleAction === "DeletePropertyDetailById") {
                requestParams = deletePropertyDetailByIdParams(params, mssql);
            }
            else if (params.ModuleAction === "GetUserList") {
                requestParams = getUserListParams(params, mssql);
            }
            else if (params.ModuleAction === "GetUserDetails") {
                requestParams = getUserDetailParams(params, mssql);
            }
            else if (params.ModuleAction === "SaveUserDetail") {
                requestParams = getSaveUserDetailParams(params, mssql);
            }
            else if (params.ModuleAction === "GetUnitDetailById") {
        
                requestParams = getUnitDetailByIdParams(params, mssql);
            }
            else if (params.ModuleAction === "AddUnitDetail") {
        
                requestParams = getAddUnitDetailParams(params, mssql);
            }
            else if (params.ModuleAction === "GetPropertyMetaData") {
        
                requestParams = getPropertyMetaDataParams(params, mssql);
            }
            else if (params.ModuleAction === "GetUnitList") {
                requestParams = getUnitListParams(params, mssql);
            }
            else if (params.ModuleAction === "AddClientDetails") {
                requestParams = getaddclientdetailsParams(params, mssql);
            }
        
            else if (params.ModuleAction === "GetNewReservationDetail") {
                requestParams = getNewReservationDetailParams(params, mssql);
            }
            else if (params.ModuleAction === "SaveReservationDetail") {
                requestParams = createReservationParams(params, mssql);
            }
            else if (params.ModuleAction === "GetReservationDetailById") {
                requestParams = getReservationDetailByIdParams(params, mssql);
            }
            else if (params.ModuleAction === "GetCityStateCountryById") {
                requestParams = getCityStateCountryByIdParams(params, mssql);
            }
            else if (params.ModuleAction === "UpdateReservationStatus") {
                requestParams = updateReservationStatusParams(params, mssql);
            }
        
            else if (params.ModuleAction === "Get_Folio_Summary_Details") {
                requestParams = Get_Folio_Summary_DetailsParams(params, mssql);
            }
        
            else if (params.ModuleAction === "Get_FolioSummary") {
                requestParams = Get_FolioSummaryParams(params, mssql);
            }
        
            else if (params.ModuleAction === "GetAvailableRooms") {
                requestParams = getAvailableRoomsParams(params, mssql);
            }
        
            else if (params.ModuleAction === "SaveFolioLedgerTransDetails") {
                requestParams = SaveFolioLedgerTransDetailsParams(params, mssql);
            }
            else if (params.ModuleAction === "SaveClientDaysSelection") {
                requestParams = SaveClientDaysSelectionParams(params, mssql);
            }
            else if (params.ModuleAction === "GetCitySearch") {
                requestParams = getCitySearchParams(params, mssql);
            }
        
            else if (params.ModuleAction === "Get_NotesDetails") {
                requestParams = get_NotesDetailsParams(params, mssql);
            }
        
            else if (params.ModuleAction === "Get_PaymentCardDetails") {
                requestParams = get_PaymentCardDetailsParams(params, mssql);
            }
        
            else if (params.ModuleAction === "SaveGuestProfile") {
                requestParams = saveGuestProfileParams(params, mssql);
            }
        
            else if (params.ModuleAction === "Get_PaymentDetails") {
                requestParams = getPaymentDetailsParams(params, mssql);
            }
            else if (params.ModuleAction === "GetUserDetailById") {
                requestParams = GetUserDetailByIdParams(params, mssql);
            }
            // else if(params.ModuleAction === "Insert_UnitAmenities"){
            //     requestParams = Insert_UnitAmenitiesParams(params, mssql);
            // }
            else {
                requestParams = validateUserParams(params, mssql, dbwrapper);
            }
        
            requestParams.execute(spName, (err, result) => {
                if (err) {
                    if (errorCallback)
                        errorCallback(err);
                    else
                        console.log(err);
                }
                else
                    successCallback(result);
        
            });
        },
        deletePropertyDetailByIdParams: deletePropertyDetailByIdParams,
        getUnitDetailByIdParams: getUnitDetailByIdParams,
        getAddUnitDetailParams: getAddUnitDetailParams,
        getPropertyMetaDataParams: getPropertyMetaDataParams,
        getUnitListParams: getUnitListParams,
        getNewReservationDetailParams: getNewReservationDetailParams,
        createReservationParams: createReservationParams,
        getReservationDetailByIdParams: getReservationDetailByIdParams,
        getAvailableRoomsParams: getAvailableRoomsParams,
        getCityStateCountryByIdParams: getCityStateCountryByIdParams,
        SaveClientDaysSelectionParams: SaveClientDaysSelectionParams,

        updateReservationStatusParams: updateReservationStatusParams,
        saveGuestProfileParams: saveGuestProfileParams,
        SaveFolioLedgerTransDetailsParams: SaveFolioLedgerTransDetailsParams,
        getUpdateUserProfileParams: getUpdateUserProfileParams,
        get_PaymentCardDetailsParams: get_PaymentCardDetailsParams,
        Get_FolioSummaryParams: Get_FolioSummaryParams,
        getPaymentDetailsParams: getPaymentDetailsParams,
    }
};
