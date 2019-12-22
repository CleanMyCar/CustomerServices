<template src="./headerComponent.template.html"></template>

<script>
  // const socket = require('socket.io');


  export default {
    // options

    name: 'headerMenu',
    props: [],
    data() {
      return {
        apiUrl: window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":1339" : ''),
        notificationList: [],
        userImage: "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png",
        unreadCount: 0,
        clear: false,
        cartSummary: null
      };
    },
    methods: {
      toggleNotification() {
        this.isActiveForNotification = true;
        $("#notification").toggleClass("expand");
        $(".menuMaskN").toggle();
        if ($("#cartPanel").hasClass("expand")) {
          $("#cartPanel").toggleClass("expand");
          $(".carNotoficationButton").toggleClass("active");
          $(".menuMask").toggle();
        }
      },
      toggleCartPanel() {
        $("#cartPanel").toggleClass("expand");
        $(".carNotoficationButton").toggleClass("active");
        $(".menuMask").toggle();
        if ($("#notification").hasClass("expand")) {
          $("#notification").toggleClass("expand");
          $(".menuMaskN").toggle();
        }
      },
      logout() {
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
      redirectToChangePassword: function () {
        window.location.href = this.$store.state.uiPageName + "#password";
      },

      navigateToUserProfile: function () {
        this.isActiveForUser = true;
        this.isActiveForCogs = false;
        window.location.href = this.$store.state.uiPageName + "#userProfile";
        this.$store.state.bus.$emit('isActiveForUser', this.isActiveForUser);
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
      getCartProducts() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetUserCartProductSummary",
          params: {},
          callback: function (err, response) {
            if (err) {
              return;
            }
            vm.cartSummary = response;
          }
        });
      },
      getApplicationMetaData() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetApplicationMetaData",
          params: {},
          callback: function (err, response) {
            if (err) {
              return;
            }
            vm.$store.state.countryStateCities = response;
          }
        });
      }
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
      }
    },
    created() {
    },
    watch: {
    },
    mounted() {
      //this.getNotifications1();
      let vm = this;
      vm.getUserDetails();
      vm.getCartProducts();
      vm.getApplicationMetaData();
      vm.$store.state.bus.$on('refreshCart', function (params) {
        vm.getCartProducts();
      })
    }
  }

</script>