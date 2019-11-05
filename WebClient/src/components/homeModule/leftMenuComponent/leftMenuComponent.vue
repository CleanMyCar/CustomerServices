<template src="./leftMenuComponent.template.html"></template>
<script>
import $ from "jquery";

export default {
  // options
  props: ["instanceId", "clientId"],
  data() {
    return {
      isActiveForReservations: true,
      isActiveCalendarIcons: false,
      isActiveGroupIcons: true,
      isBgClient: true,
      parentModuleName: "Reservations",
      submenuListName: "/",
      isBgProperty: false,
      isBgRoles: false,
      isBgUsers: false,
      isBgUnit: false,
      isBgListManagement: false,
      isBgTax: false,
      isBgledgerAccount: false,
      isBgGuests: false,
      isBgUnit: false,
      selectedMenu: null
    };
  },

  methods: {
    getData: function() {
      $('[data-toggle="tooltip"]').tooltip();
    },
    toggleSideBar: function() {
      $("#leftMenu").toggleClass("expand");
      $("#nav-icon3").toggleClass("open");
      $(".menuMask").toggle();
    },
    pinSideBar: function() {
      $(".mainContent").toggleClass("fix");
      $(".sideBar").toggleClass("fix");
      $(".menuMask").hide();
      var currentItem = $(".pintx");
      if ($(currentItem).text() == "Always show sidebar") {
        $(currentItem).text("Hide sidebar");
        $(".sideBar").removeClass("expand");
      } else $(currentItem).text("Always show sidebar");
      $("#nav-icon3").removeClass("open");
    },
    switchClient: function() {
      window.location.href = this.$store.state.uiPageName;
    },
    redirectToUsers: function() {
      this.$router.push("/reservations");
    },
    redirectToNotifications: function() {
      this.$router.push("/notifications");
      //window.location.href = this.$store.state.uiPageName + "#notifications";
      $("#leftMenu").removeClass("expand");
      $("#nav-icon3").removeClass("open");
      $(".menuMask").hide();
    },
    redirectToUserTypes() {
      // this.isBgClient = false;
      // this.isBgProperty = false;
      // this.isBgRoles = false;
      // this.isBgUsers = true;
      // this.isBgGuests = false;
      // this.isBgUnit = false;
      // this.isBgListManagement = false;
      // this.isBgTax = false;
      // this.isBgledgerAccount = false;
      this.submenuListName = "Users";
      this.$router.push("/users");
      //window.location.href = this.$store.state.uiPageName + "#users";
      $("#leftMenu").removeClass("expand");
      $("#nav-icon3").removeClass("open");
      $(".menuMask").hide();
    },
    redirectToGuestprofiles() {
      // this.isBgClient = false;
      // this.isBgProperty = false;
      // this.isBgRoles = false;
      // this.isBgUsers = false;
      // this.isBgGuests = true;
      // this.isBgUnit = false;
      // this.isBgListManagement = false;
      // this.isBgTax = false;
      // this.isBgledgerAccount = false;
      this.submenuListName = "GuestProfileList";
      this.$router.push("/guestProfileList");
      //window.location.href = this.$store.state.uiPageName + "#users";
      $("#leftMenu").removeClass("expand");
      $("#nav-icon3").removeClass("open");
      $(".menuMask").hide();
    },
    redirectToUserGroups() {
      // this.isBgClient = false;
      // this.isBgProperty = false;
      // this.isBgRoles = true;
      // this.isBgUsers = false;
      // this.isBgGuests = false;
      // this.isBgUnit = false;
      // this.isBgListManagement = false;
      // this.isBgTax = false;
      // this.isBgledgerAccount = false;
      this.submenuListName = "RoleList";
      this.$router.push("/roles");
      //window.location.href = this.$store.state.uiPageName + "#userGroupList";
      $("#leftMenu").removeClass("expand");
      $("#nav-icon3").removeClass("open");
      $(".menuMask").hide();
    },
    redirectToIntegrationPage() {
      // this.isBgClient = false;
      // this.isBgProperty = false;
      // this.isBgRoles = true;
      // this.isBgUsers = false;
      // this.isBgGuests = false;
      // this.isBgUnit = false;
      // this.isBgListManagement = false;
      // this.isBgTax = false;
      // this.isBgledgerAccount = false;
      this.submenuListName = "IntegrationPage";
      this.$router.push("/integrationPage");
      //window.location.href = this.$store.state.uiPageName + "#userGroupList";
      $("#leftMenu").removeClass("expand");
      $("#nav-icon3").removeClass("open");
      $(".menuMask").hide();
    },
    redirectToPaymentReports() {
      this.submenuListName = "PaymentReports";
      this.$router.push("/PaymentReports");
      $("#leftMenu").removeClass("expand");
      $("#nav-icon3").removeClass("open");
      $(".menuMask").hide();
    },
    redirectToDashboard() {
      this.submenuListName = "Dashboard";
      this.$router.push("/Dashboard");
      $("#leftMenu").removeClass("expand");
      $("#nav-icon3").removeClass("open");
      $(".menuMask").hide();
    },
    redirectToChangePassword() {
      this.$router.push("/reservations");
      window.location.href = this.$store.state.uiPageName + "#changePassword";
      $("#leftMenu").removeClass("expand");
      $("#nav-icon3").removeClass("open");
      $(".menuMask").hide();
    },
    redirectToReservationsList() {
      this.submenuListName = "Reservations";
      this.$router.push("/ReservationList");
      this.isActiveForReservations = true;
      console.log("here in left pannel");
      this.$store.state.bus.$emit(
        "isActiveForReservations",
        this.isActiveForReservations
      );
      this.$store.state.bus.$emit("clearSearchText");
      //window.location.href = this.$store.state.uiPageName + "#reservations";
    },
    redirectToTapeChartGrid() {
      this.submenuListName = "TapeChartGrid";
      this.$router.push("/tapechartGrid");
      this.isActiveForReservations = true;
      this.$store.state.bus.$emit(
        "isActiveForReservations",
        this.isActiveForReservations
      );
      //window.location.href = this.$store.state.uiPageName + "#reservations";
    },
    redirectToTapeChart() {
      this.submenuListName = "CalendarView";
      this.$router.push("/calendarView");
      this.isActiveForReservations = true;
      this.$store.state.bus.$emit(
        "isActiveForReservations",
        this.isActiveForReservations
      );
      //window.location.href = this.$store.state.uiPageName + "#reservations";
    },
    // isEmptyCart(){
    //   if(this.checkedProperty.isAssigned === 1){
    //      return false;
    //     }else{
    //      this.$router.push("/reservationList");
    //     }
    // },
    redirectToRoomInventory() {
      console.log("here");
      let vm = this;
      (vm.submenuListName = "RoomInventoryDetail"),
        vm.$router.push("/roomInventoryDetail");
    },
    redirectToProperty() {
      // this.isBgClient = false;
      // this.isBgProperty = true;
      // this.isBgRoles = false;
      // this.isBgUsers = false;
      // this.isBgGuests = false;
      // this.isBgUnit = false;
      // this.isBgListManagement = false;
      // this.isBgTax = false;
      // this.isBgledgerAccount = false;
      this.submenuListName = "PropertyList";
      this.$router.push("/propertyList");
      // window.location.href = this.$store.state.uiPageName+"#propertyList";
    },
    redirectToClient() {
      // this.isBgClient = true;
      // this.isBgProperty = false;
      // this.isBgRoles = false;
      // this.isBgUsers = false;
      // this.isBgGuests = false;
      // this.isBgUnit = false;
      // this.isBgListManagement = false;
      // this.isBgTax = false;
      // this.isBgledgerAccount = false;
      this.submenuListName = "ClientList";
      this.$router.push("/clientList");
    },
    redirectToUnit() {
      // this.isBgClient = false;
      // this.isBgProperty = false;
      // this.isBgRoles = false;
      // this.isBgUsers = false;
      // this.isBgGuests = false;
      // this.isBgUnit = true;
      // this.isBgListManagement = false;
      // this.isBgTax = false;
      // this.isBgledgerAccount = false;
      this.submenuListName = "UnitList";
      this.$router.push("/unitList");
    },
    redirectToListManagement() {
      // this.isBgClient = false;
      // this.isBgProperty = false;
      // this.isBgRoles = false;
      // this.isBgUsers = false;
      // this.isBgUnit = false;
      // this.isBgGuests = false;
      // this.isBgListManagement = true;
      // this.isBgTax = false;
      // this.isBgledgerAccount = false;
      this.submenuListName = "listManagement";
      this.$router.push("/ListManagement");
    },

    redirectToTaxPage() {
      // this.isBgClient = false;
      // this.isBgProperty = false;
      // this.isBgRoles = false;
      // this.isBgUsers = false;
      // this.isBgUnit = false;
      // this.isBgGuests = false;
      // this.isBgListManagement = false;
      // this.isBgTax = true;
      // this.isBgledgerAccount = false;
      this.submenuListName = "tax";
      this.$router.push("/tax");
    },
    setParentAndSubmenuList() {
      let vm = this;
      console.log("vm.$router.name", vm.$route.name);
      let routerName = vm.$route.name;
      if (
        routerName === "ReservationList" ||
        routerName === "ReservationDetail"
      ) {
        vm.submenuListName = "/";
        vm.parentModuleName = "Reservations";
        vm.submenuListName = "Reservations";
        vm.$store.state.bus.$emit(
          "setParentAndSubmenuListCalendarIcons",
          vm.parentModuleName
        );
      }
      // if(routerName === 'ReservationDetail'){
      //   vm.submenuListName ="";
      //   vm.parentModuleName = "ReservationDetail";
      //   vm.$store.state.bus.$emit('setParentAndSubmenuListCalendarIcons', vm.parentModuleName);
      // }

      if (routerName === "PropertyList" || routerName === "PropertyDetail") {
        vm.submenuListName = "PropertyList";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }

      if (routerName === "ClientList" || routerName === "ClientDetail") {
        vm.submenuListName = "ClientList";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }

      if (routerName === "UnitList" || routerName === "UnitDetail") {
        vm.submenuListName = "UnitList";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }

      if (routerName === "RoleList" || routerName === "RoleDetail") {
        vm.submenuListName = "RoleList";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }

      if (routerName === "Users" || routerName === "UserDetail") {
        vm.submenuListName = "Users";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }

      if (
        routerName === "GuestProfileList" ||
        routerName === "GuestProfileListDetail"
      ) {
        vm.submenuListName = "GuestProfileList";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }

      if (routerName === "listManagement") {
        vm.submenuListName = "listManagement";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }
      if (routerName === "IntegrationPage") {
        vm.submenuListName = "IntegrationPage";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }
      // if (routerName === "PaymentReports") {
      //   vm.submenuListName = "PaymentReports";
      //   vm.parentModuleName = "Admin";

      //   this.$store.state.bus.$emit(
      //     "setParentAndSubmenuListGroupIcons",
      //     vm.parentModuleName
      //   );
      // }

      if (routerName === "tax" || routerName === "taxDetail") {
        vm.submenuListName = "tax";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }
      if (
        routerName === "bookingEngineList" ||
        routerName === "bookingEnginedetail"
      ) {
        vm.submenuListName = "bookingEngineList";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }

      if (
        routerName === "RestrictionList" ||
        routerName === "RestrictionDetail"
      ) {
        vm.submenuListName = "RestrictionList";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }
      if (routerName === "HouseKeepingStatus") {
        vm.submenuListName = "HouseKeepingStatus";
        vm.parentModuleName = "Reservations";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }
      if (routerName === "RatesOverride" || routerName === "RateOverrideList") {
        vm.submenuListName = "RateOverrideList";
        vm.parentModuleName = "Admin";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }
      if (routerName === "RoomInventoryDetail") {
        vm.submenuListName = "RoomInventoryDetail";
        vm.parentModuleName = "Reservations";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }
      if (routerName === "calendarView") {
        vm.submenuListName = "CalendarView";
        vm.parentModuleName = "Reservations";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }
       if (routerName === "PaymentReports") {
        vm.submenuListName = "PaymentReports";
        vm.parentModuleName = "Reservations";

        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }
      if (routerName === "Dashboard") {
        vm.submenuListName = "Dashboard";
        vm.parentModuleName = "Reservations";
        this.$store.state.bus.$emit(
          "setParentAndSubmenuListGroupIcons",
          vm.parentModuleName
        );
      }

      console.log("in setParentAndSubmenuList routerName", routerName);
    },

    redirectToledgerAccount() {
      // this.isBgClient = false;
      // this.isBgProperty = false;
      // this.isBgRoles = false;
      // this.isBgUsers = false;
      // this.isBgUnit = false;
      // this.isBgGuests = false;
      // this.isBgListManagement = false;
      // this.isBgTax = false;
      // this.isBgledgerAccount = true;
      this.submenuListName = "ledgerAccount";
      this.$router.push("/ledgerAccount");
    },
    redirectToHouseKeepingStatus() {
      this.submenuListName = "HouseKeepingStatus";
      this.$router.push("/houseKeepingStatus");
    },
    redirectToBE() {
      this.submenuListName = "bookingEngineList";
      this.$router.push("/bookingEngineList");
    },
    redirectToRestrictions() {
      this.submenuListName = "RestrictionList";
      this.$router.push("/restrictionList");
    },
    redirectToRatesOverride() {
      this.submenuListName = "RateOverrideList";
      this.$router.push("/rateOverrideList");
    }
  },
  computed: {
    isCurrentUserAdmin() {
      //return this.$store.state.isCurrentUserAdmin;
      return true;
    },
    fncIsMenuAdmin() {
      let vm = this;
      if (vm.$store.state.userEntitlementList.hasOwnProperty("fncMenuAdmin"))
        return vm.$store.state.userEntitlementList.hasOwnProperty(
          "fncMenuAdmin"
        );
    },
    fncIsMenuReservations() {
      let vm = this;
      if (
        vm.$store.state.userEntitlementList.hasOwnProperty(
          "fncMenuReservations"
        )
      )
        return vm.$store.state.userEntitlementList.fncMenuReservations;

      return false;
    },
    fncIsUserList() {
      let vm = this;
      if (vm.$store.state.userEntitlementList.hasOwnProperty("fncUserList")) {
        console.log("fncUserList =>", vm.$store.state.userEntitlementList);
        let fncUserList = vm.$store.state.userEntitlementList.fncUserList;
        console.log("fncUserList", fncUserList);
        return fncUserList;
      }
      return null;
    },
    fncIsPropertySelect() {
      let vm = this;
      if (
        vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySelect")
      ) {
        // console.log("fncPropertyList =>",vm.$store.state.userEntitlementList);
        let fncPropertySelect =
          vm.$store.state.userEntitlementList.fncPropertySelect;
        // console.log("fncPropertyList", fncPropertyList)
        //return vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySave") ? vm.$store.state.userEntitlementList.fncPropertySave : null;
        return fncPropertySelect;
      }
      return null;
    },

    fncIsUnitSelect() {
      let vm = this;
      if (vm.$store.state.userEntitlementList.hasOwnProperty("fncUnitSelect")) {
        // console.log("fncPropertyList =>",vm.$store.state.userEntitlementList);
        let fncUnitSelect = vm.$store.state.userEntitlementList.fncUnitSelect;
        // console.log("fncPropertyList", fncPropertyList)
        //return vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySave") ? vm.$store.state.userEntitlementList.fncPropertySave : null;
        return fncUnitSelect;
      }
      return null;
    },

    fncIsRoleSelect() {
      let vm = this;
      if (vm.$store.state.userEntitlementList.hasOwnProperty("fncRoleSelect")) {
        // console.log("fncPropertyList =>",vm.$store.state.userEntitlementList);
        let fncRoleSelect = vm.$store.state.userEntitlementList.fncRoleSelect;
        // console.log("fncPropertyList", fncPropertyList)
        //return vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySave") ? vm.$store.state.userEntitlementList.fncPropertySave : null;
        return fncRoleSelect;
      }
      return null;
    },

    fncIsUnitSelect() {
      let vm = this;
      if (vm.$store.state.userEntitlementList.hasOwnProperty("fncUnitSelect")) {
        // console.log("fncPropertyList =>",vm.$store.state.userEntitlementList);
        let fncUnitSelect = vm.$store.state.userEntitlementList.fncUnitSelect;
        // console.log("fncPropertyList", fncPropertyList)
        //return vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySave") ? vm.$store.state.userEntitlementList.fncPropertySave : null;
        return fncUnitSelect;
      }
      return null;
    },
    fncIsUserSelect() {
      let vm = this;
      if (vm.$store.state.userEntitlementList.hasOwnProperty("fncUserSelect")) {
        // console.log("fncPropertyList =>",vm.$store.state.userEntitlementList);
        let fncUserSelect = vm.$store.state.userEntitlementList.fncUserSelect;
        // console.log("fncPropertyList", fncPropertyList)
        //return vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySave") ? vm.$store.state.userEntitlementList.fncPropertySave : null;
        return fncUserSelect;
      }
      return null;
    },
    fncIsListManagementView() {
      let vm = this;
      if (
        vm.$store.state.userEntitlementList.hasOwnProperty(
          "fncListManagementView"
        )
      ) {
        // console.log("fncPropertyList =>",vm.$store.state.userEntitlementList);
        let fncListManagementView =
          vm.$store.state.userEntitlementList.fncListManagementView;
        // console.log("fncPropertyList", fncPropertyList)
        //return vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySave") ? vm.$store.state.userEntitlementList.fncPropertySave : null;
        return fncListManagementView;
      }
      return null;
    },
    fncIsTaxItemsView() {
      let vm = this;
      if (
        vm.$store.state.userEntitlementList.hasOwnProperty("fncTaxItemsView")
      ) {
        // console.log("fncPropertyList =>",vm.$store.state.userEntitlementList);
        let fncTaxItemsView =
          vm.$store.state.userEntitlementList.fncTaxItemsView;
        // console.log("fncPropertyList", fncPropertyList)
        //return vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySave") ? vm.$store.state.userEntitlementList.fncPropertySave : null;
        return fncTaxItemsView;
      }
      return null;
    },
    fncIsReservationSelect() {
      let vm = this;
      if (
        vm.$store.state.userEntitlementList.hasOwnProperty(
          "fncReservationSelect"
        )
      ) {
        // console.log("fncPropertyList =>",vm.$store.state.userEntitlementList);
        let fncReservationSelect =
          vm.$store.state.userEntitlementList.fncReservationSelect;
        // console.log("fncPropertyList", fncPropertyList)
        //return vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySave") ? vm.$store.state.userEntitlementList.fncPropertySave : null;
        return fncReservationSelect;
      }
      return null;
    },
    fncIsPaymentReport() {
      let vm = this;
      if (
        vm.$store.state.userEntitlementList.hasOwnProperty("fncPaymentsReports")
      ) {
        return vm.$store.state.userEntitlementList.hasOwnProperty(
          "fncPaymentsReports"
        )
          ? vm.$store.state.userEntitlementList.fncPaymentsReports
          : null;
      }
    },
    fncIsSalesReport() {
      let vm = this;
      if (
        vm.$store.state.userEntitlementList.hasOwnProperty("fncFolioReports")
      ) {
        return vm.$store.state.userEntitlementList.hasOwnProperty(
          "fncFolioReports"
        )
          ? vm.$store.state.userEntitlementList.fncFolioReports
          : null;
      }
    },

    // fncIsHousekeepingTaskList(){
    //   let vm = this;
    //   if (
    //     vm.$store.state.userEntitlementList.hasOwnProperty("fncHousekeepingTaskList")
    //   ) {

    //     let fncHousekeepingTaskList =
    //       vm.$store.state.userEntitlementList.fncHousekeepingTaskList;

    //     return fncHousekeepingTaskList;
    //   }
    //   return null;
    // },
    // houseKeeperIcon() {
    //   let vm = this;
    //   if (vm.$store.state.userEntitlementList.hasOwnProperty("fncHousekeepingTaskList") && vm.$store.state.userEntitlementList.hasOwnProperty("fncInchargeTaskListView")) {
    //   }
    //   if(vm.$store.state.userEntitlementList.fncHousekeepingTaskList.isAssigned === 1 && vm.$store.state.userEntitlementList.fncInchargeTaskListView.isAssigned === 1 ){
    //     return true;
    //   }
    //   else{
    //     return false;
    //   }
    // },

    fncIsClientSelect() {
      let vm = this;
      if (
        vm.$store.state.userEntitlementList.hasOwnProperty("fncClientSelect")
      ) {
        // console.log("fncPropertyList =>",vm.$store.state.userEntitlementList);
        let fncClientSelect =
          vm.$store.state.userEntitlementList.fncClientSelect;
        // console.log("fncPropertyList", fncPropertyList)
        //return vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySave") ? vm.$store.state.userEntitlementList.fncPropertySave : null;
        return fncClientSelect;
      }
      return null;
    },
    fncIsRoleList() {
      let vm = this;
      if (vm.$store.state.userEntitlementList.hasOwnProperty("fncRoleList")) {
        console.log("fncRoleList =>", vm.$store.state.userEntitlementList);
        let fncRoleList = vm.$store.state.userEntitlementList.fncRoleList;
        console.log("fncRoleList", fncRoleList);
        return fncRoleList;
      }
      return null;
    },
    fncIsHousekeepingView() {
      let vm = this;
      if (
        vm.$store.state.userEntitlementList.hasOwnProperty("fncHousekeeper") &&
        vm.$store.state.userEntitlementList.hasOwnProperty(
          "fncHousekeepingInspector"
        ) &&
        vm.$store.state.userEntitlementList.hasOwnProperty(
          "fncAssignHousekeeper"
        )
      ) {
        if (
          vm.$store.state.userEntitlementList.fncHousekeeper.isAssigned == -1 &&
          vm.$store.state.userEntitlementList.fncHousekeepingInspector
            .isAssigned == -1 &&
          vm.$store.state.userEntitlementList.fncAssignHousekeeper.isAssigned ==
            -1
        ) {
          return false;
        } else if (
          vm.$store.state.userEntitlementList.fncHousekeeper.isAssigned == 1
        ) {
          return true;
        } else if (
          vm.$store.state.userEntitlementList.fncHousekeepingInspector
            .isAssigned == 1
        ) {
          return true;
        } else if (
          vm.$store.state.userEntitlementList.fncAssignHousekeeper.isAssigned ==
          1
        ) {
          return true;
        }
      }
    }
  },
  watch: {},
  created() {
    let vm = this;
    vm.$store.state.bus.$on("isActiveForCogs", function(selected) {
      if (selected === true) {
        vm.isActiveForReservations = false;
        console.log("this.isActive", vm.isActiveForReservations);
      }
    });
    vm.$store.state.bus.$on("isActiveForUser", function(selected) {
      if (selected === true) {
        vm.isActiveForReservations = false;
        console.log("this.isActive", vm.isActiveForReservations);
      }
    });
    vm.$store.state.bus.$on("IsCalendarIcons", function(selected) {
      console.log("in IsCalendarIcons", selected);
      // submenuListName: "ReservationsList",
      vm.parentModuleName = selected.toString();
      vm.submenuListName = "Reservations";
    });
    vm.$store.state.bus.$on("IsGroupIcons", function(selected) {
      console.log("IsGroupIcons", selected);
      vm.parentModuleName = selected.toString();
      vm.submenuListName = "ClientList";
    });
    vm.$store.state.bus.$on("RefreshParentMenu", function() {
      vm.setParentAndSubmenuList();
    });
  },
  mounted() {
    //this.getData();
    // this.$on('loadA', function (selected) {
    //   console.log("loadA => ", selected);
    // });
    let vm = this;
    // vm.GetUserEntitlementsAndDefaultProperty()
    vm.setParentAndSubmenuList();

    vm.$store.state.bus.$on("setParentAndSubmenuListCalendarIcons", function(
      selected
    ) {
      console.log("selected", selected);
      vm.submenuListName = selected.toString();
      console.log("vm.submenuListName", vm.submenuListName);
      // }
    });
    vm.$store.state.bus.$on("cogs", function(selected) {
      console.log("selected", selected);
      vm.submenuListName = selected.toString();
      console.log("vm.submenuListName", vm.submenuListName);
      // }
    });
    vm.$store.state.bus.$on("calendar", function(selected) {
      console.log("selected", selected);
      vm.submenuListName = selected.toString();
      console.log("vm.submenuListName", vm.submenuListName);
      // }
    });
  }
};
</script>