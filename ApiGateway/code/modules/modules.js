const createUser = require('./user/saveUser');
const getUserList = require('./user/getUserList');
const GetUserProfile = require('./user/getUserProfile');
const saveUserProfile = require('./user/saveUserProfile');
const getUserDetail = require('./user/getUserDetail');
const updatePassword = require('./user/updateUserPassword');
const searchUsers = require('./user/searchUsers');
const userLogout = require('./user/userLogout');
const getUserEntitlementsAndDefaultProperty = require("./user/getUserEntitlementsAndDefaultProperty");
const updateLogginPassword = require('./user/updateLogginPassword');

const resetPassword = require('./user/resetUserPassword');

const saveUserGroupDetail = require("./userGroup/saveUserGroupDetail");
const getUserGroupList = require("./userGroup/getUserGroupInstanceList");
const getUserGroupDetail = require("./userGroup/getUserGroupDetail");
const saveUserToUserGroupAllocation = require("./userGroup/saveUserToUserGroupAllocation");
const saveUserGroupToMenuAllocation = require("./userGroup/saveUserGroupToMenuAllocation");
const deleteUserGroupDetail = require("./userGroup/deleteUserGroupDetail");

const getNotificationList = require("./notifications/getNotificationsListByUser");
const dismissNotification = require("./notifications/dismissNotification");
const getNotificationDetail = require("./notifications/getNotificationDetail");
/*const addPropertyDetail = require("./property/addPropertyDetail"); */
const addPropertyInfo = require("./property/addPropertyInfo");
const addpropertyMDetails = require("./property/addPropertyDetails");
const addPropertyPolicyDetails = require("./property/addPropertyPolicyDetails");
const addPropertyBillingDetails = require("./property/addPropertyBillingDetail");

const saveClientListOfValues = require("./property/SaveClientListOfValues");

const addPropertyContentDetails = require("./property/addPropertyDetails");


const addclientdetails = require("./clientDetails/addClientDetails");
const getclientlistdetails = require("./clientDetails/getClientListDetails");
const addPropertyDetail = require("./property/addPropertyDetail");
const getPropertyList = require("./property/getPropertyList");
const getPropertyDetailById = require("./property/getPropertyDetailById");
const deletePropertyDetailById = require("./property/deletePropertyDetailById");
const getUnitDetailById = require("./unit/getUnitDetailById");
const addUnitDetail = require("./unit/addUnitDetail");
const getPropertyMetaData = require("./unit/propertyMetaData");
const getUnitList = require('./unit/getUnitList');
const syncUnitToRU = require('./unit/syncUnitToRU');
const GetPropertyTypeList = require("./property/GetPropertyTypeList");

const getRoleDetail = require('./role/getRoleDetails');
const saveRoleDetails = require('./role/saveRoleDetails');
const getRoleList = require('./role/getRoleList');

const saveRoleEntityPermissions = require('./role/saveRoleEntityPermission');

const getClientDetailById = require("./clientDetails/getClientDetailById");
const getClientList = require("./clientDetails/getClientListDetails");
const saveClientDetails = require("./client/saveClientDetails");
const SaveClientDaysSelection = require("./client/SaveClientDaysSelection");
const UpdateTokenWithClientId = require("./client/updateTokenWithClientId");
const GetClientList_Cpanel = require("./clientDetails/GetClientList_Cpanel");
const GetPropertyList_CPanel = require("./property/GetPropertyList_CPanel");

