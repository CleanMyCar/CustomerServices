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
        showsearchText:true,
        showCalendar: true
      };
    },
    methods: {

      GetUserEntitlementsAndDefaultProperty() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetUserEntitlementsAndDefaultProperty",
          params: {
            ModuleAction: "GetUserEntitlementsAndDefaultProperty"
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in GetUserEntitlementsAndDefaultProperty", response);
              // vm.UserProperties = response.properties;
              vm.entitlements = response.userEntitlementList;
              vm.showsearchInput();
              vm.setupPannel();
              vm.calendarIcon();

              // vm.DefaultProperty = response.defaultPropertyId;
            }
          }
        });
      },

      showsearchInput() {
        let vm = this;
        if (vm.entitlements.fncReservationUpdate && vm.entitlements.fncReservationUpdate.isAssigned === -1) {
          // vm.showphone= false;
          vm.showsearchText = false;

        }
        else {
          vm.showsearchText = true;
        }
      },

      setupPannel() {
        let vm = this;
        if (vm.entitlements && vm.entitlements.fncClientList && vm.entitlements.fncPropertyList && vm.entitlements.fncUnitList && vm.entitlements.fncUserList && vm.entitlements.fncRoleList && vm.entitlements.fncListManagementView && vm.entitlements.fncListManagementView && vm.entitlements.fncTaxItemsView && vm.entitlements.fncClientList.isAssigned === 1 || vm.entitlements.fncPropertyList.isAssigned === 1 || vm.entitlements.fncUnitList.isAssigned === 1 || vm.entitlements.fncUserList.isAssigned === 1 || vm.entitlements.fncUserList.isAssigned === 1 || vm.entitlements.fncRoleList.isAssigned === 1 || vm.entitlements.fncListManagementView.isAssigned === 1 || vm.entitlements.fncListManagementView.isAssigned === 1 || vm.entitlements.fncTaxItemsView.isAssigned === 1) {
          vm.showicon = true;
        }
        else {
          vm.showicon = false;

        }
      },
      calendarIcon() {
        let vm = this;
        if (vm.entitlements && (vm.entitlements.fncReservationSelect.isAssigned === 1 || vm.entitlements.fncHousekeeper.isAssigned === 1)) {
          vm.showCalendar = true;
        }
        else {
          vm.showCalendar = false;
        }
      },

      imageURLS(imgGuid) {
        let isBase64 = /^data:image\/([a-zA-Z]*);base64,([^\"]*)/.test(imgGuid)
        if (isBase64) {
          return imgGuid;
        }
        return this.apiUrl + '/downloadImage/' + imgGuid+'/430x300';
      },
      changePassword: function () {


        let self = this;

        self.$store.dispatch("dataRequestHandler", {
          key: "UpdateLogginPassword",
          params: {

            OldPassword: self.UserPassword,
            NewPassword: self.newpassword,
            ModuleAction: "UpdateLogginPassword"

          },
          callback: function (err, response) {
            console.log("userupdate password", response);
            if (err) {
              return;
            }
            else if (response) {
              self.$store.dispatch("toastr",
                {
                  type: "success",
                  message: "Password changed successfully",
                  header: "Success"
                });
            }
          }
        });
      },
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
      togglepassword: function () {
        this.isActiveForPassword = true;
        this.isActiveForCogs = false;
        this.isActiveForUser = false;
        this.isActiveForNotification = false;
        $("#password").toggleClass("expand");
        // $(".notoficationButton").toggleClass("active");
        $(".menuMaskN").toggle();
        $(".clientList").removeClass("expand");
      },


      showClientPanel: function () {
        let vm = this;
        $(".clientList").toggleClass("expand");
        $("#notification").removeClass("expand");
        $(".menuMaskNCL").toggle();
        vm.getClientDetailList();


      },

      showPropertyPanel: function () {
        $(".propertyList").toggleClass("expand");
        $("#notification").removeClass("expand");
        $(".menuMaskNCL").toggle();

      },
      logout: function () {
        let scope = this;
        window.localStorage.removeItem("rttoken");
        window.location.href = "login.html";
      },
      redirectToReservation() {
        let vm = this;
        vm.parentModuleName = "Reservations";
        vm.$store.state.bus.$emit('IsCalendarIcons', vm.parentModuleName);
        vm.searchText = null;
        vm.clear = false;
        // vm.$store.state.bus.$emit('clearSearchText');
        vm.$router.push("/newReservation/-1");
      },
      redirectToHome: function () {
        window.location.href = this.$store.state.uiPageName;// + this.userDetail.response["p_9"]["txt"];
      },
      // toggle: function(){
      //   let vm = this;
      //   vm.isActiveForCogs = true;
      //   vm.isActiveForUser =  false;

      // },
      // toggle2:function(){},
      gotoHome() {
        //window.location.href = this.$store.state.uiPageName;
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

      redirectToProperty() {
        this.$router.push("/propertyList");
        this.isActiveForCogs = true;
        this.isActiveForUser = false;
        this.$store.state.bus.$emit('isActiveForCogs', this.isActiveForCogs);
        //window.location.href = this.$store.state.uiPageName+"#propertyList";
      },
      redirectToClient() {
        this.$router.push("/clientList");
        this.isActiveForCogs = true;
        this.isActiveForUser = false;
        this.$store.state.bus.$emit('isActiveForCogs', this.isActiveForCogs);
        //window.location.href = this.$store.state.uiPageName+"#clientList";
      },
      redirectToUnit() {
        this.$router.push("/unitList");
        this.isActiveForCogs = true;
        this.isActiveForUser = false;
        this.$store.state.bus.$emit('isActiveForCogs', this.isActiveForCogs);
      },
      redirectToUserTypes() {
        this.$router.push("/users");
        this.isActiveForCogs = true;
        this.isActiveForUser = false;
        this.$store.state.bus.$emit('isActiveForCogs', this.isActiveForCogs);
        //window.location.href = this.$store.state.uiPageName + "#users";
        $("#leftMenu").removeClass("expand");
        $("#nav-icon3").removeClass("open");
        $(".menuMask").hide();
      },
      redirectToUserGroups() {
        this.$router.push("/roles");
        this.isActiveForCogs = true;
        this.isActiveForUser = false;
        this.$store.state.bus.$emit('isActiveForCogs', this.isActiveForCogs);
        //window.location.href = this.$store.state.uiPageName + "#userGroupList";
        $("#leftMenu").removeClass("expand");
        $("#nav-icon3").removeClass("open");
        $(".menuMask").hide();
      },
      groupicons() {
        let vm = this;
        vm.parentModuleName = "Admin"
        vm.isActiveForCogs = true
        vm.isActiveForCalendar = false
        vm.$store.state.bus.$emit('IsGroupIcons', vm.parentModuleName);
        if (vm.entitlements.fncClientList.isAssigned === -1 && vm.entitlements.fncPropertyList.isAssigned === 1) {
          vm.$router.push("/propertyList");
          vm.$store.state.bus.$emit('cogs', 'PropertyList');
        }
        else if (vm.entitlements.fncClientList.isAssigned === -1 && vm.entitlements.fncPropertyList.isAssigned === -1 && vm.entitlements.fncUnitList.isAssigned === 1  ) {
          vm.$router.push("/unitList");
          vm.$store.state.bus.$emit('cogs', 'UnitList');
        }
        else if (vm.entitlements.fncClientList.isAssigned === -1 && vm.entitlements.fncPropertyList.isAssigned === -1 && vm.entitlements.fncUnitList.isAssigned === -1  && vm.entitlements.fncRoleList.isAssigned === 1) {
          vm.$router.push("/roles");
          vm.$store.state.bus.$emit('cogs', 'RoleList');

        }
        else if (vm.entitlements.fncClientList.isAssigned === -1 && vm.entitlements.fncPropertyList.isAssigned === -1  && vm.entitlements.fncUnitList.isAssigned === -1 && vm.entitlements.fncRoleList.isAssigned === -1 && vm.entitlements.fncUserList.isAssigned === 1) {
          vm.$router.push("/users");
          vm.$store.state.bus.$emit('cogs', 'Users');
        }
        else if (vm.entitlements.fncClientList.isAssigned === -1 && vm.entitlements.fncPropertyList.isAssigned === -1 && vm.entitlements.fncUnitList.isAssigned === -1 && vm.entitlements.fncRoleList.isAssigned === -1 && vm.entitlements.fncUserList.isAssigned === -1 && vm.entitlements.fncListManagementView.isAssigned === 1) {
          vm.$router.push("/ListManagement");
          vm.$store.state.bus.$emit('cogs', 'listManagement');
        }
        else if (vm.entitlements.fncClientList.isAssigned === -1 && vm.entitlements.fncPropertyList.isAssigned === -1 && vm.entitlements.fncUnitList.isAssigned === -1 && vm.entitlements.fncRoleList.isAssigned === -1 && vm.entitlements.fncUserList.isAssigned === -1 && vm.entitlements.fncListManagementView.isAssigned === -1 && vm.entitlements.fncTaxItemsView.isAssigned === 1) {
          vm.$router.push("/tax");
          vm.$store.state.bus.$emit('cogs', 'tax');
        }
        else {
          vm.$router.push("/clientList");
          vm.$store.state.bus.$emit('cogs', 'ClientList');
        }



      },
      calendar() {
        let vm = this;
        vm.parentModuleName = "Reservations";
        vm.isActiveForCalendar = true
        vm.isActiveForCogs = false
        vm.$store.state.bus.$emit('IsCalendarIcons', vm.parentModuleName);
        if (vm.entitlements.fncReservationList.isAssigned === -1) {
          vm.$router.push("/houseKeepingStatus");
          vm.$store.state.bus.$emit('calendar', 'HouseKeepingStatus');
        }
        else{
          vm.$router.push("/ReservationList");
        }
        
        vm.$store.state.bus.$emit('clearSearchText');
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
      notifyTheRespectiveComponent() {
        if (this.$route.name === "ReservationList")
          this.$store.state.bus.$emit('Search-In-Reservation-List', this.searchText)
        else if (this.$route.name === "Users")
          this.$store.state.bus.$emit('Search-In-Users-List', this.searchText)
        else if (this.$route.name === "RoleList")
          this.$store.state.bus.$emit('Search-In-Role-List', this.searchText)
        else if (this.$route.name === "PropertyList")
          this.$store.state.bus.$emit('Search-In-Property-List', this.searchText)
        else if (this.$route.name === "UnitList")
          this.$store.state.bus.$emit('Search-In-Unit-List', this.searchText)
      }
    },
    computed: {

      // fncIsHousekeepingTaskList() {
      //   let vm = this;
      //   if (vm.functions.fncHousekeepingTaskList && vm.functions.fncHousekeepingTaskList.isAssigned === 1) {
      //     // vm.showphone= false;
      //     return false

      //     console.log("vm.showphone===>", vm.showphone);
      //   }
      // },



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
      // fncIsReservationNew(){
      // let  vm = this;
      // return vm.$store.state.userEntitlementList.hasOwnProperty("fncReservationNew");
      // },
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

      // setupPannel() {
      //   let vm = this;
      //   if (vm.$store.state.userEntitlementList && vm.$store.state.userEntitlementList.fncClientList && vm.$store.state.userEntitlementList.fncPropertyList && vm.$store.state.userEntitlementList.fncUnitList && vm.$store.state.userEntitlementList.fncUserList && vm.$store.state.userEntitlementList.fncRoleList && vm.$store.state.userEntitlementList.fncListManagementView && vm.$store.state.userEntitlementList.fncListManagementView && vm.$store.state.userEntitlementList.fncTaxItemsView && vm.$store.state.userEntitlementList.fncClientList.isAssigned === 1 || vm.$store.state.userEntitlementList.fncPropertyList.isAssigned === 1 || vm.$store.state.userEntitlementList.fncUnitList.isAssigned === 1 || vm.$store.state.userEntitlementList.fncUserList.isAssigned === 1 || vm.$store.state.userEntitlementList.fncUserList.isAssigned === 1 || vm.$store.state.userEntitlementList.fncRoleList.isAssigned === 1 || vm.$store.state.userEntitlementList.fncListManagementView.isAssigned === 1 || vm.$store.state.userEntitlementList.fncListManagementView.isAssigned === 1 || vm.$store.state.userEntitlementList.fncTaxItemsView.isAssigned === 1) {
      //     return true;
      //   }
      //  else {
      //   return false;
      //  }
      // }
      // fncIsPropertyList(){
      //   let vm = this;
      //   if(vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertyList")){

      //     let fncPropertyList =  vm.$store.state.userEntitlementList.fncPropertyList

      //     return fncPropertyList;            
      //   }
      //   return null;
      // },
      // fncIsRoleList(){
      //   let vm = this;
      //   if(vm.$store.state.userEntitlementList.hasOwnProperty("fncRoleList")){
      //     console.log("fncRoleList =>",vm.$store.state.userEntitlementList);
      //     let fncRoleList =  vm.$store.state.userEntitlementList.fncRoleList
      //     console.log("fncRoleList", fncRoleList)
      //     return fncRoleList;            
      //   }
      //   return null;
      // },
      // fncIsUserList(){
      //   let vm = this;
      //   if(vm.$store.state.userEntitlementList.hasOwnProperty("fncUserList")){
      //     console.log("fncUserList =>",vm.$store.state.userEntitlementList);
      //     let fncUserList =  vm.$store.state.userEntitlementList.fncUserList
      //     console.log("fncUserList", fncUserList)
      //     return fncUserList;            
      //   }
      //   return null;
      // }




    },
    created() {
      let vm = this;
      vm.$store.state.bus.$on("setParentAndSubmenuListGroupIcons", function (selected) {
        console.log("setParentAndSubmenuListGroupIcons", selected);
        vm.parentModuleName = selected.toString();
      });
      vm.$store.state.bus.$on("setParentAndSubmenuListCalendarIcons", function (selected) {
        vm.parentModuleName = selected.toString();
      });
      vm.$store.state.bus.$on('isActiveForReservations', function (selected) {
        if (selected === true) {
          vm.isActiveForCogs = false;
          vm.isActiveForNotification = false;
          vm.isActiveForChangePassword = false;
          vm.isActiveForUser = false;
          console.log("this.isActive", vm.isActiveForCogs);
          console.log("this.isActive", vm.isActiveForNotification)
          console.log("this.isActive", vm.isActiveForUser)
        }

      });
      vm.$store.state.bus.$on("IsCalendarIcons", function (selected) {
        console.log("in IsCalendarIcons", selected);
        // submenuListName: "ReservationsList",
        vm.parentModuleName = selected.toString();
        vm.submenuListName = "ReservationsList"
        // if (selected === true) {
        //   vm.isActiveGroupIcons = true;
        //   vm.isActiveCalendarIcons = false;
        //   vm.isActiveForReservations = true;
        // }
      });
      vm.$store.state.bus.$on('clearSearchText', function () {
        console.log("Clear called from module");
        vm.searchText = null;
        vm.clearResults();
      });
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
      // vm.ClientName = window.localStorage.getItem('CName');

      // vm.getUserProfile();
      vm.getClientDetailByid();
      vm.getClientDetailList();
      vm.GetUserEntitlementsAndDefaultProperty();


      vm.$store.state.bus.$on('userEntitlementList', function (payload) {

        console.log("userEntitlementList======>", payload);
        vm.functions = payload;
        console.log("vm.functions", vm.functions);

      });
      vm.$store.state.bus.$on("setParentAndSubmenuListCalendarIcons", function (selected) {
        console.log("selected", selected);
        vm.parentModuleName = selected.toString();
        console.log("vm.parentModuleName", vm.parentModuleName);
        // }
      });



      // vm.getPropertyDetailList();
      // vm.getClientDetailList();

    }
  }

</script>