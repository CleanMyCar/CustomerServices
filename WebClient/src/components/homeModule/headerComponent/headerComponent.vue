<template src="./headerComponent.template.html"></template>

<script>
  // const socket = require('socket.io');


  export default {
    // options

    name: 'headerMenu',
    props: [],
    data() {
      return {
        showphone: true,
        apiUrl: window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":1339" : ''),
        isActiveForCalendar: true,
        isActiveForCogs: false,
        isActiveForNotification: false,
        isActiveForPassword: false,
        isActiveForUser: false,
        isBgColor1: false,
        notificationList: [],
        clientList: [],
        filterType: 'prepared',
        clientPanel: false,
        parentModuleName: "Reservations",
        // submenuModuleName: "",
        // notificatoinKeyList: [],
        userImage: "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png",
        userName: null,
        userNotifications: [],
        // notificationCount: 0,
        userProfile: null,
        unreadCount: 0,
        // ClientId: null,
        ClientName: null,
        ClientId: null,
        seen: true,
        selectedClientObj: {},
        propertyList: [],
        UserPassword: "",
        newpassword: "",
        confirmPassword: "",
        searchText: null,
        clear: false,
        loadGif: false,
        functions: {},
        entitlements: {},
        showicon: true,
        showsearchText: true,
        showCalendar: true
      };
    },
    methods: {
      toggleNotification: function () {
        this.isActiveForNotification = true;
        this.isActiveForPassword = false;
        this.isActiveForCogs = false;
        this.isActiveForUser = false
        $("#notification").toggleClass("expand");
        $(".notoficationButton").toggleClass("active");
        $(".menuMaskN").toggle();
        $(".clientList").removeClass("expand");
      },
      logout: function () {
        let scope = this;
        window.localStorage.removeItem("rttoken");
        window.location.href = "login.html";
      },
      navigateToHome: function () {
        window.location.href = this.$store.state.uiPageName;// + this.userDetail.response["p_9"]["txt"];
      },
      clearMessages: function () {
        changeNotificationStatus(scope.userNotifications, "archieved");
      },
      changeNotificationStatus: function (notifications, status) {
        let scope = this;
        scope.$store.dispatch("dataRequestHandler", {
          "key": "UpdateNotification", "params": { "notifications": notifications, "status": status }, "callback": function (err, response) {
            //console.log(response);
            scope.userNotifications = [];
            scope.notificationCount = 0;
          }
        });
      },
      clientDetail() {
        //   window.location.href = this.$store.state.uiPageName + "#clientDetails/-1";
        this.$router.push("clientDetail/-1");
      },
      getUserProfile() {
        let self = this;
        console.log("getUserProfile mounted")
        self.$store.dispatch("dataRequestHandler", {
          key: 'GetUserProfile', params: {}, callback: function (err, response) {

            //console.log(err + "/" + response);
            if (response) {


              // self.userProfile = response.recordsets[0][0];
              // self.userImage = self.userProfile.ProfileImage;
              // self.userName = self.userProfile.userFirstName + " " + self.userProfile.userLastName;
              console.log("userProfile=>", response);
              if (self.clientList.ClientId === response.ClientId) {
                self.selectedClientObj = response[0][0];
                console.log("self.selectedClientObj", self.selectedClientObj);
                // self.ClientName = response[0][0].ClientName;
                // self.UserPassword = response[0][0].UserPassword;
                console.log("selectedClientObj===================>", self.selectedClientObj);
                self.getClientDetailList();
              }
            }

          }
        });
      },
      getClientDetailList() {
        let scope = this;
        // console.log("scope.selectedClientObj.ClientId", scope.selectedClientObj.ClientId)
        console.log("In get client detail list");
        console.log("In get client detail scope.selectedClientObj", scope.selectedClientObj)

        if ((scope.getUserProfile) && (scope.selectedClientObj !== null)) {
          if (scope.selectedClientObj.ClientId === 1) {
            console.log("scope.selectedClientObj.ClientId", scope.selectedClientObj.ClientId)
            scope.ClientId = scope.selectedClientObj.ClientId;
          }
          this.$store.dispatch("dataRequestHandler", {
            key: "GetClientList_Cpanel",
            params: {
              ModuleAction: "GetClientList_Cpanel",
              ClientId: scope.ClientId
            },
            callback(err, response) {
              if (response) {
                console.log("response getClientDetailList" + JSON.stringify(response.recordsets[1]));
                scope.clientList = response.recordsets[0];
                // scope.clientList = response;
                console.log("GetClientList_Cpanel1", response);
                console.log("GetClientList_Cpanel2", scope.clientList);

              } else {
                console.log(err);
              }
            }
          });
        }
      },
      // getPropertyDetailList: function () {
      //   let scope = this;
      //   console.log("In get propertydetail list");
      //   this.$store.dispatch("dataRequestHandler", {
      //     key: "GetPropertyList_CPanel",
      //     params: {
      //       ModuleAction: "GetPropertyList_CPanel",
      //       // PropertyId: scope.PropertyId

      //     },
      //     callback: function (err, response) {
      //       if (response) {
      //         console.log("got the propertyList", response)
      //         scope.propertyList = response[1];
      //       }
      //       else {
      //         console.log(err);
      //       }

      //     }
      //   });
      // },
      viewClientDetailById(Client) {
        // console.log("")
        console.log("client id in viewClientDetailById" + Client.ClientId);


        //  window.location.href = this.$store.state.uiPageName + "#clientDetails/" + ClientId;

        console.log("dispatching");
        let vm = this;
        vm.$router.push("/clientList");
        // vm.ClientId = ClientId,
        vm.$store.dispatch("dataRequestHandler", {
          key: "UpdateTokenWithClientId",
          params: {
            ModuleAction: "UpdateTokenWithClientId",
            ClientId: Client.ClientId
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in UpdateTokenWithClientId", response.token);
              window.localStorage.removeItem("rttoken");
              window.localStorage.setItem('rttoken', response.token);
              location.reload();
              vm.getClientDetailByid();
              vm.getPropertyDetailList();
            }

          }
        })


      },
      getClientDetailByid: function () {
        let scope = this;
        console.log("In viewclientdetail" + scope.$route.params.clientId);
        scope.$store.dispatch("dataRequestHandler", {
          key: "GetClientDetailById",
          params: {
            ModuleAction: "GetClientDetailById",
          },
          callback: function (err, response) {
            if (err) {
              console.log("Error in getClientDetailByid => ", err);
              return;
            }
            if (response) {
              if (response.recordsets[5]) {
                scope.ClientName = response.recordsets[5][0].ClientName;
                scope.ClientId = response.recordsets[5][0].ClientId;
              }
            }
          }

        });
      },
      getNotifications() {

      },
      getNotifications1() {
        //this.$store.dispatch("getNotificationKeys", { "params": {} })
      },
      showNotificationByType(type) {
        this.filterType = type;
      },
      redirectToNotifications: function () {
        window.location.href = this.$store.state.uiPageName + "#notifications";
      },
      redirectToChangePassword: function () {
        window.location.href = this.$store.state.uiPageName + "#password";
      },

      navigateToUserProfile: function () {
        this.isActiveForUser = true;
        this.isActiveForCogs = false;
        window.location.href = this.$store.state.uiPageName + "#userProfile";
        this.$store.state.bus.$emit('isActiveForUser', this.isActiveForUser);
      },

      // redirectToChangePassword() {
      //   alert("password")
      //   this.isActiveForUser = true;
      //   this.isActiveForCogs = false;
      //   this.$store.state.bus.$emit('isActiveForUser', this.isActiveForUser);
      //   window.location.href = this.$store.state.uiPageName + "#changePassword";
      // },
      naviagateToDetail(notificationObj) {
        this.dismissNotification(notificationObj);
        window.location.href = this.$store.state.uiPageName + "#notifications/" + notificationObj.NotificationIdText;
      },
      dimissAllNotifications() {
        let scope = this;
        let arrNotificationIds = [];

        for (let index = 0; index < scope.notificatoinKeyList.response.length; index++) {
          arrNotificationIds.push(scope.notificatoinKeyList.response[index]["NotificationIdText"]);
        }

        if (arrNotificationIds.length > 0) {
          scope.updateNotificationStatus(arrNotificationIds);
          scope.notificatoinKeyList.response.splice(0, Infinity);
        }
      },
      updateNotificationStatus(arrNotificationIds) {
        let scope = this;

        scope.$store.dispatch("dataRequestHandler", {
          key: "DismissNotification",
          params: {
            notificationId: arrNotificationIds,
            statusId: 2
          },
          callback: (err, response) => {
            //console.log(response);
            if (err) {
              console.log("Error in updateNotificationStatus => ", err);
              return;
            }
          }
        })
      },
      updateNotificationCount(notificationObj) {
        let scope = this;
        let index = scope.notificatoinKeyList.response.findIndex(x => x.NotificationIdText == notificationObj.NotificationIdText);
        if (index > -1) {
          scope.notificatoinKeyList.response.splice(index, 1);
        }
      },
      searchWithText(event) {
        if (event.key == "Enter") {
          this.clear = true;
          console.log(event.key);
          if (this.searchText && this.searchText.trim()) {
            this.notifyTheRespectiveComponent();
            this.clearResults();
          }
        }
      },
      clearResults() {
        this.searchText = null;
        //this.$store.state.bus.$emit('Clear-Search-Reservation-List')
        // this.notifyTheRespectiveComponent();
        this.clear = false;
        this.loadGif = !this.loadGif
      },
      panelCallback() {
        this.toggleNotification();
      },
      getUserDetails() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetUserProfile",
          params: {},
          callback: function (error, response) {
            if (error) {
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "user error!",
                message: error.sqlMessage ? error.sqlMessage : error
              });
              return;
            }
            vm.$store.state.loggedInUserDetail = response.userDetails;
            vm.$store.state.loggedInUserWallet = response.userWallet;

          }
        })
      },
    },
    computed: {

      notificatoinKeyList() {
        return [];//this.$store.getters.getNotificationKeys({ "params": {} });
      },
      notificationCount() {
        if (this.notificatoinKeyList && this.notificatoinKeyList.status == 'success') {
          let count = 0;
          for (let index = 0; index < this.notificatoinKeyList.response.length; index++) {
            if (this.notificatoinKeyList.response[index]["Status"] == 1) {
              count++;
            }
          }
          return count;
        }
        return 0;
      },
      fncIsMyProfile() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncMyProfile")) {
          console.log("fncMyProfile =>", vm.$store.state.userEntitlementList);
          let fncMyProfile = vm.$store.state.userEntitlementList.fncMyProfile
          console.log("fncMyProfile", fncMyProfile)
          return fncMyProfile;
        }
        return null;
      },
      fncIsLogout() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncLogout")) {
          console.log("fncLogout =>", vm.$store.state.userEntitlementList);
          let fncLogout = vm.$store.state.userEntitlementList.fncLogout
          console.log("fncLogout", fncLogout)
          return fncLogout;
        }
        return null;
      },

      fncIsReservationNew() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncReservationNew")) {
          console.log("fncIsReservationNew =>", vm.$store.state.userEntitlementList);
          let fncReservationNew = vm.$store.state.userEntitlementList.fncReservationNew
          console.log("fncReservationNew", fncReservationNew)
          return fncReservationNew;
        }
        return null;
      },
      fncIsMyProfile() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncMyProfile")) {
          console.log("fncMyProfile =>", vm.$store.state.userEntitlementList);
          let fncMyProfile = vm.$store.state.userEntitlementList.fncMyProfile
          console.log("fncMyProfile", fncMyProfile)
          return fncMyProfile;
        }
        return null;
      },
      fncIsLogout() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncLogout")) {
          console.log("fncLogout =>", vm.$store.state.userEntitlementList);
          let fncLogout = vm.$store.state.userEntitlementList.fncLogout
          console.log("fncLogout", fncLogout)
          return fncLogout;
        }
        return null;
      },

      // s
    },
    created() {
      let vm = this;
    },
    watch: {
      namespaceInstanceId() {
        //console.log("test");
        //console.log(this.namespaceInstanceId);
        //Check whether user is belongs to admin group or not
      }
    },
    mounted() {
      //this.getNotifications1();
      let vm = this;
      vm.getUserDetails();
    }
  }

</script>