const GetNewReservationDetail = require("./reservations/getNewReservationDetail");
const SaveReservationDetail = require("./reservations/createReservation");
const GetReservationsList = require("./reservations/getReservationslist");
const GetReservationDetailById = require("./reservations/getReservationDetailById");
const GetCityStateCountryById = require("./reservations/getCityStateCountryById");
const GetAvailableRooms = require("./reservations/getAvailableRooms");
const GetCitySearch = require("./reservations/getCitySearch");
const UpdateReservationStatus = require("./reservations/updateReservationStatus");
const Get_Folio_Summary_Details = require("./reservations/Get_Folio_Summary_Details");
const SaveFolioLedgerTransDetails = require("./reservations/SaveFolioLedgerTransDetails");
const Get_NotesDetails = require("./reservations/Get_NotesDetails");
const Get_PaymentCardDetails = require("./reservations/Get_PaymentCardDetails");
const Get_FolioSummary = require("./reservations/Get_FolioSummary");
const Get_PaymentDetails = require("./reservations/Get_PaymentDetails");
const saveReservation_GuestInfo = require("./reservations/saveReservation_GuestInfo");
const SaveReservation_AssignRooms = require("./reservations/SaveReservation_AssignRooms");
const SaveNotesDetails = require("./reservations/SaveNotesDetails");
const get_ReservationDetails_Summary = require("./reservations/get_ReservationDetails_Summary");
const save_folioItem = require("./reservations/save_folioItem");
const GetFolioLedgerTransDetails = require("./reservations/GetFolioLedgerTransDetails");
const update_Notes_status = require("./reservations/update_Notes_status");
const GetFolioLedgerTransDetails_Invoice = require("./reservations/GetFolioLedgerTransDetails_Invoice");
const GetCountryByStateId = require("./reservations/GetCountryByStateId");
const updateReservation_checkincheckoutTimes = require("./reservations/updateReservation_checkincheckoutTimes");
const resetCheckInCheckOutTime = require("./reservations/resetCheckInCheckOutTime");
const GetReservations_ExportToExcel = require("./reservations/GetReservations_ExportToExcel");
const GetSubSourceList = require("./reservations/GetSubSourceList");
const Save_SourceDetails = require("./reservations/Save_SourceDetails");
const SaveTaxExemptForReservation = require("./reservations/SaveTaxExemptForReservation");
const GetReservations_ById = require("./reservations/GetReservations_ById");

const SaveGuestProfile = require("./guestProfile/saveGuestProfile");

const getlistManagementList = require("./listManagement/getlistManagementList");

const getSystemList = require("./listManagement/getSystemList");
const saveCustomList = require("./listManagement/saveCustomList");
const GetLedgerAccountTypes = require("./listManagement/GetLedgerAccountTypes");
const SaveLedgerAccounts = require("./listManagement/SaveLedgerAccounts");
const GetTaxItemList = require("./tax/getTaxItemList");
const GetTaxDetailById = require("./tax/getTaxDetailById");
const saveTaxItemsDetails = require("./tax/saveTaxItemsDetails");
const getTaxLedgerAccounts = require("./tax/getTaxLedgerAccounts");
const saveTaxLedgerAccounts = require("./tax/saveTaxLedgerAccounts");


const saveRateOverrideDetails = require("./rates/saveRateOverrideDetails");
const Get_RateOverride_List = require("./rates/Get_RateOverride_List");
const GetRateDetailById = require("./rates/GetRateDetailById");
const Save_RateOverride_Details_new = require("./rates/Save_RateOverride_Details_new");
const getClientTagsBySearchText = require("./client/getClientTagsBySearchText");
const saveEntityTag = require("./tags/saveEntityTags");
const deleteTagFromEntity = require("./tags/deleteTagFromEntity");
const deleteImages = require("./images/deleteImages");
const getImages = require("./images/getImages");
const getEntityTags = require("./tags/getEntityTags");

const saveCustomView = require("./customViews/saveCustomView");
const getEntityCustomViewList = require("./customViews/getEntityCustomViewList");
const getEntityViewTags = require("./customViews/getEntityViewTags");

const getRestrictionDetail = require("./restrictions/getRestrictionDetail");
const getRestrictionList = require("./restrictions/getRestrictionsList");
const saveRestrictionDetail = require("./restrictions/saveRestrictionDetail");
const SaveRestrictionDetail_New = require("./restrictions/SaveRestrictionDetail_New");
const Get_InvRatesRestrictions = require("./restrictions/Get_InvRatesRestrictions");

const getSourceListBySearchText = require("./sources/getSourceListBySearchText");
const getPropertiesBySearchText = require("./property/getPropertiesBySearchText");
const getUnitTypesListBySearchText = require("./unit/getUnitTypesListBySearchText");
const getUnitListBySearchText = require("./unit/getUnitListBySearchText");
const getResevationStatusListBySearchText = require("./reservations/getStatusListBySearchText");

