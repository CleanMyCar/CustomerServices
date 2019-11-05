<template src="./clientDetailVue.template.html"></template>
<script>
  import Vue from "vue";
  import VeeValidate from "vee-validate";
  import * as axios from "axios";

  Vue.use(VeeValidate);

  const phoneOrEmailRule = {
    getMessage(field, args) {
      return `The ${field} must be a valid phone number`;
    },
    validate(value, args) {
      // Custom regex for a phone number
      const MOBILEREG = /^[- +()]*[0-9][- +()0-9]*/;

      // Check for either of these to return true
      return VeeValidate.Rules.email(value) || MOBILEREG.test(value);
    }
  };
  VeeValidate.Validator.extend("phone", phoneOrEmailRule);
  export default {
    name: "clientDetailComponent",
    validator: null,
    props: ["clientId"],

    data() {
      return {
        apiUrl:
          window.location.protocol +
          "//" +
          window.location.hostname +
          (window.location.port ? ":1339" : ""),
        clientID: -1,
        isBgColor1: true,
        isBgColor2: false,
        isBgColor3: false,
        isBgColor4: false,
        isBgColor5: true,
        isBgColor6: false,
        showMap: false,
        // saveClientInfo: true,
        // savemap: false,
        showClientInfo: true,
        isCitySelected: false,

        emailRegEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

        checkedCategories: [],
        clicks: 1,

        status: {},
        Client_Status: {},
        StatusId: null,
        saveclientdetails: {
          basicData: {
            StatusId: null
          },
          mailingData: {},

          billingData: {},
          PolicyData: {},
          clientContent: {},
          systemSettingData: {}
        },
        imageData: [],
        imageArr: [],
        clientImages: [],
        tagNames: [],
        clientWeekdays: [],
        countryList: [],
        timeZoneList: [],
        statusList: [],
        currencyList: [],
        policyList: [],
        propertyCount: [],
        unitCount: [],
        isDisabled: false,
        stateList: [],
        smtpServices: [],
        displaySectionValue: "clientInfo",
        selectedCityObj: {},
        selectedStateAndCountry: {},
        propertymore: "more",
        displayDropdowns: {
          TimeZone: null,
          mailingCountryName: null,
          billingCountryName: null,
          basicCurrencyName: null
        },
        searchCity: "",
        searchCountry: "",
        searchState: "",
        CityName: "",
        cityList: [],
        WeekEndList: [],

        ContentId: -1,

        tagname: null,
        showDes: true,

        showPolicy: true,
        showPolicies: false,
        logo: "",
        visible: false,
        index: 0,
        imgs: [],
        selectedImageId: null,
        showpolicybutton: false,
        checkboxenable: true,
        // showicon: true,
        entitlements: {},
        Tagdisable: true,
        showConnectToStripe: false,
        accountList: [
          {
            name: "deekshitha",
            accountId: "acct_1ED8aUJ93Ik4El3q"
          },
          {
            name: "bob",
            accountId: "acct_1EAuCsIfgqbN94ww"
          }
        ],
        stripeUrl:
          "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_EbEZy2NBGahJqCQvfb7rRcMI0rkmL6gQ&scope=read_write",
        paymentAccountList: [],
        accountEdit: false,
        paymentAccountEdit: null,
        differentPaymentAccountPropertyList: [],
        defultAccountProperties: false,
        editDefault: true,
        usedProperties: null,
        usedPropertyList: [],
        usedUnitList: [],
        usedUnits: null,
        commissionPercentColor: null,
        accountStatusList: [
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
        IsActive: 1,
        CommissionAmount: null,
        commissionPercent: null
      };
    },

    methods: {

      resetAddress() {
        let vm = this;
        vm.saveclientdetails.basicData.Address1 = "";
        vm.$set(vm.saveclientdetails.basicData, "PostalCode", "");
        // this.$set(this.saveclientdetails.basicData, 'CityName', addressData.locality);
        vm.CityName = "";
        vm.$set(vm.saveclientdetails.basicData, 'StateName', "");
        vm.$set(vm.saveclientdetails.basicData, 'CountryName', "");


      },

      // getAddress(address) {
      //   let vm = this;
      //   console.log("address", address);
      //   vm.saveclientdetails.basicData.Address2 = address;

      //   console.log("vm.saveclientdetails.basicData.Address2", vm.saveclientdetails.basicData.Address2);
      // },
      getAddressData: function (addressData, placeResultData, id) {
        // this.address = addressData;
        if (addressData && addressData.street_number && addressData.route) {
          this.saveclientdetails.basicData.Address1 = addressData.street_number + ', ' + addressData.route;
        }
        else {
          this.saveclientdetails.basicData.Address1 = addressData.route;
        }
        if (addressData && addressData.locality) {
          this.CityName = addressData.locality;
        }
        else if (addressData && addressData.administrative_area_level_2) {

          this.CityName = addressData.administrative_area_level_2;
        }
        else {

          this.CityName = "";
        }

        console.log("addressDataaddressData", addressData);
        this.$set(this.saveclientdetails.basicData, "PostalCode", addressData.postal_code);
        // this.$set(this.saveclientdetails.basicData, 'CityName', addressData.locality);
        // this.CityName = addressData.locality;
        this.$set(this.saveclientdetails.basicData, 'StateName', addressData.administrative_area_level_1);
        this.$set(this.saveclientdetails.basicData, 'CountryName', addressData.country);
        this.$set(this.saveclientdetails.basicData, 'shortAddress', this.saveclientdetails.basicData.Address1);
        // console.log("this.guestInfo.PostalCode", this.guestInfo.PostalCode);
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
      changeInCommisssion() {
        let vm = this;
        vm.commissionPercentColor = "yellowColor";
      },
      showUsedPropertyList(paymentAccount) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetConnectedObjects_PaymentAccount",
          params: {
            ModuleAction: "GetConnectedObjects_PaymentAccount",
            PaymentAccountId: paymentAccount.PaymentAccountId,
            PropertyId: null
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log(response);
              vm.usedProperties = response[0][0].ConnectedProperties;
              vm.usedPropertyList.splice(
                0,
                vm.usedPropertyList.length,
                ...response[1]
              );
              vm.usedUnits = response[2][0].ConnectedUnits;
              vm.usedUnitList.splice(0, vm.usedUnitList.length, ...response[3]);
              console.log("vm.usedPropertyList", vm.usedPropertyList);
            }
          }
        });
      },
      editDefaultValue(e) {
        let vm = this;
        if (e.target.checked) {
          vm.saveclientdetails.basicData.UseDefault = 1;
          // vm.getClientDetailByid();
          //CommissionAmount: null,
          //commissionPercent: null
          vm.CommissionAmount =
            vm.saveclientdetails.basicData.DefaultCommissionAmount;
          vm.commissionPercent =
            vm.saveclientdetails.basicData.DefaultCommissionType;
          if (vm.commissionPercent == true) {
            vm.commissionPercent = 1;
          } else if (vm.commissionPercent == false) {
            vm.commissionPercent = 0;
          }
          vm.editDefault = true;
        } else {
          vm.saveclientdetails.basicData.UseDefault = 0;
          vm.editDefault = false;
          vm.CommissionAmount = vm.saveclientdetails.basicData.CommissionAmount;
          vm.commissionPercent = vm.saveclientdetails.basicData.IsPercent;
          if (vm.commissionPercent == true) {
            vm.commissionPercent = 1;
          } else if (vm.commissionPercent == false) {
            vm.commissionPercent = 0;
          }
        }
      },
      makePaymentAccountDefault(paymentAccount, event) {
        let vm = this;
        event.stopPropagation();
        let classsName = "#" + this.paymentAccountEdit;
        $(classsName).removeClass("show");
        paymentAccount.IsDefault = true;
        vm.Update_Acc_Commission_Config(paymentAccount);
      },
      removePaymentAccount(paymentAccount, statusId) {
        let vm = this;
        let classsName = "#" + this.paymentAccountEdit;
        $(classsName).removeClass("show");
        paymentAccount.StatusId = statusId;
        paymentAccount.IsDefault = false;
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
            isClient: true,
            paymentAccount: paymentAccount,
            CommissionPercent: vm.commissionPercent,
            CommissionAmmount: vm.CommissionAmount,
            UseDefault: vm.saveclientdetails.basicData.UseDefault,
            IsLive: vm.saveclientdetails.basicData.IsLive
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in Get_PaymentAccount_Details", response);
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
                  message: "Updated the account successfully",
                  header: ""
                });
                vm.Get_PaymentAccount_Details();
                vm.getClientDetailByid();
              }
            }
          }
        });
      },
      showAccountEdit(index, e) {
        let vm = this;
        e.stopPropagation()
        setTimeout(function () {
          vm.paymentAccountEdit = "accountEdit" + index;
          let classsName = "#" + vm.paymentAccountEdit;
          $(classsName).addClass("show");
        }, 10);
      },
      redirectUrl() {
        let vm = this;
        if (window.location.href.split("/")[6]) {
          let redirectLocation = window.location.href.split("/?");
          console.log(
            "window.location.href==>",
            redirectLocation[1].split("status=")[1]
          );
          window.location = redirectLocation[0];
          // vm.$router.push("/clientDetail/" + window.location.href.split("/")[5]);
        }
      },
      savePaymentSetupDetails() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Save_Acc_Commission_Config",
          params: {
            ModuleAction: "Save_Acc_Commission_Config",
            paymentSetupDetails: vm.saveclientdetails.basicData,
            propertyId: null,
            UnitId: null
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in Save_Acc_Commission_Config", response);
            }
          }
        });
      },
      SelectGateWayType(gateWay) {
        let vm = this;
        if (gateWay == "stripe") {
          vm.showConnectToStripe = true;
          let stateObj = {
            paramName: "clientDetail",
            UnitId: null,
            propertyId: null,
            clientId: vm.clientID,
            url: window.location.protocol + "//" + window.location.host
          };
          stateObj = JSON.stringify(stateObj);
          vm.stripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_EbEZy2NBGahJqCQvfb7rRcMI0rkmL6gQ&scope=read_write&state=${stateObj}`;
          console.log("vm.stripeUrl", vm.stripeUrl);
        } else {
          vm.showConnectToStripe = false;
        }
      },
      // fncIsHousekeepingTaskList() {
      //   let vm = this;
      //   if (vm.entitlements.fncHousekeepingTaskList.isAssigned === 1) {
      //     vm.showicon = false;
      //   }
      //   else {
      //     vm.showicon = true;
      //   }
      // },
      tagDisabling() {
        let vm = this;
        if (vm.entitlements.fncClientUpdate.isAssigned === -1) {
          vm.Tagdisable = false;
        } else {
          vm.Tagdisable = true;
        }
      },

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
              console.log(
                "response in GetUserEntitlementsAndDefaultProperty",
                response
              );
              vm.UserProperties = response.properties;
              vm.entitlements = response.userEntitlementList;
              // vm.fncIsHousekeepingTaskList();
              vm.tagDisabling();

              // vm.DefaultProperty = response.defaultPropertyId;
            }
          }
        });
      },
      getImageId(id) {
        this.selectedImageId = id;
      },

      imageURLS(imgGuid) {
        let isBase64 = /^data:image\/([a-zA-Z]*);base64,([^\"]*)/.test(imgGuid);
        if (isBase64) {
          return imgGuid;
        }
        return this.apiUrl + "/downloadImage/" + imgGuid + "/430x300";
      },
      show(index) {
        let scope = this;
        scope.imgs = [];
        scope.index = index;
        scope.visible = true;
        for (var x in scope.imageArr) {
          scope.imgs.push(
            this.apiUrl + "/downloadImage/" + scope.imageArr[x].ImageUrl + "/null"
          );
        }
      },
      handleHide() {
        this.visible = false;
      },
      // showDescription: function () {

      // },
      showLocationMap: function () {
        this.showClientInfo = !this.showClientInfo;
        this.showMap = !this.showMap;
        // this.saveClientInfo = !this.saveClientInfo
        // this.savemap = !this.savemap
      },
      showEniterContent(index) {
        let scope = this;
        // scope.policyList[index].showLess = !scope.policyList[index].showLess;
        // scope.policyList[index].showMore = !scope.policyList[index].showMore;
        // if (scope.policyList[index].showLess == true && scope.policyList[index].showMore == false) {

        // scope.policyList[index].showcontent = '..More'
        // console.log("scope.policyList[index].showLess", scope.policyList[index].showcontent)
        // }
        // else {
        console.log(
          "scope.policyList[index].showless",
          scope.policyList[index].showlesscontent
        );
        scope.policyList[index].showcontent = "Show Less";
        scope.policyList[index].showlesscontent = scope.policyList[index].Content;
        console.log(
          "scope.policyList[index].showMore",
          scope.policyList[index].Content
        );
        // }
      },

      removeTags: function (tag) {
        let scope = this;
        scope.tagNames.splice(this.tagNames.indexOf(tag), 1);
      },
      addTags: function () {
        let vm = this;
        vm.tagNames.push(vm.tagname);
      },

      removeImage(images) {
        let scope = this;
        var index = scope.clientImages.indexOf(images);
        console.log("index============>", index);
        if (index > -1) {
          scope.clientImages.splice(index, 1);
        }
      },
      deletelogo(logo) {
        let vm = this;
        console.log("deleting logo", logo);
        vm.logo = "";
        // vm.SaveClientContentDetails();
      },

      addToLoop: function (number) {
        let vm = this;
        vm.showpolicybutton = true;
        vm.policyList.push({});
      },
      //     removeDummy:function() {
      //  var elem = document.getElementById('dummy');
      //  elem.parentNode.removeChild(elem);
      // },
      // onChangeCity: function (CityId) {
      //   let vm = this;
      //   $('.searchResultsCities').hide();
      //   console.log("in change method", CityId)
      //   vm.$store.dispatch("dataRequestHandler", {
      //     key: "GetCityStateCountryById",
      //     params: {
      //       ModuleAction: "GetCityStateCountryById",
      //       CityId: CityId
      //     },
      //     callback: function (err, response) {
      //       if (err) {
      //         return;
      //       }
      //       if (response) {
      //         console.log("response in GetCityStateCountryById", response);
      //         let selectedoptions = null;
      //         selectedoptions = response;
      //         vm.selectedStateAndCountry = selectedoptions;
      //         vm.selectedStateAndCountry.CityId = selectedoptions.CityId;
      //         vm.selectedStateAndCountry.CountryId = selectedoptions.CountryId;
      //         vm.selectedStateAndCountry.StateId = selectedoptions.StateId;

      //         vm.searchCity = selectedoptions.CityName;
      //         vm.saveclientdetails.basicData.mailingcity = selectedoptions.CityId;
      //         vm.saveclientdetails.basicData.billingcity = selectedoptions.CityId;
      //         vm.saveclientdetails.basicData.mailingstate = selectedoptions.StateId;
      //         vm.saveclientdetails.basicData.billingstate = selectedoptions.StateId;
      //         vm.saveclientdetails.basicData.mailingcountryID = selectedoptions.CountryId;
      //         vm.saveclientdetails.basicData.billingcountryID = selectedoptions.CountryId;
      //         vm.saveclientdetails.basicData.CountryName = selectedoptions.CountryName;
      //         vm.saveclientdetails.basicData.CityName = selectedoptions.CityName;
      //         vm.saveclientdetails.basicData.CountryName = selectedoptions.CountryName;
      //         vm.saveclientdetails.basicData.CityName = selectedoptions.CityName;
      //         // console.log("vm.selectedCountryObj.CountryName", vm.selectedStateAndCountry.CountryName)
      //         // console.log("vm.selectedStateObj.StateName", vm.selectedStateAndCountry.StateName)
      //       }
      //     }
      //   })
      // },

      onChangeCity: function (CityId) {
        let vm = this;
        $(".searchResultsCities").hide();
        //console.log("in change method", CityId)
        vm.isCitySelected = true;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetCityStateCountryById",
          params: {
            ModuleAction: "GetCityStateCountryById",
            CityId: CityId
          },
          callback: function (err, response) {
            if (err) {
              console.log("Error in change city => ", err);
              return;
            }
            if (response) {
              //console.log("response in GetCityStateCountryById", response);
              let selectedoptions = null;
              selectedoptions = response;
              vm.searchCityOldValue = selectedoptions.CityName;
              vm.searchCountryOldValue = selectedoptions.CountryName;
              vm.searchStateOldValue = selectedoptions.StateName;
              vm.selectedStateAndCountry = selectedoptions;
              // vm.saveclientdetails.basicData.CityName = selectedoptions.CityName;
              vm.saveclientdetails.basicData.CountryName =
                selectedoptions.CountryName;
              vm.saveclientdetails.basicData.StateName =
                selectedoptions.StateName;
              vm.searchCity = selectedoptions.CityName;
              vm.searchCountry = selectedoptions.CountryName;
              vm.searchState = selectedoptions.StateName;
              vm.cityList = [];
              vm.isCitySelected = true;
            }
          }
        });
      },

      onChangeState: function (state) {
        let vm = this;
        $(".searchResultsCities").hide();
        // vm.selectedStateAndCountry.StateName = state.StateName;
        // vm.selectedStateAndCountry.StateId = state.StateId;
        // vm.searchStateOldValue = state.StateName
        // vm.searchState = state.StateName;
        // vm.stateList = [];
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetCountryByStateId",
          params: {
            ModuleAction: "GetCountryByStateId",
            StateId: state.StateId
          },
          callback: function (err, response) {
            if (err) {
              console.log("Error in change city => ", err);
              return;
            }
            if (response) {
              console.log("response in GetCountryByStateId", response);
              vm.selectedStateAndCountry.StateName = response[0][0].StateName;
              vm.selectedStateAndCountry.StateId = response[0][0].StateId;
              vm.selectedStateAndCountry.CountryName = response[0][0].CountryName;
              vm.selectedStateAndCountry.CountryId = response[0][0].CountryId;
              vm.searchStateOldValue = response[0][0].StateName;
              vm.searchCountryOldValue = response[0][0].CountryName;
              vm.searchCountry = response[0][0].CountryName;
              vm.searchState = response[0][0].StateName;
            }
          }
        });
      },

      onChangeCountry: function (country) {
        let vm = this;
        $(".searchResultsCities").hide();
        vm.selectedStateAndCountry.CountryName = country.CountryName;
        vm.selectedStateAndCountry.CountryId = country.CountryId;
        vm.searchCountryOldValue = country.CountryName;
        vm.searchCountry = country.CountryName;
        vm.countryList = [];
      },
      createNewInstance: function () {
        let uiPageName = this.$store.state.uiPageName;
        window.location.href = uiPageName + "#user/0";
      },

      changeMethod(field) {
        if (
          this.saveclientdetails.basicData.UseMailingInfo === true &&
          this.saveclientdetails.billingData.hasOwnProperty(field) &&
          this.saveclientdetails.mailingData.hasOwnProperty(field)
        ) {
          this.saveclientdetails.billingData[
            field
          ] = this.saveclientdetails.mailingData[field];
        }
      },

      addClientInformation: function () {
        let vm = this;

        this.$validator.validateAll().then(result => {
          //     let Email = vm.propertyData.basicData.Email;
          //     if (!vm.emailRegEx.test(Email)) {
          //   //console.log("Invalid email");
          //   vm.$store.dispatch("toastr", {
          //     type: "warning",
          //     message: "Please enter valid E-mail Id",
          //     header: "Email"
          //   });
          //   return;
          // }
          if (vm.isCitySelected == false) {
            vm.selectedStateAndCountry.CityId = null;
          }

          if (result) {
            console.log(
              "vm.clientID",
              vm.selectedStateAndCountry.CityId +
              "-" +
              vm.selectedStateAndCountry.StateId +
              "-" +
              vm.selectedStateAndCountry.CountryId
            );
            console.log("status", vm.saveclientdetails.basicData.StatusId);
            console.log("clientInformation");

            // if (
            //   vm.selectedStateAndCountry.CountryId == null ||
            //   vm.selectedStateAndCountry.StateId == null
            // ) {
            //   vm.$store.dispatch("toastr", {
            //     type: "warning",
            //     header: "Warning",
            //     message: "Please select state and country from dropdown!"
            //   });
            // } else {
            vm.$store.dispatch("dataRequestHandler", {
              key: "SaveClientDetails",
              params: {
                section: "ClientInfo",
                clientId: vm.clientID,
                basicData: vm.saveclientdetails.basicData,
                CityName: vm.CityName,
                StatusId: vm.Client_Status.StatusId,
                CityId: null, //vm.selectedStateAndCountry.CityId,
                StateId: null, //vm.selectedStateAndCountry.StateId,
                CountryId: null, //vm.selectedStateAndCountry.CountryId,
                clientContent: vm.saveclientdetails.clientContent
              },

              callback: function (error, response) {
                console.log("basic response", response);
                if (error) {
                  console.error("Error has occured => ", error);
                  vm.$store.dispatch("toastr", {
                    type: "error",
                    header: "Client Info Error!",
                    message: error.sqlMessage ? error.sqlMessage : error
                  });
                  return;
                } else if (response) {
                  if (
                    (response.recordsets[1][0] &&
                      response.recordsets[0][0].ErrorMessage === "") ||
                    response.recordsets[0][0].ErrorMessage === null ||
                    response.recordsets[0][0].ErrorMessage === "null"
                  ) {
                    console.log("addClientInformation===>", response);
                    vm.clientID = response.recordsets[1][0].ClientId;
                    console.log("clientID addClientInformation", vm.clientID);

                    vm.$store.dispatch("toastr", {
                      type: "success",
                      header: "Success!",
                      message: "client Info successfully saved"
                    });
                  } else {
                    vm.$store.dispatch("toastr", {
                      type: "error",
                      header: "Error While saving",
                      message: response.recordsets[0][0].ErrorMessage
                    });
                  }
                }

                // if (response) {
                //   if (response.recordsets[0][0].ErrorMessage !== "" || response.recordsets[0][0].ErrorMessage !== null || response.recordsets[0][0].ErrorMessage !== "null") {
                //     vm.$store.dispatch("toastr", {
                //       type: "error",
                //       header: "Error While saving",
                //       message: response.recordsets[0][0].ErrorMessage
                //     });
                //   }
                // }

                let clientID = response.recordsets[1][0].ClientId;
                vm.$router.push("/clientDetail/" + clientID);
              }
            });
            // }
          }
        });

        // }
        //   }
        // });
      },

      addClientMailingInformation: function () {
        console.log("mailinginformation");
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "SaveClientDetails",
          params: {
            section: "ClientMailingInfo",
            clientId: this.saveclientdetails.basicData.ClientId,
            mailingData: this.saveclientdetails.mailingData
          },
          callback: function (error, response) {
            console.log("mailing response", response);
            if (error) {
              console.error("Error has occured => ", error);
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "mailing Info Error!",
                message: error.sqlMessage ? error.sqlMessage : error
              });
              return;
            } else {
              var clientIdURL = response.recordsets[2][0].ClientId;

              vm.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: "mailing Info successfully saved"
              });

              vm.saveclientdetails.basicData.ClientId = clientIdURL;
              vm.$router.push(
                "/clientDetail/" + vm.saveclientdetails.basicData.ClientId
              );
            }
          }
        });
      },
      // addClientBillingInformation: function () {

      //   console.log("BillingInformation");
      //   let vm = this;
      //   vm.$store.dispatch("dataRequestHandler", {
      //     key: "SaveClientDetails",
      //     params: {
      //       section: "ClientBillingInfo",
      //       clientId: this.saveclientdetails.basicData.ClientId,
      //       billingData: this.saveclientdetails.billingData,
      //       UseMailingInfo: this.saveclientdetails.basicData.UseMailingInfo
      //     },
      //     callback: function (error, response) {
      //       console.log("billing response", response);
      //       if (error) {
      //         console.error("Error has occured => ", error);
      //         vm.$store.dispatch("toastr", {
      //           type: "error",
      //           header: "billing Info Error!",
      //           message: error.sqlMessage ? error.sqlMessage : error
      //         });
      //         return;
      //       } else {
      //         var clientIdURL = response.recordsets[2][0].ClientId;
      //         vm.$store.dispatch("toastr", {
      //           type: "success",
      //           header: "Success!",
      //           message: "billing Info successfully saved"
      //         });

      //         vm.saveclientdetails.basicData.ClientId = clientIdURL;
      //         vm.$router.push(
      //           "/clientDetail/" + vm.saveclientdetails.basicData.ClientId
      //         );
      //       }
      //     }
      //   });

      // },
      // saveSystemSettings: function () {
      //   let vm = this;
      //   console.log("vm.saveclientdetails.basicData in saveSystemSettings", vm.saveclientdetails.basicData)
      //   vm.$store.dispatch("dataRequestHandler", {
      //     key: "SaveClientDetails",
      //     params: {
      //       section: "SystemSettings",

      //       ClientId: vm.$route.params.clientId,
      //       systemSettingData: vm.saveclientdetails.basicData,

      //     },
      //     callback: function (err, response) {
      //       if (err) {

      //         console.error("Error has occured => ", err);
      //         vm.$store.dispatch("toastr", {
      //           type: "error",
      //           header: "error!",
      //           message: error.sqlMessage ? error.sqlMessage : err
      //         });
      //         return;
      //       }
      //       else if (response) {

      //         vm.$store.dispatch("toastr", {
      //           type: "success",
      //           header: "Success!",
      //           message: "successfully systemSetting saved"
      //         });
      //         vm.getClientDetailByid();
      //       }

      //     },

      //   })

      // },

      // ClientListRendering : function(){
      //   let vm = this;
      //   var clientIdURL = response.recordsets[1][0].ClientId;
      //   vm.saveclientdetails.basicData.ClientId = clientIdURL;
      //             vm.$router.push(
      //               "/clientDetail/" + vm.saveclientdetails.basicData.ClientId
      //             );
      // },

      // processImage(e) {
      //   let files = e.target.files || e.dataTransfer.files;
      //   if (!files.length) {
      //     this.saveclientdetails.basicData.processImage = null;
      //     return;
      //   } else {
      //     this.createImage(files[0]);
      //   }
      // },
      // createImage(file) {
      //   let reader = new FileReader();
      //   let vm = this;
      //   reader.onload = e => {
      //     vm.image = e.target.result;
      //     this.saveclientdetails.basicData.processImage = vm.image;

      //   };
      //   reader.readAsDataURL(file);
      // },

      processLogo(e, isLogo) {
        let vm = this;
        if (vm.clientID === -1) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "can't upload  until first section details get saved"
          });
        } else {
          this.imageData = [];
          let files = e.target.files || e.dataTransfer.files;
          this.imageData.push(files[0]);
          console.log("isLogo", isLogo);
          if (!files.length) {
            this.saveclientdetails.clientContent.ClientLogo = null;
            return;
          } else {
            this.createImage(files[0], isLogo);
          }
        }
      },
      createImage(file, isLogo) {
        let reader = new FileReader();
        let vm = this;
        reader.onload = e => {
          vm.image = e.target.result;
          // vm.saveclientdetails.clientContent.ClientLogo = vm.image;
          // console.log("image===================>",vm.image)
          // vm.clientImages.push(vm.image);
          const formData = new FormData();
          Array.from(Array(this.imageData.length).keys()).map(x => {
            formData.append("photos", this.imageData[x], this.imageData[x].name);
          });
          // console.log(apiUrl + '/upload')
          let url = this.apiUrl + "/upload";

          if (isLogo == 0) {
            let obj = {};
            obj.ImageUrl = vm.image;
            obj.ImageId = -1;

            vm.imageArr.push(obj);

            axios.post(url, formData).then(data => {
              console.log(data.data);
              vm.imageData.splice(0, vm.imageData.length);
              for (let img of data.data) {
                // vm.imageArr.push(apiUrl + '/downloadImage/' + img.imageGuid)
                let obj = {};
                obj.ImageUrl = img.imageGuid;
                obj.ImageId = -1;
                // vm.imageArr.splice(-1,1);
                vm.imageData.push(obj);
              }
              // console.log(vm.imageArr)
              vm.saveImages();
            });
          } else {
            axios.post(url, formData).then(data => {
              console.log(data.data);
              vm.imageData.splice(0, vm.imageData.length);
              console.log("imageDataimageData=>", vm.imageData);
              for (let img of data.data) {
                vm.logo = img.imageGuid;
              }
            });
          }

          // console.log("base64" + vm.image);
        };
        reader.readAsDataURL(file);
      },
      getClientDetailByid: function () {
        let scope = this;
        console.log("In viewclientdetail" + scope.$route.params.clientId);
        scope.$store.dispatch("dataRequestHandler", {
          key: "GetClientDetailById",
          params: {
            ModuleAction: "GetClientDetailById",
            ClientId: scope.$route.params.clientId
          },
          callback: function (err, response) {
            console.log("GetClientDetailById===========>", response);
            if (
              response &&
              response.recordsets[12] &&
              response.recordsets[12].length > 0
            ) {
              scope.smtpServices = response.recordsets[12];
            }

            if (
              response &&
              Array.isArray(response.recordsets) &&
              response.recordsets.length > 7
            ) {
              // console.log("got the response =>", JSON.stringify(response));
              scope.countryList = response.recordsets[1];
              scope.timeZoneList = response.recordsets[2];
              scope.statusList = response.recordsets[3];
              console.log("getClientDetailByid  statusList", scope.statusList);
              scope.currencyList = response.recordsets[4];

              console.log(" scope.timeZoneList", scope.timeZoneList);
              console.log(
                "GetClientDetailById==================================>",
                JSON.stringify(scope.statusList)
              );
              if (response.recordsets[3].length !== 0) {
                scope.statusList = response.recordsets[3];
                console.log("statusListrecordsets[3] ", scope.statusList);
              }
              if (response.recordsets[5].length !== 0) {
                console.log("response.recordsets[5]", response.recordsets[5]);
                scope.saveclientdetails.basicData = response.recordsets[5][0];
                scope.CommissionAmount =
                  scope.saveclientdetails.basicData.CommissionAmount;
                scope.commissionPercent =
                  scope.saveclientdetails.basicData.IsPercent;
                if (
                  scope.commissionPercent == null ||
                  scope.commissionPercent == false
                ) {
                  scope.commissionPercent = 0;
                } else if (scope.commissionPercent == true) {
                  scope.commissionPercent = 1;
                }
                if (scope.$route.params.clientId == 1) {
                  scope.saveclientdetails.basicData.UseDefault = 0
                }
                if (scope.saveclientdetails.basicData.UseDefault == 1) {
                  scope.editDefault = true;
                } else {
                  scope.editDefault = false;
                }
                if (scope.saveclientdetails.basicData.IsLive == true) {
                  scope.saveclientdetails.basicData.IsLive = 1
                }
                else {
                  scope.saveclientdetails.basicData.IsLive = 0
                }
                if (
                  response.recordsets[5][0].ClientLogo != null ||
                  response.recordsets[5][0].ClientLogo != ""
                ) {
                  scope.logo = response.recordsets[5][0].ClientLogo;
                }
                // scope.logo = response.recordsets[5][0].ClientLogo;
                // scope.saveclientdetails.basicData.StatusId = scope.saveclientdetails.basicData.StatusId ? scope.saveclientdetails.basicData.StatusId: "1";
                scope.ContentId = response.recordsets[5][0].ContentId;
                if (response && response.recordsets[5][0].ClientId) {
                  scope.clientID = response.recordsets[5][0].ClientId;
                } else {
                  scope.clientID = -1;
                }
                scope.getImages();
                console.log("getclientid");

                console.log(
                  "scope.saveclientdetails.basicData",
                  scope.saveclientdetails.basicData
                );

                scope.Client_Status =
                  response.recordsets[5][0].StatusId === null ||
                    response.recordsets[5][0].StatusId === undefined ||
                    response.recordsets[5][0].StatusId === "" ||
                    response.recordsets[5][0] === ""
                    ? { StatusId: "1", StatusName: "Active" }
                    : {
                      StatusId: response.recordsets[5][0].StatusId,
                      StatusName: response.recordsets[5][0].StatusName
                    };
                console.log("scope.Client_Status", scope.Client_Status);
                console.log(
                  "response.recordsets[5][0].StatusId",
                  response.recordsets[5][0].StatusId
                );

                console.log(
                  "response.recordsets[5][0].timeZone",
                  scope.displayDropdowns.TimeZone
                );
                scope.saveclientdetails.clientContent = response.recordsets[5][0];

                if (
                  scope.saveclientdetails.clientContent.Content &&
                  scope.saveclientdetails.clientContent.Content.length > 0
                ) {
                  scope.saveclientdetails.clientContent.showContent = scope.saveclientdetails.clientContent.Content.substr(
                    0,
                    200
                  );
                  console.log(
                    "scope.saveclientdetails.clientContent.showContent==>",
                    scope.saveclientdetails.clientContent.showContent
                  );
                  if (
                    scope.saveclientdetails.clientContent.Content.length > 200
                  ) {
                    scope.saveclientdetails.clientContent.showDescription =
                      "More...";
                  }
                }
                if (scope.saveclientdetails.clientContent.CanExpire == true) {
                  scope.saveclientdetails.clientContent.CanExpire = 1
                } else {
                  scope.saveclientdetails.clientContent.CanExpire = 0
                }
                scope.StatusId = response.recordsets[5][0].StatusId;
                scope.StatusName = response.recordsets[5][0].StatusName;
                console.log("scope.StatusName", scope.StatusName);
                // scope.$set(scope.Client_Status, 'StatusId', response.recordsets[5][0].StatusId);
                // scope.$set(scope.Client_Status, 'StatusName', response.recordsets[5][0].StatusName);

                console.log(
                  "response.recordsets[6][0]",
                  scope.saveclientdetails.basicData
                );
              }
              if (response.recordsets[6].length !== 0) {
                scope.CityName =
                  response.recordsets[6][0].CityName;
                console.log("response.recordsets[6][0].CityName", response.recordsets[6][0].CityName);
                scope.searchCity = response.recordsets[6][0].CityName;
                scope.saveclientdetails.basicData.CountryName =
                  response.recordsets[6][0].CountryName;
                scope.saveclientdetails.basicData.Address1 =
                  response.recordsets[6][0].Address1;
                scope.saveclientdetails.basicData.Address2 =
                  response.recordsets[6][0].Address2;
                scope.saveclientdetails.basicData.Email =
                  response.recordsets[6][0].Email;
                scope.saveclientdetails.basicData.PhoneNumber =
                  response.recordsets[6][0].PhoneNumber;
                scope.selectedStateAndCountry.CityId =
                  response.recordsets[6][0].CityId;
                scope.selectedStateAndCountry.StateId =
                  response.recordsets[6][0].StateId;
                scope.selectedStateAndCountry.CountryId =
                  response.recordsets[6][0].CountryId;
                scope.saveclientdetails.basicData.PostalCode =
                  response.recordsets[6][0].PostalCode;
                scope.searchCountry = response.recordsets[6][0].CountryName;
                scope.searchState = response.recordsets[6][0].StateName;
                console.log(
                  "response.recordsets[6][0].PostalCode",
                  response.recordsets[6][0].PostalCode
                );
                console.log(
                  "scope.searchCity" + response.recordsets[6][0].CityName
                );
                console.log(
                  "response.recordsets[7] in client detail",
                  response.recordsets[6]
                );
              }

              if (response.recordsets[7].length !== 0) {
                scope.policyList = response.recordsets[7];

                var showChar = 200;
                for (var i in scope.policyList) {
                  var policycontent = scope.policyList[i].Content;
                  if (policycontent && policycontent.length > showChar) {
                    scope.policyList[i].showlesscontent = policycontent.substr(
                      0,
                      showChar
                    );
                    scope.policyList[i].showcontent = "More...";

                    console.log(
                      "policycontent================================>",
                      scope.policyList[i].showlesscontent
                    );
                  } else {
                    scope.policyList[i].showlesscontent = policycontent;
                  }
                  scope.policyList[i].showMore = false;
                  scope.policyList[i].showLess = true;
                }
                console.log(
                  "scope.saveclientdetails.PolicyData=>",
                  scope.policyList
                );
              }
              if (response.recordsets[9].length !== 0) {
                scope.propertyCount = response.recordsets[9];
                console.log("response.recordsets[10]", scope.propertyCount);
              }
              if (response.recordsets[10].length !== 0) {
                scope.unitCount = response.recordsets[10];
                console.log("response.recordsets[10]", scope.unitCount);
              }
              if (response.recordsets[13] && response.recordsets[13].length > 0) {
                scope.differentPaymentAccountPropertyList =
                  response.recordsets[13];
                scope.defultAccountProperties = true;
              }
              scope.commissionPercentColor = null;
              scope.displayDropDownContent();
              scope.displayMailingCountryName();
              scope.displayBillingCountryName();
              scope.displayCurrencyName();

              // bind
              // scope.WeekEndList = response.recordsets[8][0];
              scope.clientWeekdays = response.recordsets[8];
              console.log("scope.clientWeekdays==>", scope.clientWeekdays);
              // console.log("WeekEndList", scope.WeekEndList);
              // console.log("scope.WeekEndList", scope.WeekEndList.Friday)
              // for( let i=0; i< scope.WeekEndList.lemgth;i++ ){
              //    if(scope.mainCategories)
              //   WeekEndList[i].isChecked= true;
              // }

              // if (response.recordsets[11]) {
              //   scope.imageArr = response.recordsets[11];
              // }
            } else {
              console.log(err);
            }
          }
        });
        // for(let i=0;i<scope.mainCategories.length;i++){
        //           for(let j=0;j<scope.WeekEndList.length;j++){
        //             if(scope.mainCategories[i].key=scope.WeekEndList[j]){
        //               scope.mainCategories[i].value=true
        //               scope.checked=true
        //             }
        //           }
        //         }
      },
      // SaveClientPolicyDetails: function(){
      //   ClientId:scope.$route.params.clientId
      //   ContentId:-1
      //   Description	:Description

      // },
      SaveClientPolicyDetails: function () {
        let vm = this;
        if (vm.clientID === -1) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "please enter client Details Details"
          });
        } else {
          vm.$store.dispatch("dataRequestHandler", {
            key: "SaveClientDetails",
            params: {
              ModuleAction: "saveAWS_Image",
              propertyId: null,
              ClientId: vm.clientID,
              // ImageId: null,
              // ImageUrl: vm.imageArr,
              BE_Id: null,
              images: vm.imageData,
              UnitId: null,

              section: "clientPolicy",
              ContentId: vm.ContentId,
              ClientId: vm.$route.params.clientId,
              PolicyData: vm.saveclientdetails.PolicyData
            },
            callback: function (err, response) {
              if (err) {
                console.error("Error has occured => ", err);
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "error!",
                  message: error.sqlMessage ? error.sqlMessage : err
                });
                return;
              } else if (response) {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "successfully Policy saved"
                });
                vm.getClientDetailByid();
              }
            }
          });
        }
      },
      SaveClientContentDetails: function () {
        let vm = this;
        if (vm.clientID === -1) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "please enter client Details"
          });
        }
        // const formData = new FormData();
        // Array
        //   .from(Array(this.imageData.length).keys())
        //   .map(x => {
        //     formData.append("photos", this.imageData[x], this.imageData[x].name);
        //   });
        // console.log(apiUrl + '/upload')
        // let url = apiUrl + '/upload';

        // axios.post(url, formData)
        //   .then(data => {
        //     console.log(data.data);
        //     vm.imageData.splice(0, vm.imageData.length);
        //     for (let img of data.data) {
        //       // vm.imageArr.push(apiUrl + '/downloadImage/' + img.imageGuid)
        //       let obj = {};
        //       obj.ImageUrl = apiUrl + '/downloadImage/'+img.imageGuid;
        //       obj.ImageId = -1;
        //       // vm.imageArr.splice(-1,1);
        //       vm.imageData.push(obj);
        //     }
        //     console.log(vm.imageArr)
        //     vm.saveImages();

        //   })
        else {
          vm.saveclientdetails.clientContent.ClientLogo = vm.logo;
          console.log("ClientId: vm.clientID", vm.clientID);

          vm.$store.dispatch("dataRequestHandler", {
            key: "SaveClientDetails",
            params: {
              ModuleAction: "GetImages",
              UnitId: null,
              ClientId: vm.clientID,
              UnitId: null,
              PropertyId: null,
              UserId: null,
              BE_Id: null,
              section: "clientContent",
              ContentId: vm.ContentId,
              ClientId: vm.clientID,
              clientContent: vm.saveclientdetails.clientContent,
              basicData: vm.saveclientdetails.basicData
            },
            callback: function (err, response) {
              if (err) {
                console.error("Error has occured => ", err);
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "error!",
                  message: error.sqlMessage ? error.sqlMessage : err
                });
                return;
              } else if (response) {
                console.log("SaveClientContentDetails=====>", response);
                // vm.ContentId = response.recordsets[1][0].ContentId
                vm.ContentId = response.recordsets[0][0].ContentId;
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "successfully content saved"
                });
                vm.getClientDetailByid();
              }
            }
          });
        }
      },

      saveImages(imageArr) {
        let vm = this;

        // if (vm.clientID === -1) {
        //   vm.$store.dispatch("toastr", {
        //     type: "warning",
        //     header: "Warning",
        //     message: "please enter client Details Details"
        //   });
        // }
        // else {
        vm.$store.dispatch("dataRequestHandler", {
          key: "saveAWS_Image",
          params: {
            ModuleAction: "saveAWS_Image",
            propertyId: null,
            ClientId: vm.clientID,
            // ImageId: null,
            // ImageUrl: vm.imageArr,
            images: vm.imageData,
            UnitId: null
          },
          callback: function (error, response) {
            if (error) {
              console.error("Error has occured => ", error);

              return;
            } else {
              vm.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: "Client_Images successfully saved"
              });
              vm.getImages();
            }
          }
        });
        // }
      },

      getImages: function () {
        let scope = this;

        this.$store.dispatch("dataRequestHandler", {
          key: "GetImages",
          params: {
            ModuleAction: "GetImages",
            UnitId: null,
            ClientId: scope.clientID,
            UnitId: null,
            PropertyId: null,
            UserId: null
          },
          callback: function (err, response) {
            if (response) {
              console.log("response of get Images", response);
              // if (response.ImgUrls && response.ImgUrls !== null) {
              //   scope.imageArr = response.ImgUrls;s

              // }
              if (response.recordsets[0] && response.recordsets[0] !== null) {
                scope.imageArr = response.recordsets[0];
              } else if (response.recordsets === null) {
                scope.imageArr = [];
              }
            } else {
              console.log(err);
            }
          }
        });
      },
      upDateimg(e) {
        // console.log("ImageIdImageId",ImageId);
        let files = e.target.files || e.dataTransfer.files;
        this.imageData.push(files[0]);
        if (!files.length) {
          //update image
          this.saveclientdetails.clientContent.ClientLogo = null;
          return;
        } else {
          this.createUpdateImage(files[0], this.selectedImageId);
        }
      },
      createUpdateImage(file, ImageId) {
        let reader = new FileReader();
        let vm = this;
        reader.onload = e => {
          // vm.image = e.target.result;
          // vm.propertyData.propertyContent.PropertyLogo = vm.image;

          // console.log("image===================>", vm.image);
          // vm.imageArr.push(vm.image);
          const formData = new FormData();
          Array.from(Array(this.imageData.length).keys()).map(x => {
            formData.append("photos", this.imageData[x], this.imageData[x].name);
          });
          console.log(this.apiUrl + "/upload");
          let url = this.apiUrl + "/upload";
          // let obj = {};
          // obj.ImageUrl = e.target.result;
          // obj.ImageId = -1;

          // vm.imageArr.push(obj);

          axios.post(url, formData).then(data => {
            // console.log(data.data, data.data.length);

            // console.log("vm.imageArr.splice(-1, data.data.length);", vm.imageArr);
            let obj = {};
            obj.ImageId = ImageId;
            obj.ImageUrl = data.data[0].imageGuid;

            let imageIndex = vm.imageArr.findIndex(x => x.ImageId == ImageId);
            vm.imageArr[imageIndex] = obj;
            vm.removeImage(obj.ImageUrl, imageIndex, false);
            // update image
            // vm.saveImages()
            // vm.imageData.splice(0, vm.imageData.length);

            // for (let img of data.data) {

            //   let obj = {};
            //   obj.ImageUrl = img.imageGuid;
            //   obj.ImageId = -1;

            //   vm.imageData.push(obj);
            // }
            console.log(vm.imageArr);
            // vm.saveImages();
          });
        };
        reader.readAsDataURL(file);
      },

      removeImage(imageGuid, index, isdelete) {
        console.log("imagesimages", imageGuid);
        let vm = this;
        // console.log("vm.imageArr[index]",vm.imageArr[index].ImageId);
        vm.$store.dispatch("dataRequestHandler", {
          key: "DeleteImages",
          params: {
            ModuleAction: "deleteImages",
            ImageId: vm.imageArr[index].ImageId,
            ImageUrl: vm.imageArr[index].ImageUrl,
            isdelete: isdelete
          },
          callback: function (err, response) {
            if (err) {
              console.error("Error has occured => ", err);
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "error!",
                message: error.sqlMessage ? error.sqlMessage : err
              });
              return;
            } else if (response[0][0] && response[0][0].isEdited === true) {
              vm.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: "successfully image updated"
              });
            } else {
              vm.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: "successfully image deleted"
              });
            }
            vm.getImages();
          }
        });
      },
      SaveClientDaysSelection: function (DayId, IsChecked) {
        let vm = this;

        console.log("DayId, IsChecked", DayId, "+", IsChecked);

        if (DayId && IsChecked) {
          vm.checkedCategories = [];
          if (vm.clientWeekdays.length > 0) {
            for (
              let clientWeekdaysIndex = 0;
              clientWeekdaysIndex < vm.clientWeekdays.length;
              clientWeekdaysIndex++
            ) {
              if (Number(vm.clientWeekdays[clientWeekdaysIndex]["IsChecked"]))
                vm.checkedCategories.push(
                  vm.clientWeekdays[clientWeekdaysIndex]["DayId"]
                );
            }
          }

          console.log("vm.checkedCategories", vm.checkedCategories);

          // if (vm.clientID === -1) {
          //   vm.checkboxenable = false;
          //   vm.$store.dispatch("toastr", {
          //     type: "warning",
          //     header: "Warning",
          //     message: "please enter client Details"
          //   });
          // }
          // else {

          vm.$store.dispatch("dataRequestHandler", {
            key: "SaveClientDaysSelection",
            params: {
              ModuleAction: "SaveClientDaysSelection",

              CheckedweekDays: vm.checkedCategories,
              ClientId: this.$route.params.clientId
            },
            callback: function (err, response) {
              if (err) {
                console.error("Error has occured => ", err);
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "error!",
                  message: error.sqlMessage ? error.sqlMessage : err
                });
                return;
              } else if (response) {
                console.log("client week days response=>", response);
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Successfully Weekend Nights Saved"
                });
                vm.getClientDetailByid();
              }
            }
          });
          // }
        }
        // if(DayId && IsChecked === 1){
        //   vm.checkedCategories.push(DayId);
        // }
      },

      displayMailingCountryName: function () {
        let mCountry = this.countryList.find(
          mCountry_temp =>
            mCountry_temp.CountryId ===
            this.saveclientdetails.mailingData.CountryId
        );

        this.displayDropdowns.mailingCountryName = mCountry
          ? mCountry.CountryName
          : undefined;
        //  this.displayDropdowns.mailingCountryName = mCountry.CountryName;
      },
      displayBillingCountryName: function () {
        let bCountry = this.countryList.find(
          bCountry_temp =>
            bCountry_temp.CountryId ===
            this.saveclientdetails.billingData.CountryId
        );
        // console.log("countryvalue" +  country.CountryName)
        this.displayDropdowns.billingCountryName = bCountry
          ? bCountry.CountryName
          : undefined;
      },

      displayCurrencyName: function () {
        let currency = this.currencyList.find(
          currency_temp =>
            currency_temp.CurrencyId ===
            this.saveclientdetails.basicData.CurrencyId
        );
        this.displayDropdowns.basicCurrencyName = currency
          ? currency.CurrencyName + " " + currency.CurrencyAbbr
          : undefined;
      },
      displayDropDownContent: function () {
        console.log("in time zone");
        let timeZones = this.timeZoneList.find(
          temp => temp.IANACode === this.saveclientdetails.basicData.TimeZone
        );
        console.log(
          "this.saveclientdetails.basicData.timeZone",
          this.saveclientdetails.basicData.TimeZone
        );
        // this.displayDropdowns.TimeZone = timeZones ? timeZones.TimeZoneValue + " " + timeZones.TimeZoneText : undefined;
        this.displayDropdowns.TimeZone = timeZones
          ? timeZones.TimeZoneDetails
          : undefined;
        console.log(
          "this.displayDropdowns.TimeZone",
          this.displayDropdowns.TimeZone
        );
      },

      // displaySection: function(name) {
      //   // console.log("In display section " + name);
      //   // this.displaySectionValue = name;
      // },
      displaySection: function (name) {
        // this.showMap = false;
        //   this.showClientInfo = true;
        if (name === "clientInfo") {
          this.isBgColor1 = true;
          this.isBgColor3 = false;
          this.isBgColor2 = false;
          this.isBgColor4 = false;
          this.isBgColor5 = false;
          this.isBgColor6 = false;
          this.showDes = true;
          // this.saveClientInfo = true;
          // this.showLocationMap()
          this.showPolicies = false;
          this.showPolicy = true;
          if (this.saveclientdetails.clientContent.Content) {
            this.saveclientdetails.clientContent.showContent = this.saveclientdetails.clientContent.Content.substr(
              0,
              200
            );
          }
          this.displaySectionValue = name;
        }
        if (name === "contentDetails") {
          this.isBgColor2 = true;
          this.isBgColor1 = false;
          this.isBgColor3 = false;
          this.isBgColor4 = false;
          this.isBgColor5 = false;
          this.isBgColor6 = false;
          this.showDes = false;
          // this.savemap = false;
          this.saveclientdetails.clientContent.showContent = this.saveclientdetails.clientContent.Content;
          this.showPolicies = false;
          this.showPolicy = true;
          this.displaySectionValue = name;
        }
        if (name === "Policy") {
          this.isBgColor3 = true;
          this.isBgColor2 = false;
          this.isBgColor1 = false;
          this.isBgColor4 = false;
          this.isBgColor5 = false;
          this.isBgColor6 = false;
          // this.savemap = false;

          this.showDes = true;
          if (this.policyList && this.policyList.length > 0) {
            this.showpolicybutton = true;
            this.displaySectionValue = name;
          }
          this.showPolicies = true;
          this.showPolicy = false;
          if (this.saveclientdetails.clientContent.Content) {
            this.saveclientdetails.clientContent.showContent = this.saveclientdetails.clientContent.Content.substr(
              0,
              200
            );
          }
        }
        if (name === "Weekened") {
          this.isBgColor3 = false;
          this.isBgColor2 = false;
          this.isBgColor1 = false;
          this.isBgColor4 = true;
          this.isBgColor5 = false;
          this.isBgColor6 = false;
          this.showDes = true;

          this.showPolicies = false;
          this.showPolicy = true;
          if (this.saveclientdetails.clientContent.Content) {
            this.saveclientdetails.clientContent.showContent = this.saveclientdetails.clientContent.Content.substr(
              0,
              200
            );
          }
        }
        if (name === "systemSettings") {
          this.isBgColor3 = false;
          this.isBgColor2 = false;
          this.isBgColor1 = false;
          this.isBgColor4 = false;
          this.isBgColor5 = true;
          this.isBgColor6 = false;
          this.showDes = true;

          this.showPolicies = false;
          this.showPolicy = true;
          if (this.saveclientdetails.clientContent.Content) {
            this.saveclientdetails.clientContent.showContent = this.saveclientdetails.clientContent.Content.substr(
              0,
              200
            );
          }
        }
        if (name === "paymentSetup") {
          this.isBgColor2 = false;
          this.isBgColor1 = false;
          this.isBgColor3 = false;
          this.isBgColor4 = false;
          this.isBgColor5 = false;
          this.isBgColor6 = true;
          this.showDes = false;
          // this.savemap = false;
          this.saveclientdetails.clientContent.showContent = this.saveclientdetails.clientContent.Content;
          this.showPolicies = false;
          this.showPolicy = true;
          this.displaySectionValue = name;
        }

        // if (this.saveclientdetails.basicData.ClientName) {
        //   this.displaySectionValue = name;
        //   console.log("this.saveclientdetails.basicData.ClientName", this.saveclientdetails.basicData.ClientName)
        // } else if (name === "clientInfo") {
        //   this.displaySectionValue = name;
        // }
        // else {
        //   this.displaySectionValue = null;
        //   this.$store.dispatch("toastr", {
        //     type: "warning",
        //     message: "Please enter Client Info !"
        //   });
        // }
        // if (name === "clientInfo" && this.saveclientdetails.basicData.ClientName == null) {
        //   this.displaySectionValue = name;

        // } else

        //   if (this.saveclientdetails.basicData.ClientName == null) {

        //     this.displaySectionValue = null;
        //     this.$store.dispatch("toastr", {
        //       type: "warning",
        //       message: "Please enter Client Info !"
        //     });
        //   } else {
        //     this.displaySectionValue = name;

        //   }
        // this.displaySectionValue = name;
      },

      getPolicyDes: function (policy) {
        let vm = this;
        console.log("contenttitle==>", policy.Content);
        console.log("contenttitle==>", policy.ContentTitle);
        vm.saveclientdetails.PolicyData.Content = policy.Content;
        vm.saveclientdetails.PolicyData.ContentTitle = policy.ContentTitle;
        vm.saveclientdetails.PolicyData.StatusId = policy.StatusId;
        vm.ContentId = policy.ContentId;
        // vm.getClientDetailByid();
      },
      getPolicyName: function (policy) {
        let vm = this;
        console.log("contenttitle==>", policy.Content);
        console.log("contenttitle==>", policy.ContentTitle);
        vm.saveclientdetails.PolicyData.Content = policy.Content;
        vm.saveclientdetails.PolicyData.ContentTitle = policy.ContentTitle;
        vm.saveclientdetails.PolicyData.StatusId = policy.StatusId;
        vm.ContentId = policy.ContentId;
        //  vm.getClientDetailByid();
      },
      getStatusName: function (policy) {
        let vm = this;
        console.log("contenttitle==>", policy.Content);
        console.log("contenttitle==>", policy.ContentTitle);
        console.log("contenttitle==>", policy.StatusId);
        vm.saveclientdetails.PolicyData.Content = policy.Content;
        vm.saveclientdetails.PolicyData.ContentTitle = policy.ContentTitle;
        vm.saveclientdetails.PolicyData.StatusId = policy.StatusId;
        vm.ContentId = policy.ContentId;
      },

      // displaySection: function(name) {
      //   console.log("In display section " + name);
      //   this.displaySectionValue = name;
      // },

      fetchData: function () {
        console.log(this.$route.params.clientId);
        this.getClientDetailByid();
      },
      lessContent: function () {
        let vm = this;
        vm.saveclientdetails.clientContent.showContent =
          vm.saveclientdetails.clientContent.Content;
      },
      Get_PaymentAccount_Details() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_PaymentAccount_Details",
          params: {
            ModuleAction: "Get_PaymentAccount_Details",
            propertyId: null,
            unitId: null,
            isClient: true,
            IsActive: vm.IsActive
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in Get_PaymentAccount_Details", response);
              vm.paymentAccountList.splice(
                0,
                vm.paymentAccountList.length,
                ...response[2]
              );
            }
          }
        });
      }
    },
    computed: {
      // fncIsClientUpdate(){

      //     let vm = this;
      //     if(vm.$route.params.ClientId > 0 ){
      //     return vm.$store.state.userEntitlementList.hasOwnProperty("fncClientUpdate")
      //   }

      //   },

      fncIsClientSave() {
        let vm = this;
        if (vm.$route.params.clientId === "-1") {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncClientSave"
          )
            ? vm.$store.state.userEntitlementList.fncClientSave
            : null;
        } else if (vm.$route.params.clientId > 0) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncClientUpdate"
          )
            ? vm.$store.state.userEntitlementList.fncClientUpdate
            : null;
        }
      }
    },
    watch: {
      // searchCity(newValue, oldValue) {
      //   let vm = this;
      //   cityList: [];
      //   vm.saveclientdetails.basicData.CityName = vm.searchCity;
      //   console.log("searchCity" + vm.searchCity)
      //   if (newValue.length > 0) {
      //     console.log("Firing search", newValue);
      //     vm.$store.dispatch("dataRequestHandler",
      //       {
      //         key: "GetCitySearch",
      //         params: {
      //           ModuleAction: "GetCitySearch",
      //           SearchLocation: newValue,
      //           SearchId: 1
      //         },
      //         callback: function (err, response) {
      //           if (err) {
      //             return;
      //           }
      //           if (response) {
      //             console.log("response in search city", response);
      //             if (newValue && oldValue) {
      //               vm.cityList = response;
      //             }

      //           }
      //         }
      //       });
      //   }

      // },

      searchCity(newValue, oldValue) {
        let vm = this;
        vm.cityList = [];
        // vm.isCitySelected = false;
        // vm.saveclientdetails.basicData.CityName = newValue;
        // console.log("vm.selectedStateAndCountry.CityName", vm.selectedStateAndCountry.CityName)
        console.log("Firing search", newValue.length + newValue);
        if (vm.searchCityOldValue != vm.searchCity) {
          if (newValue.length > 0) {
            vm.$store.dispatch("dataRequestHandler", {
              key: "GetCitySearch",
              params: {
                ModuleAction: "GetCitySearch",
                SearchLocation: newValue,
                SearchId: 1
              },
              callback: function (err, response) {
                if (err) {
                  return;
                }
                if (response) {
                  //console.log("response in search city", response);

                  if (
                    (newValue && oldValue) ||
                    (newValue && vm.$route.params.clientId == "-1")
                  ) {
                    //console.log("vm.cityList", vm.cityList)
                    vm.cityList = response;
                    if (response.length == 0) {
                      vm.enableStateCountry = true;
                      vm.isCitySelected = false;
                    } else {
                      vm.enableStateCountry = false;
                      vm.isCitySelected = false;
                    }
                  }
                }
              }
            });
          }
        }
      },

      searchState(newValue, oldValue) {
        let vm = this;
        vm.stateList = [];
        // vm.isCitySelected = false;
        vm.saveclientdetails.basicData.StateName = newValue;
        // console.log("vm.selectedStateAndCountry.CityName", vm.selectedStateAndCountry.CityName)
        console.log("Firing search", newValue.length + newValue);
        if (vm.searchStateOldValue != vm.searchState) {
          if (newValue.length > 0) {
            vm.$store.dispatch("dataRequestHandler", {
              key: "GetCitySearch",
              params: {
                ModuleAction: "GetCitySearch",
                SearchLocation: newValue,
                SearchId: 2
              },
              callback: function (err, response) {
                if (err) {
                  return;
                }
                if (response) {
                  //console.log("response in search city", response);

                  if (
                    (newValue && oldValue) ||
                    (newValue && vm.$route.params.clientId == "-1")
                  ) {
                    //console.log("vm.cityList", vm.cityList)
                    vm.stateList = response;
                  }
                  // vm.selectedStateAndCountry.CityName = vm.searchCity;
                }
              }
            });
          }
        }
      },

      searchCountry(newValue, oldValue) {
        let vm = this;
        vm.countryList = [];
        // vm.isCitySelected = false;
        vm.saveclientdetails.basicData.CountryName = newValue;
        // vm.selectedStateAndCountry.CountryName = newValue;
        // console.log("vm.selectedStateAndCountry.CityName", vm.selectedStateAndCountry.CityName)
        console.log("Firing search", newValue.length + newValue);
        if (vm.searchCountryOldValue != vm.searchCountry) {
          if (newValue.length > 0) {
            vm.$store.dispatch("dataRequestHandler", {
              key: "GetCitySearch",
              params: {
                ModuleAction: "GetCitySearch",
                SearchLocation: newValue,
                SearchId: 3
              },
              callback: function (err, response) {
                if (err) {
                  return;
                }
                if (response) {
                  //console.log("response in search city", response);

                  if (
                    (newValue && oldValue) ||
                    (newValue && vm.$route.params.clientId == "-1")
                  ) {
                    vm.countryList = response;
                  }
                }
              }
            });
          }
        }
      },
      $route: "fetchData"
    },

    mounted() {
      let vm = this;
      console.log("clientdetail mount");
      vm.getClientDetailByid();
      vm.GetUserEntitlementsAndDefaultProperty();
      vm.redirectUrl();
      vm.Get_PaymentAccount_Details();
      $(document).click(function (e) {
        $(".searchLocations").hide();
        let classsName = "#" + vm.paymentAccountEdit;
        $(classsName).removeClass("show");
      });
    },
    beforeDestroy() {
      // $(document).unbind( "click");
    }
  };
</script>
<style scoped>
  .container {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    color: #50d1c1;
  }

  .gallery {
    width: 80%;
    max-width: 980px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .pic {
    width: calc(50% - 30px);
    margin: 15px;
    cursor: pointer;
  }

  .pic:hover img {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0);
    transform: scale(1.01);
  }

  /* img{
    width: 100%;
    transition: .3s ease;
  } */

  /* .btn{
    cursor: pointer;
    outline: none;
    text-decoration: none;
    text-align: center;
    font-size: 20px;
    line-height: 50px;
    height: 50px;
    padding: 0 8px;
    margin-left: 20px;
    background-color: #50d1c1;
    border-color: #50d1c1;
    border-radius: 4px;
    color: #FFF;
    transition: .3s;
  } */

  .btn:active {
    color: #ccc;
    background-color: #6ab5ae;
    border-color: #6ab5ae;
    outline: none;
  }
</style>