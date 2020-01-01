const createUser = require('./user/saveUser');
const getUserList = require('./user/getUserList');
const GetUserProfile = require('./user/getUserProfile');
const saveUserProfile = require('./user/saveUserProfile');
const getUserDetail = require('./user/getUserDetail');
const updatePassword = require('./user/updateUserPassword');
const searchUsers = require('./user/searchUsers');
const userLogout = require('./user/userLogout');
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


const deleteImages = require("./images/deleteImages");
const getImages = require("./images/getImages");
const getServiceList = require("./services/getServiceList"),
  getMyServiceProducts = require("./services/getMyServiceProducts"),
  getServiceDetail = require("./services/getServiceDetail"),
  saveVehicleDetails = require("./services/saveVehicleDetails"),
  getVechicleAddress = require("./services/getVehicleAddress"),
  requestVehicleService = require("./services/requestVehicleService"),
  getMySubscriptions = require("./services/getMySubscriptions"),
  getServiceDeleteReasons = require("./services/getServiceDeleteReasons"),
  getMyOrders = require("./services/getMyOrders"),
  getOrderDetails = require("./services/getOrderDetails"),
  pauseSubscriptionItem = require("./services/pauseSubscriptionItem"),
  deleteSubscription = require("./services/deleteSubscription"),
  getMyProducts = require("./myAccount/getMyProducts"),
  getAddressBySearch = require("./services/getAddressBySearch"),
  getAdminDashboard = require("./admin/getAdminDashboard"),
  getAllPendingServicesByType = require("./admin/getAllPendingServicesByType"),
  getServicePersonList = require("./services/getServicePersonList"),
  getUserPrimaryAddress = require("./user/getUserPrimaryAddress"),
  assignPersonToService = require("./services/assignPersonToService"),
  getAssignedServices = require("./servicePerson/getAssignedServices"),
  updateServiceStatus = require("./servicePerson/updateServiceStatus"),
  saveServiceDetail = require("./services/saveServiceDetail"),
  getAllServices = require("./services/getAllServices"),
  deleteVehicle = require("./myProducts/vehicle/deleteVehicle"),
  getVehicleTypes = require("./myProducts/vehicle/getVehicleTypes"),
  getVehicleDetail = require("./myProducts/vehicle/getVehicleDetail"),
  saveProductToCart = require("./cart/saveProductToCart"),
  getUserCartProductSummary = require("./cart/getUserCartProductSummary"),
  getUserCartItems = require("./cart/getUserCartItems"),
  deleteCartItem = require("./cart/deleteCartItem"),
  checkoutUserCartItems = require("./cart/checkoutUserCartItems"),
  saveAddress = require("./address/saveAddress"),
  updateUserProfile = require("./user/saveUserProfile"),
  getUserAddressIds = require("./address/getUserAddressIds"),
  getAddressDetails = require("./address/getAddressDetails"),
  deleteAddress = require("./address/deleteAddress"),
  getApplicationMetaData = require("./address/getApplicationMetaData"),
  resumeSubscriptionItem = require("./services/resumeSubscriptionItem"),
  changeDefaultAddress = require("./address/changeDefaultAddress"),
  manualRechargeToUser = require("./myAccount/manualRechargeToUser"),
  getMyWalletTransactions = require("./myAccount/getMyWalletTransactions"),
  submitFeedback = require("./support/submitFeedback"),
  updateServiceFrequencyFlag = require("./services/updateServiceFrequencyFlag"),
  getFrequentServices = require("./services/getFrequentServices"),
  updateServiceOrder = require("./services/updateServiceOrder");

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
  // { key: "GetUserEntitlementsAndDefaultProperty", callback: getUserEntitlementsAndDefaultProperty, pushkey: null },
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
  { key: "DeleteImages", callback: deleteImages, pushkey: null },
  { key: "GetImages", callback: getImages, pushkey: null },
  { key: "GetServiceList", callback: getServiceList, pushkey: null, isLoggingEnabled: false },
  { key: "GetMyServiceProducts", callback: getMyServiceProducts, pushkey: null, isLoggingEnabled: false },
  { key: "GetServiceDetail", callback: getServiceDetail, pushkey: null, isLoggingEnabled: false },
  { key: "SaveVehicleDetails", callback: saveVehicleDetails, pushkey: null, isLoggingEnabled: false },
  { key: "GetVechicleAddress", callback: getVechicleAddress, pushkey: null, isLoggingEnabled: false },
  { key: "RequestVehicleService", callback: requestVehicleService, pushkey: null, isLoggingEnabled: false },
  { key: "GetMySubscriptions", callback: getMySubscriptions, pushkey: null, isLoggingEnabled: false },
  { key: "GetServiceDeleteReasons", callback: getServiceDeleteReasons, pushkey: null, isLoggingEnabled: false },
  { key: "GetMyOrders", callback: getMyOrders, pushkey: null, isLoggingEnabled: false },
  { key: "GetOrderDetails", callback: getOrderDetails, pushkey: null, isLoggingEnabled: false },
  { key: "PauseSubscriptionItem", callback: pauseSubscriptionItem, pushkey: null, isLoggingEnabled: false },
  { key: "DeleteSubscription", callback: deleteSubscription, pushkey: null, isLoggingEnabled: false },
  { key: "GetMyProducts", callback: getMyProducts, pushkey: null, isLoggingEnabled: false },
  { key: "GetAddressBySearch", callback: getAddressBySearch, pushkey: null, isLoggingEnabled: false },
  { key: "GetAdminDashboard", callback: getAdminDashboard, pushkey: null, isLoggingEnabled: false },
  { key: "GetAllPendingServicesByType", callback: getAllPendingServicesByType, pushkey: null, isLoggingEnabled: false },
  { key: "GetServicePersonList", callback: getServicePersonList, pushkey: null, isLoggingEnabled: false },
  { key: "GetUserPrimaryAddress", callback: getUserPrimaryAddress, pushkey: null, isLoggingEnabled: false },
  { key: "AssignPersonToService", callback: assignPersonToService, pushkey: null, isLoggingEnabled: false },
  { key: "GetAssignedServices", callback: getAssignedServices, pushkey: null, isLoggingEnabled: false },
  { key: "UpdateServiceStatus", callback: updateServiceStatus, pushkey: null, isLoggingEnabled: false },
  { key: "SaveServiceDetail", callback: saveServiceDetail, pushkey: null, isLoggingEnabled: false },
  { key: "GetAllServices", callback: getAllServices, pushkey: null, isLoggingEnabled: false },
  {key: "DeleteVehicle", callback: deleteVehicle, pushkey: null, isLoggingEnabled: false},
  {key: "GetVehicleTypes", callback: getVehicleTypes, pushkey: null, isLoggingEnabled: false},
  {key: "GetVehicleDetail", callback: getVehicleDetail, pushkey: null, isLoggingEnabled: false},
  {key: "SaveProductToCart", callback: saveProductToCart, pushkey: null, isLoggingEnabled: false},
  {key: "GetUserCartProductSummary", callback: getUserCartProductSummary, pushkey: null, isLoggingEnabled: false},
  {key: "GetUserCartItems", callback: getUserCartItems, pushkey: null, isLoggingEnabled: false},
  {key: "DeleteCartItem", callback: deleteCartItem, pushkey: null, isLoggingEnabled: false},
  {key: "CheckoutUserCartItems", callback: checkoutUserCartItems, pushkey: null, isLoggingEnabled: false},
  {key: "SaveAddress", callback: saveAddress, pushkey: null, isLoggingEnabled: false},
  {key: "UpdateUserProfile", callback: updateUserProfile, pushkey: null, isLoggingEnabled: false},
  {key: "GetUserAddressIds", callback: getUserAddressIds, pushkey: null, isLoggingEnabled: false},
  {key: "GetAddressDetails", callback: getAddressDetails, pushkey: null, isLoggingEnabled: false},
  {key: "DeleteAddress", callback: deleteAddress, pushkey: null, isLoggingEnabled: false},
  {key: "GetApplicationMetaData", callback: getApplicationMetaData, pushkey: null, isLoggingEnabled: false},
  {key: "ResumeSubscriptionItem", callback: resumeSubscriptionItem, pushkey: null, isLoggingEnabled: false},
  {key: "ChangeDefaultAddress", callback: changeDefaultAddress, pushkey: null, isLoggingEnabled: false},
  {key: "ManualRechargeToUser", callback: manualRechargeToUser, pushkey: null, isLoggingEnabled: false},
  {key: "GetMyWalletTransactions", callback: getMyWalletTransactions, pushkey: null, isLoggingEnabled: false},
  {key: "SubmitFeedback", callback: submitFeedback, pushkey: null, isLoggingEnabled: false},
  {key: "UpdateServiceFrequencyFlag", callback: updateServiceFrequencyFlag, pushkey: null, isLoggingEnabled: false},
  {key: "GetFrequentServices", callback: getFrequentServices, pushkey: null, isLoggingEnabled: false},
  {key: "UpdateServiceOrder", callback: updateServiceOrder, pushkey: null, isLoggingEnabled: false},
];
