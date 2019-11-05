<template src="./IntegrationComponent.template.html"></template>
<script>
  export default {
    name: "IntegrationPage",
    props: [""],
    data() {
      return {
        showPanel: false,
        showBEPanel: false,
        url: window.location.protocol + "//" + window.location.host,
        stripeUrl:
          "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_EbEZy2NBGahJqCQvfb7rRcMI0rkmL6gQ&scope=read_write",
        paymentAccountList: [],
        accountEdit: false,
        paymentAccountEdit: null,
        stripeAccount: {},
        statusList: [
          {
            statusName: "Active",
            statusId: 1
          },
          {
            statusName: "Inactive",
            statusId: 0
          },
          {
            statusName: "Obsolete",
            statusId: -1
          },
          {
            statusName: "Remove Integration",
            statusId: -2
          }
        ],
        beStatusList: [
          {
            statusName: "Active",
            statusId: 1
          },
          {
            statusName: "Inactive",
            statusId: 2
          },

        ],
        IsActive: 1,
        IsLive: null,
        beList: [],
        BeIsActive: 1,
      };
    },
    methods: {
      redirectToDetailPage(BE_Id) {
        let vm = this;
        vm.$router.push("/bookingEngineDetail/" + BE_Id);
      },
      getBE_List() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "getBE_List",
          params: {
            ModuleAction: "getBE_List",
            IsActive: vm.BeIsActive
          },
          callback: function (err, response) {
            if (err) {
              console.log("Error in getBE_List => ", err);
              return;
            }
            if (response) {
              console.log("response in getBE_List", response);
              if (response[0]) {
                vm.beList = response[0];
              }

            }
          }
        });
      },
      getAccountDetails(e) {
        let vm = this;
        if (e.target.checked) {
          vm.IsActive = 1;
        } else {
          vm.IsActive = 0;
        }
        vm.Get_PaymentAccount_Details();
      },
      getBeDetail(e) {
        let vm = this;
        if (e.target.checked) {
          vm.BeIsActive = 1;
        } else {
          vm.BeIsActive = 2;
        }
        vm.getBE_List()
      },
      makePaymentAccountDefault(paymentAccount) {
        let vm = this;
        let classsName = "#" + this.paymentAccountEdit;
        $(classsName).removeClass("show");
        paymentAccount.IsDefault = true;
        // vm.Save_Acc_Commission_Config({accountId: paymentAccount.PaymentAccountId,statusId: 1,IsDefault: 1});
        vm.Update_Acc_Commission_Config(paymentAccount);
      },
      removePaymentAccount(paymentAccount, statusId) {
        let vm = this;
        let classsName = "#" + this.paymentAccountEdit;
        $(classsName).removeClass("show");
        // paymentAccount.IsDefault = false;
        paymentAccount.StatusId = statusId;
        // vm.Save_Acc_Commission_Config({accountId: paymentAccount.PaymentAccountId,statusId: paymentAccount.StatusId,IsDefault: paymentAccount.IsDefault});
        vm.Update_Acc_Commission_Config(paymentAccount);
      },
      Update_Acc_Commission_Config(paymentAccount) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Update_Acc_Commission_Config",
          params: {
            ModuleAction: "Update_Acc_Commission_Config",
            propertyId: null,
            unitId: null,
            isClient: false,
            paymentAccount: paymentAccount,
            CommissionPercent: 0,
            CommissionAmmount: null,
            IsLive: vm.IsLive == true ? 1 : 0
          },
          callback: function(err, response) {
            if (err) {
              vm.$store.dispatch("toastr", {
                type: "error",
                message: "Error!",
                header: "unable to update"
              });
              return;
            }
            if (response) {
              console.log("response in Update_Acc_Commission_Config", response);
              if (
                response[0] &&
                response[0].length > 0 &&
                response[0][0].ErrorMessage
              ) {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  message: "Error!",
                  header: "unable to update"
                });
              } else {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "success",
                  message: "Updated the account successfully",

                });
                vm.Get_PaymentAccount_Details();
              }
            }
          }
        });
      },
      removeBookingEngine(be, statusId) {
        let vm = this;
        console.log("be-statusId", be);
        // let bename = be.BE_Name;
        //  vm.BeIsActive = statusId;
        // vm.$store.state.bus.$emit('SaveBEDomainSettings', bename, statusId);

        vm.Update_BEStatus(statusId, be);
      },




      Update_BEStatus(StatusId, be) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Update_BEStatus",
          params: {
            ModuleAction: "Update_BEStatus",
            BE_Id: be.BE_Id,
            StatusId: StatusId,
          },

          callback: function (err, response) {
        
          
            if (err) {
              console.log("Error in Update_BEStatus => ", err);
              return;
            }

            if (response) {

             console.log("Save_BEDomainSettingsresponse",response);
             vm.$store.dispatch("toastr", {
              type: "success",
              message: "Updated the BookingEngine successfully",
              header: ""
            });

             vm.getBE_List()
            }
           

          }
          

        });
        
      },
      showAccountEdit(index) {
        let vm = this;
        setTimeout(function() {
          vm.paymentAccountEdit = "accountEdit" + index;
          let classsName = "#" + vm.paymentAccountEdit;
          $(classsName).addClass("show");
        }, 10);
      },
      showSidePanel(e,integrationName) {
        let vm = this;
        e.stopPropagation();
        if(integrationName == "Stripe"){
          vm.showPanel = true;
          vm.showBEPanel = false;
          vm.IsActive = 1;
          vm.Get_PaymentAccount_Details();
        }
        if(integrationName == "BE"){
          vm.showPanel = false;
          vm.showBEPanel = true;
          vm.BeIsActive = 1;
          vm.getBE_List()
        }
      },
      hideSidePanel() {
        let vm = this;
        vm.showPanel = false;
        vm.showBEPanel = false;
      },
      connectToStripe() {
        let vm = this;
        let stateObj = {
          url: window.location.protocol + "//" + window.location.host,
          SecretKey: vm.stripeAccount.SecretKey,
        };
        stateObj = JSON.stringify(stateObj);
        console.log(vm.stripeAccount);
        let hostname =
          window.location.hostname == "localhost"
            ? "192.168.1.222"
            : window.location.hostname;
        let apiUrl =
          window.location.protocol +
          "//" +
          hostname +
          (window.location.port ? ":1339" : "");
        let uriVal = apiUrl + "/getConnectAccountId";
        vm.stripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${
          vm.stripeAccount.GatewayClientId
          }&scope=read_write&redirect_uri=${uriVal}&state=${stateObj}`;
      },
      Save_Acc_Commission_Config(account) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Save_Acc_Commission_Config",
          params: {
            ModuleAction: "Save_Acc_Commission_Config",
            accountId: account.accountId,
            gateWayId: 1,
            stripeTestKey: vm.stripeAccount.SecretKey,
            statusId: account.statusId,
            IsDefault: account.IsDefault
          },
          callback: function(err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in Save_Acc_Commission_Config", response);
              if (
                response[0] &&
                response[0].length > 0 &&
                response[0][0].ErrorMessage
              ) {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  message: "Error!",
                  header: "unable to create account"
                });
              } else {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  message: "",
                  header: "Successfully created the account"
                });
                vm.Get_PaymentAccount_Details();
              }
            }
          }
        });
      },
      redirectUrl() {
        let vm = this;
        const queryStringObj = this.getQueryStringObj();
        if (queryStringObj) {
          window.location = window.location.href.split("?")[0];
          vm.showPanel = true;
          if (queryStringObj.code && queryStringObj.code != "null") {
            vm.Save_Acc_Commission_Config({
              accountId: queryStringObj.code,
              statusId: 1,
              IsDefault: 0
            });
          } else if (queryStringObj.error) {
            return;
          }
        }
      },
      getQueryStringObj() {
        var sPageURL = window.location.href.split("?")[1];
        if (sPageURL) {
          return sPageURL
            .split("&")
            .reduce((acc, queryParam, queryParamIndex) => {
              const queryParamArray = queryParam.split("=");
              acc[queryParamArray[0]] = queryParamArray[1];
              return acc;
            }, {});
        } else {
          return null;
        }
      },
      Get_PaymentAccount_Details() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_PaymentAccount_Details",
          params: {
            ModuleAction: "Get_PaymentAccount_Details",
            propertyId: null,
            unitId: null,
            isClient: false,
            IsActive: vm.IsActive
          },
          callback: function(err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in Get_PaymentAccount_Details", response);
              vm.stripeAccount = response[1][0];
              vm.IsLive = response[3][0].IsLive
              vm.connectToStripe();
              vm.paymentAccountList.splice(
                0,
                vm.paymentAccountList.length,
                ...response[2]
              );
              vm.redirectUrl();
            }
          }
        });
      }
    },
    computed: {},
    mounted() {
      let vm = this;
      vm.Get_PaymentAccount_Details();
      vm.getBE_List()
      $(document).click(function(e) {
        let classsName = "#" + vm.paymentAccountEdit;
        $(classsName).removeClass("show");
      });
    },
    watch: {}
  };
</script>