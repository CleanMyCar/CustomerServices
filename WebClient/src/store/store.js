import io from "socket.io-client";
import Vue from "vue";
import Vuex from "vuex";
import moment from "moment-timezone";
import * as axios from 'axios';
import * as Toastr from 'toastr';
import accounting from 'accounting';

Vue.use(Vuex);

//set users timezone like this
//      moment.tz.setDefault("America/New_York");
moment.tz.setDefault(moment.tz.guess());

Toastr.options.positionClass = "toast-bottom-right";
Toastr.options.preventDuplicates = true;

let apiIp = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":1339" : '');// "/dev/socket.io/";

let socket = io(apiIp);
//let socket = io('http://192.168.1.9:1337');


socket.on('connect', function () {
  console.log("connected...!");
});


socket.on('NotificationReceived', function (response) {
  console.log(response);

  store.dispatch("getNotificationKeys", { "params": {} })
});

let dataRequestHandler = (key, params, callback) => {

  let continueTheCall = (key, params, callback) => {
    socket.emit(key, params, (err, serverResponse) => {
      if (err && !err.token && err.message === "Session Expired") {
        console.log(err.message);
        window.location.href = "login.html";
      }
      else {
        if (serverResponse.token) {
          window.localStorage.setItem('rttoken', serverResponse.token);
        }
        callback(err, serverResponse.response);
        $(".mainBody").css("display", "");
      }
    });
  };

  params.systemParams = {
    token: window.localStorage.getItem('rttoken'),
    Source: "Web",
    SourceId: window.location.hostname,
  };

  continueTheCall(key, params, callback);
};


let apiHttpRequest = function (apiUrl, type, params, successCallback, failureCallback) {
  let url = apiIp + "/" + apiUrl;
  axios.post(url, params)
    .then(function (response) {
      if (successCallback)
        successCallback(response);
    })
    .catch(function (error) {
      if (failureCallback)
        failureCallback(error);
    });
};

let downloadExcelFile = function (fileName, module) {
  const BASE_URL = window.location.protocol + "//" + window.location.hostname + ":1338";
  const url = `${BASE_URL}/Excel`;

  var form = $('<form/>', { action: url, method: 'POST' }).appendTo('body');
  form.append("<input type='hidden' name='fileName' value='" + fileName + "' />");
  form.append("<input type='hidden' name='module' value='" + module + "' />");
  form.append("<input type='hidden' name='token' value='" + window.localStorage.getItem('vwtoken') + "' />");
  form.submit();
};


let getFormattedAmount = function (currency, amount) {
  if (amount != undefined && amount != null && amount != "null" && amount != "undefined") {
    return currency ? accounting.formatMoney(amount,
      {
        symbol: '$', format: {
          pos : "%s %v",
          neg : "%s (%v)",
          zero: "%s  %v"
        }, thousand: ",",
        precision: 2,
        decimal: "."
      }) : accounting.formatMoney(amount, {
        format: "%v",
         thousand: ",",
        precision: 0,
        decimal: "."
      });

      formatColumn()
  }
  else {
    return "";
  }
}