const getHouseKeepinglist = require("./houseKeeping/getHouseKeepingList");
const getHouseKeepingListForApp = require("./houseKeeping/getHouseKeepingListForApp");
const getHousekeeperList = require("./houseKeeping/getHousekeeperList");
const assignHousekeepers = require("./houseKeeping/assignHousekeepers");
const updateTaskStatus = require("./houseKeeping/updateTaskStatus");
const Get_NotesDetails_forTasklist = require("./houseKeeping/Get_NotesDetails_forTasklist");
const get_Tasksdetail_mobile = require("./houseKeeping/get_Tasksdetail_mobile");
const UpdateUnitStatus_ByJob = require("./houseKeeping/UpdateUnitStatus_ByJob");
const Update_OccupiedUnits = require("./houseKeeping/Update_OccupiedUnits");

const Save_InventoryDetails = require("./roomInventory/Save_InventoryDetails.js");
const GetCloseOuts = require("./roomInventory/GetCloseOuts.js");
const Get_CloseOutDetail = require("./roomInventory/Get_CloseOutDetail.js");
const Save_InventoryDetails_new = require("./roomInventory/Save_InventoryDetails_new.js");

const getTapeChartData = require("./tapeChart/getTapeChartData");
const getTapeChartData_New = require("./tapeChart/getTapeChartData_new");
const saveAWS_Image = require("./property/uploadImageDb");
const savePaymentDetails = require("./payments/savePaymentDetails");
const getUnitAndUnassignedUnitList = require("./unit/getUnitAndUnassignedUnitList");
const voidFolioItem = require("./folio/voidFolioItem");

const updateUnitToUnAssigned = require("./reservations/updateUnitToUnassigned");

const getReservationcount = require("./reservations/getReservationcount");
const GetReservationList_withinDateRange = require("./reservations/GetReservationList_withinDateRange");

const getReservations_withstatus = require("./reservations/getReservations_withstatus");
const getTapeChartUnassignedReservations = require("./tapeChart/getTapeChartUnassignedReservations");

const GetAvailability_BE = require("./bookingEngine/availabilitySearch");
const GetFiltersData_BE = require("./bookingEngine/GetFiltersData_BE");
const GetPropertyAndUnitList_BE = require("./bookingEngine/getPropertyAndUnitListForBE");
const Save_BEDomainSettings = require("./bookingEngine/Save_BEDomainSettings");
const Get_BookingEngine_Config = require("./bookingEngine/Get_BookingEngine_Config");
const getBE_List = require("./bookingEngine/getBE_List");
const sendQuote = require("./bookingEngine/sendQuote");
const thankyouMail = require("./bookingEngine/thankyouMail");
const GetReservationDetailsByURL = require("./bookingEngine/GetReservationDetailsByURL");
const generateHashKey = require("./bookingEngine/generateHashKey");
const Save_HashURL = require("./bookingEngine/Save_HashURL");
const Autenticate_user = require("./bookingEngine/Autenticate_user");
const Update_BEStatus = require("./bookingEngine/Update_BEStatus");

// const savePay
// const savePaymentDetails
const makeStripePayment = require("./payments/makeStripePayment");
const Save_Acc_Commission_Config = require("./payments/Save_Acc_Commission_Config");
const getCardToken = require("./payments/getCardToken");
const Get_PaymentAccount_Details = require("./payments/Get_PaymentAccount_Details");
const Update_Acc_Commission_Config = require("./payments/Update_Acc_Commission_Config");
const captureChargeOrRefund = require("./payments/captureChargeOrRefund");
const GetConnectedObjects_PaymentAccount = require("./payments/GetConnectedObjects_PaymentAccount");
const UpdateCardToken = require("./payments/UpdateCardToken");
const GetPaymentdetails_report = require("./payments/GetPaymentdetails_report");
const Get_SalesReport = require("./payments/Get_SalesReport");
const GetLedgeraccountlist = require("./payments/GetLedgeraccountlist");
const GetPaymentstatusList = require("./payments/GetPaymentstatusList");


// const googleAnalyticsReports = require("./googleAnalytics/googleAnalyticsReports");
const Save_ErrorLogs = require("./payments/Save_ErrorLogs");