export const store = new Vuex.Store({
  state: {
    isCurrentUserAdmin: false,
    uiPageName: "index.html",
    selectedUserDetail: null,
    notification: {},
    notificationList: {},
    userGroupInstanceId: null,
    selectedMenuId: null,
    menuInstanceId: null,
    parentMenuInstanceId: null,
    defaultSessionCount: -2, //adding two default sessions
    selectedNotificationDetail: null,
    selectedclientDetail: null,
    dashboardRouterContext: null,
    rowsPerPage: 10,
    sendApiRequest: apiHttpRequest,
    downloadExcelFile: downloadExcelFile,
    /* added for reports (excel,csv and pdf files download functionality) */
    reportHttpUrl: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":3002" : ''),
    /* added for property module */
    selectedPropertyId: null,
    userEntitlementList: {},
    EntityNames: {},
    defaultUserPropertyId: null,
    bus: new Vue(),
    getFormattedAmount: getFormattedAmount,
    loggedInUserDetail: null,
    loggedInUserWallet: null
  },
  mutations: {
    setIsCurrentUserAdmin(state, isCurrentUserAdmin) {
      state.isCurrentUserAdmin = isCurrentUserAdmin;
    },
    setUIPageName(state, text) {
      state.uiPageName = text;
    },
    setSelectedUserDetail(state, payload) {
      state.selectedUserDetail = payload;
    },
    setLeaveRouterContext(state, payload) {
      state.leaveRouterContext = payload;
    },
    setUserGroupInstanceId(state, payload) {
      state.userGroupInstanceId = payload;
    },
    setMenuInstanceId(state, payload) {
      state.menuInstanceId = payload;
    },
    setParentMenuInstanceId(state, payload) {
      state.parentMenuInstanceId = payload;
    },
    setSelectedMenuId(state, payload) {
      state.selectedMenuId = payload;
    },
    setSelectedNotifcationDetail(state, payload) {
      state.selectedNotificationDetail = payload;
    },
    setDashboardRouterContext(state, payload) {
      state.dashboardRouterContext = payload;
    },
    setDataByType(state, payload) {
      // if (state.hasOwnProperty("notification")) {
      Vue.set(state["notification"], payload.NotificationIdText, payload.data);
      // }
    },
    setNotifications(state, payload) {
      // if (state.hasOwnProperty("notification")) {
      Vue.set(state["notificationList"], "0", payload.data);
      // }
    },
    setclientDetails(state, payload) {
      // if (state.hasOwnProperty("notification")) {
      // Vue.set(state["notificationList"], "0", payload.data);
      state.selectedclientDetail = payload
      // }
    },
    setUserEntitlementList(state, payload) {
      console.log("setUserEntitlementList.payload => ", payload);
      state.userEntitlementList = payload;
      if (state.userEntitlementList) {
        state.bus.$emit("userEntitlementList", state.userEntitlementList);
      }
    },


    setUserEntityNames(state, payload) {
      console.log("setUserEntityNames.payload => ", payload);
      state.EntityNames = payload;
      if (state.EntityNames) {
        state.bus.$emit("entityNames", state.EntityNames);
      }
    },


    setDefaultPropertyId(state, payload) {
      state.propertyId = payload;
    },
    setUserDefaultPropertyId(state, payload) {
      console.log("setUserDefaultPropertyId.payload => ", payload);
      state.defaultUserPropertyId = payload;
    }
  },
  actions: {
    dataRequestHandler({ }, payload) {
      // A wrapper for calling server directly from Vue Components
      dataRequestHandler(payload.key, payload.params, payload.callback);
    },

    toastr({ }, payload) {
      if (payload.type && payload.header && payload.message) {
        Toastr[payload.type](payload.message, payload.header);
      } else if (payload.type && payload.message) {
        Toastr[payload.type](payload.message);
      }
    },
    getNotificationDetail({ commit, state }, payload) {

      if (state["notification"] && !state["notification"].hasOwnProperty(payload.params.notificationId)) {
        commit("setDataByType", Object.assign({}, { NotificationIdText: payload.params.notificationId }, {
          data: {
            status: "loading",
            err: "",
            response: null
          }
        }));

        dataRequestHandler("GetNotificationDetail", payload.params, function (err, response) {
          if (err) {
            commit("setDataByType", Object.assign({}, { NotificationIdText: payload.params.notificationId }, {
              data: {
                status: "error",
                err: err,
                response: null
              }
            }));
            return;
          }

          commit("setDataByType", Object.assign({}, { NotificationIdText: payload.params.notificationId }, {
            data: {
              status: "success",
              err: "",
              response: response[0]
            }
          }));
        });
      }
    },


    getNotificationKeys({ commit, state }, payload) {

      if (state["notificationList"] && !state["notificationList"].hasOwnProperty("0")) {
        commit("setDataByType", Object.assign({}, {}, {
          data: {
            status: "loading",
            err: "",
            response: null
          }
        }));
      }

      dataRequestHandler("GetNotificationList", payload.params, function (err, response) {
        if (err) {
          commit("setNotifications", Object.assign({}, {}, {
            data: {

              status: "error",
              err: err,
              response: null
            }
          }));
          return;
        }

        commit("setNotifications", Object.assign({}, {}, {
          data: {
            status: "success",
            err: "",
            response: response[0]
          }
        }));
      });

    },

    GetUserEntitlementsAndDefaultProperty({ commit, state }, params) {
      console.log("GetUserEntitlementsAndDefaultProperty");


      if (state.hasOwnProperty("userEntitlementList") && Object.keys(state.userEntitlementList).length > 0) {

      }
      else {
        // dataRequestHandler("GetUserEntitlementsAndDefaultProperty", {}, (error, response) => {
        //   if (error) {
        //     commit("setUserEntitlementList", null);
        //     return;
        //   }

        //   commit("setUserEntitlementList", response.userEntitlementList);

        //   commit("setUserDefaultPropertyId", response.defaultPropertyId);
        //   commit("setUserEntityNames", response.EntityNames);
        // });
      }

      // socket.emit("GetUserEntitlementsAndDefaultProperty", params, (err, response) => {
      //   // if (err) {
      //   //   commit("clientFunctionList", Object.assign({}, {}, {
      //   //     data: {

      //   //       status: "error",

      //   //     }
      //   //   }));
      //   //   return;
      //   // }

      //   commit("setUserEntitlementList", response.userEntitlementList);
      //   commit("setUserDefaultPropertyId", response.defaultPropertyId);
      // });


    },
  },

  getters: {
    getNotificationDetail: (state, getters) => (query) => {
      if (state["notification"] && state["notification"].hasOwnProperty(query.params.notificationId)) {
        return state["notification"][query.params.notificationId];
      }
      return null;
    },
    getNotificationKeys: (state, getters) => (query) => {
      if (state["notificationList"] && state["notificationList"].hasOwnProperty("0")) {
        return state["notificationList"]["0"];
      }
      return null;
    },
    getUserEntitlements: (state, getters) => () => {
      return state.userEntitlementList;
    }

  }
});

// dataRequestHandler("GetUserEntitlementsAndDefaultProperty", {}, (error, response) => {
//   console.log("store.error => ", error);
//   console.log("store.response => ", response);

//   store.commit("setUserEntitlementList", response.userEntitlementList);
//   store.commit("setUserDefaultPropertyId", response.defaultPropertyId);
//   store.commit("setUserEntityNames", response.EntityNames);

//   // store.state

// });