module.exports = [
  { key: "CreateUser", callback: createUser, pushkey: null, isLoggingEnabled: false },
  { key: "GetUserList", callback: getUserList, pushkey: null },
  { key: "GetUserProfile", callback: GetUserProfile, pushkey: null },
  { key: "SaveUserProfile", callback: saveUserProfile, pushkey: null, isLoggingEnabled: false },
  { key: "GetUserDetail", callback: getUserDetail, pushkey: null },
  { key: "UpdatePassword", callback: updatePassword, pushkey: null },

  { key: "ResetPassword", callback: resetPassword, pushkey: null },

  { key: "SearchUsers", callback: searchUsers, pushkey: null },
  { key: "UserLogout", callback: userLogout, pushkey: null, isLoggingEnabled: false },
  { key: "GetUserEntitlementsAndDefaultProperty", callback: getUserEntitlementsAndDefaultProperty, pushkey: null },
  { key: "UpdateLogginPassword", callback: updateLogginPassword, pushkey: null, isLoggingEnabled: false },

  { key: "SaveUserGroupDetail", callback: saveUserGroupDetail, pushkey: null, isLoggingEnabled: false },
  { key: "GetUserGroupList", callback: getUserGroupList, pushkey: null },
  { key: "GetUserGroupDetail", callback: getUserGroupDetail, pushkey: null },
  { key: "SaveUserToUserGroupAllocation", callback: saveUserToUserGroupAllocation, pushkey: null, isLoggingEnabled: false },
  { key: "SaveUserGroupToMenuAllocation", callback: saveUserGroupToMenuAllocation, pushkey: null, isLoggingEnabled: false },
  { key: "DeleteUserGroupDetail", callback: deleteUserGroupDetail, pushkey: null, isLoggingEnabled: false },


  { key: "GetNotificationList", callback: getNotificationList, pushkey: null },
  { key: "DismissNotification", callback: dismissNotification, pushkey: null, isLoggingEnabled: false },
  { key: "GetNotificationDetail", callback: getNotificationDetail, pushkey: null },
  /* { key: "AddPropertyDetail", callback: addPropertyDetail, pushkey: null }, */
  { key: "AddClientDetails", callback: addclientdetails, pushkey: null },
  // {key: "GetClientListDetails", callback:getclientlistdetails,pushkey:null},
  { key: "AddPropertyDetail", callback: addPropertyDetail, pushkey: null },
  { key: "GetPropertyList", callback: getPropertyList, pushkey: null },
  { key: "GetPropertyDetailById", callback: getPropertyDetailById, pushkey: null },
  { key: "DeletePropertyDetailById", callback: deletePropertyDetailById, pushkey: null },
  { key: "GetUnitDetailById", callback: getUnitDetailById, pushkey: null },
  { key: "AddUnitDetail", callback: addUnitDetail, pushkey: null },
  { key: "GetPropertyMetaData", callback: getPropertyMetaData, pushkey: null },
  { key: "SaveClientListOfValues", callback: saveClientListOfValues, pushkey: null },
  { key: "GetUnitList", callback: getUnitList, pushkey: null },
  { key: "SaveEntityTag", callback: saveEntityTag, pushkey: null },
  { key: "DeleteTagFromEntity", callback: deleteTagFromEntity, pushkey: null },
  { key: "DeleteImages", callback: deleteImages, pushkey: null },
  { key: "GetImages", callback: getImages, pushkey: null },
  { key: "GetPropertyTypeList", callback: GetPropertyTypeList, pushkey: null },
  { key: "UpdateCardToken", callback: UpdateCardToken, pushkey: null },



  


  // { key: "GetRoleDetail", callback: getRoleDetails, pushkey: null },
  // { key: "SaveRoleDetail", callback: saveRoleDetails, pushkey: null },
  // { key: "SaveRoleEntityPermissions", callback: saveRoleEntityPermissions, pushkey: null },
  // { key: "GetRoleList", callback: getRoleList, pushkey: null },

  // { key: "AddPropertyInfo", callback: addPropertyInfo, pushkey: null },
  // { key: "AddPropertyMDetails", callback: addpropertyMDetails, pushkey: null },
  // { key: "AddPropertyMailingDetails", callback: addPropertyMailingDetails, pushkey: null },
  // { key: "AddPropertyBillingDetails", callback: addPropertyBillingDetails, pushkey: null },


  { key: "GetRoleDetail", callback: getRoleDetail, pushkey: null },
  { key: "SaveRoleDetail", callback: saveRoleDetails, pushkey: null },
  { key: "GetRoleList", callback: getRoleList, pushkey: null },
  { key: "AddPropertyInfo", callback: addPropertyInfo, pushkey: null },
  { key: "AddPropertyMDetails", callback: addpropertyMDetails, pushkey: null },
  { key: "AddPropertyPolicyDetails", callback: addPropertyPolicyDetails, pushkey: null },
  { key: "AddPropertyBillingDetails", callback: addPropertyBillingDetails, pushkey: null },

  { key: "AddPropertyContentDetails", callback: addPropertyContentDetails, pushkey: null },

  { key: "GetPropertyList_CPanel", callback: GetPropertyList_CPanel, pushkey: null },

  { key: "GetClientDetailById", callback: getClientDetailById, pushkey: null },
  // { key: "Getclientlistdetails", callback: getclientlistdetails, pushkey: null },
  { key: "GetClientList", callback: getClientList, pushkey: null },
  { key: "SaveClientDetails", callback: saveClientDetails, pushkey: null },
  { key: "GetClientList_Cpanel", callback: GetClientList_Cpanel, pushkey: null },

  { key: "SaveClientDaysSelection", callback: SaveClientDaysSelection, pushkey: null },
  { key: "UpdateTokenWithClientId", callback: UpdateTokenWithClientId, pushkey: null },

  // { key: "AddClientMailingInformation", callback: addClientMailingInformation, pushkey: null },
  // { key: "AddClientBillingInformation", callback: addClientBillingInformation, pushkey: null },

  { key: "GetNewReservationDetail", callback: GetNewReservationDetail, pushkey: null },
  { key: "SaveReservationDetail", callback: SaveReservationDetail, pushkey: null },
  { key: "GetReservationsList", callback: GetReservationsList, pushkey: null },
  { key: "GetReservationDetailById", callback: GetReservationDetailById, pushkey: null },
  { key: "GetCityStateCountryById", callback: GetCityStateCountryById, pushkey: null },
  { key: "GetAvailableRooms", callback: GetAvailableRooms, pushkey: null },
  { key: "GetCitySearch", callback: GetCitySearch, pushkey: null },
  { key: "UpdateReservationStatus", callback: UpdateReservationStatus, pushkey: null },
  { key: "Get_Folio_Summary_Details", callback: Get_Folio_Summary_Details, pushkey: null },
  { key: "SaveFolioLedgerTransDetails", callback: SaveFolioLedgerTransDetails, pushkey: null },
  { key: "Get_NotesDetails", callback: Get_NotesDetails, pushkey: null },
  { key: "Get_PaymentCardDetails", callback: Get_PaymentCardDetails, pushkey: null },
  { key: "Get_FolioSummary", callback: Get_FolioSummary, pushkey: null },
  { key: "Get_PaymentDetails", callback: Get_PaymentDetails, pushkey: null },
  { key: "saveReservation_GuestInfo", callback: saveReservation_GuestInfo, pushkey: null },
  { key: "SaveReservation_AssignRooms", callback: SaveReservation_AssignRooms, pushkey: null },
  { key: "updateReservation_checkincheckoutTimes", callback: updateReservation_checkincheckoutTimes, pushkey: null },
  { key: "resetCheckInCheckOutTime", callback: resetCheckInCheckOutTime, pushkey: null },
  { key: "GetReservations_ExportToExcel", callback: GetReservations_ExportToExcel, pushkey: null },
  { key: "GetSubSourceList", callback: GetSubSourceList, pushkey: null },
  { key: "Save_SourceDetails", callback: Save_SourceDetails, pushkey: null },
  { key: "SaveTaxExemptForReservation", callback: SaveTaxExemptForReservation, pushkey: null },
  { key: "GetReservations_ById", callback: GetReservations_ById, pushkey: null },

  { key: "SaveNotesDetails", callback: SaveNotesDetails, pushkey: null },
  { key: "get_ReservationDetails_Summary", callback: get_ReservationDetails_Summary, pushkey: null },
  { key: "save_folioItem", callback: save_folioItem, pushkey: null },
  { key: "GetFolioLedgerTransDetails", callback: GetFolioLedgerTransDetails, pushkey: null },
  { key: "update_Notes_status", callback: update_Notes_status, pushkey: null },
  { key: "GetFolioLedgerTransDetails_Invoice", callback: GetFolioLedgerTransDetails_Invoice, pushkey: null },
  { key: "GetCountryByStateId", callback: GetCountryByStateId, pushkey: null },


  { key: "SaveGuestProfile", callback: SaveGuestProfile, pushkey: null },
  { key: "GetlistManagementList", callback: getlistManagementList, pushkey: null },

  { key: "GetSystemList", callback: getSystemList, pushkey: null },
  { key: "SaveCustomList", callback: saveCustomList, pushkey: null },
  { key: "GetLedgerAccountTypes", callback: GetLedgerAccountTypes, pushkey: null },
  { key: "SaveLedgerAccounts", callback: SaveLedgerAccounts, pushkey: null },
  { key: "GetTaxItemList", callback: GetTaxItemList, pushkey: null },
  { key: "GetTaxDetailById", callback: GetTaxDetailById, pushkey: null },
  { key: "saveTaxItemsDetails", callback: saveTaxItemsDetails, pushkey: null },
  { key: "getTaxLedgerAccounts", callback: getTaxLedgerAccounts, pushkey: null },
  { key: "saveTaxLedgerAccounts", callback: saveTaxLedgerAccounts, pushkey: null },

  { key: "SaveRateOverrideDetails", callback: saveRateOverrideDetails, pushkey: null },
  { key: "Get_RateOverride_List", callback: Get_RateOverride_List, pushkey: null },
  { key: "GetRateDetailById", callback: GetRateDetailById, pushkey: null },
  { key: "GetClientTagsBySearchText", callback: getClientTagsBySearchText, pushkey: null },
  { key: "GetEntityTags", callback: getEntityTags, pushkey: null },
  { key: "Save_RateOverride_Details_new", callback: Save_RateOverride_Details_new, pushkey: null },

  { key: "SaveCustomView", callback: saveCustomView, pushkey: null },
  { key: "GetEntityCustomViewList", callback: getEntityCustomViewList, pushkey: null },
  { key: "GetEntityViewTags", callback: getEntityViewTags, pushkey: null },

  { key: "GetRestrictionDetail", callback: getRestrictionDetail, pushkey: null },
  { key: "GetRestrictionList", callback: getRestrictionList, pushkey: null },
  { key: "SaveRestrictionDetail", callback: saveRestrictionDetail, pushkey: null },
  { key: "SaveRestrictionDetail_New", callback: SaveRestrictionDetail_New, pushkey: null },
  { key: "Get_InvRatesRestrictions", callback: Get_InvRatesRestrictions, pushkey: null },

  { key: "GetSourceListBySearchText", callback: getSourceListBySearchText, pushkey: null },
  { key: "GetPropertiesBySearchText", callback: getPropertiesBySearchText, pushkey: null },
  { key: "GetUnitTypesListBySearchText", callback: getUnitTypesListBySearchText, pushkey: null },
  { key: "GetUnitListBySearchText", callback: getUnitListBySearchText, pushkey: null },
  { key: "GetResevationStatusListBySearchText", callback: getResevationStatusListBySearchText, pushkey: null },

  { key: "Save_InventoryDetails", callback: Save_InventoryDetails, pushkey: null },
  { key: "GetCloseOuts", callback: GetCloseOuts, pushkey: null },
  { key: "Get_CloseOutDetail", callback: Get_CloseOutDetail, pushkey: null },
  { key: "Save_InventoryDetails_new", callback: Save_InventoryDetails_new, pushkey: null },

  { key: "getHouseKeepinglist", callback: getHouseKeepinglist, pushkey: null },
  { key: "getHouseKeepingListForApp", callback: getHouseKeepingListForApp, pushkey: null },
  { key: "getHousekeeperList", callback: getHousekeeperList, pushkey: null },
  { key: "assignHousekeepers", callback: assignHousekeepers, pushkey: null },
  { key: "updateTaskStatus", callback: updateTaskStatus, pushkey: null },
  { key: "Get_NotesDetails_forTasklist", callback: Get_NotesDetails_forTasklist, pushkey: null },
  { key: "get_Tasksdetail_mobile", callback: get_Tasksdetail_mobile, pushkey: null },
  { key: "UpdateUnitStatus_ByJob", callback: UpdateUnitStatus_ByJob, pushkey: null },
  { key: "Update_OccupiedUnits", callback: Update_OccupiedUnits, pushkey: null },

  { key: "GetTapeChartData", callback: getTapeChartData, pushkey: null },
  { key: "GetTapeChartData_New", callback: getTapeChartData_New, pushkey: null },

  { key: "saveAWS_Image", callback: saveAWS_Image, pushkey: null },

  { key: "syncUnitToRU", callback: syncUnitToRU, pushkey: null },
  { key: "SavePaymentDetails", callback: savePaymentDetails, pushkey: null },
  { key: "GetUnitAndUnassignedUnitList", callback: getUnitAndUnassignedUnitList, pushkey: null },
  { key: "VoidFolioItem", callback: voidFolioItem, pushkey: null },

  { key: "UpdateUnitToUnAssigned", callback: updateUnitToUnAssigned, pushkey: null },

  { key: "getReservationcount", callback: getReservationcount, pushkey: null },
  { key: "GetReservationList_withinDateRange", callback: GetReservationList_withinDateRange, pushkey: null },
  { key: "getReservations_withstatus", callback: getReservations_withstatus, pushkey: null },
  { key: "GetTapeChartUnassignedReservations", callback: getTapeChartUnassignedReservations, pushkey: null },



  { key: "GetAvailability_BE", callback: GetAvailability_BE, pushkey: null },
  { key: "GetFiltersData_BE", callback: GetFiltersData_BE, pushkey: null },
  { key: "GetPropertyAndUnitList_BE", callback: GetPropertyAndUnitList_BE, pushkey: null },
  { key: "Save_BEDomainSettings", callback: Save_BEDomainSettings, pushkey: null },
  { key: "Get_BookingEngine_Config", callback: Get_BookingEngine_Config, pushkey: null },
  { key: "getBE_List", callback: getBE_List, pushkey: null },
  { key: "sendQuote", callback: sendQuote, pushkey: null },
  { key: "thankyouMail", callback: thankyouMail, pushkey: null },
  { key: "GetReservationDetailsByURL", callback: GetReservationDetailsByURL, pushkey: null },
  { key: "generateHashKey", callback: generateHashKey, pushkey: null },
  { key: "Save_HashURL", callback: Save_HashURL, pushkey: null },
  { key: "Autenticate_user", callback: Autenticate_user, pushkey: null },

  { key: "makeStripePayment", callback: makeStripePayment, pushkey: null },
  { key: "Save_Acc_Commission_Config", callback: Save_Acc_Commission_Config, pushkey: null },
  { key: "getCardToken", callback: getCardToken, pushkey: null },
  { key: "Get_PaymentAccount_Details", callback: Get_PaymentAccount_Details, pushkey: null },
  { key: "Update_Acc_Commission_Config", callback: Update_Acc_Commission_Config, pushkey: null },
  { key: "captureChargeOrRefund", callback: captureChargeOrRefund, pushkey: null },
  { key: "GetConnectedObjects_PaymentAccount", callback: GetConnectedObjects_PaymentAccount, pushkey: null },
  { key: "UpdateCardToken", callback: UpdateCardToken, pushkey: null },
  { key: "GetPaymentdetails_report", callback: GetPaymentdetails_report, pushkey: null },
  { key: "Get_SalesReport", callback: Get_SalesReport, pushkey: null },
  { key: "GetLedgeraccountlist", callback: GetLedgeraccountlist, pushkey: null },
  { key: "GetPaymentstatusList", callback: GetPaymentstatusList, pushkey: null },

  // { key: "googleAnalyticsReports", callback: googleAnalyticsReports, pushkey: null }
  { key: "Save_ErrorLogs", callback: Save_ErrorLogs, pushkey: null},
  { key: "Update_BEStatus", callback: Update_BEStatus, pushkey: null},
];
