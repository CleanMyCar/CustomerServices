<template src="./propertyDetailVue.template.html"></template>
<style>
  .quantity::-webkit-inner-spin-button,
  .quantity::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .quantity {
    width: 40px;
    text-align: center;
  }
</style>

<script>
  import Vue from "vue";
  import VeeValidate from "vee-validate";
  import * as axios from "axios";
  import moment from "moment-timezone";
  // import Lightbox from 'vue-easy-lightbox'
  // import Lightbox from './main.js'

  // Vue.use(Lightbox)

  //  apiUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":1339" : '');
  // let apiIp = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":1339" : '');

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
    name: "propertyDetailComponent",
    validator: null,
    props: ["propertyId"],

    data() {
      return {
        apiUrl:
          window.location.protocol +
          "//" +
          window.location.hostname +
          (window.location.port ? ":1339" : ""),
        isBgColor1: true,
        isBgColor2: false,
        isBgColor3: false,
        isBgColor4: false,
        isBgColor5: false,
        isBgColor6: false,
        showPropertyInfo: true,
        Property_Status: {},
        emailRegEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

        showMap: false,
        propertyData: {
          basicData: {
            StatusId: null
          },

          mailingData: {},

          billingData: {},
          PolicyData: {},
          propertyContent: {
            InspectToClean: 1,
            CleanToDirty: 1,
            InspectToCleanFlag: 1,
            CleanToDirtyFlag: 1,
            CleanToDirtyTime: "00:00 AM",
            InspectToCleanTime: "00:00 AM",
            CommissionPercent: 0
          }
        },
        Amenities: {
          ListName: null,
          ListDesc: null,
          ListTypeId: null
        },

        countryList: [],
        AmenitiesList: [],
        AmenitiesLists: [],
        ApplyAmenitiesList: [],
        showLessAmenities: [],
        timeZoneList: [],
        statusList: [],
        currencyList: [],
        showAmenitiesList: false,
        isDisabled: false,
        showPolicy: true,
        showPolicies: false,
        showLess: true,
        showMore: false,
        timeObj: {},

        selectedCityObj: {},
        policyList: [],
        propertyImages: [],
        displaySectionValue: "propertyInfo",

        displayDropdowns: {
          Timezone: null,
          mailingData_countryName: null,
          billingData_countryName: null,
          basicCurrencyName: null
        },
        selectedStateAndCountry: {},
        searchCity: "",
        searchState: "",
        searchCountry: "",
        enableStateCountry: false,
        isCitySelected: false,
        searchCityOldValue: "",
        searchStateOldValue: "",
        searchCountryOldValue: "",
        CityName: "",
        cityList: [],
        stateList: [],
        // countryList: [],
        enableCheck: false,
        ContentId: -1,
        ListID: "",
        showDropDown: false,
        PropertyID: -1,
        imageData: [],
        imageArr: [],
        visible: false,
        imgupdate: {},
        imgs: [], // Img Url , string or Array

        index: 0, // default
        // checkinTime: {
        //   a: "am",
        //   hh: "00",
        //   mm: "00",
        // },
        // checkoutTime: {
        //   a: "am",
        //   hh: "00",
        //   mm: "00",
        // },
        checkinTime: "00:00 AM",
        checkoutTime: "00:00 AM",
        selectedImageId: null,
        showpolicybutton: false,
        entitlements: {},
        showicon: true,
        Tagdisable: true,
        propertyTypeList: [],
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
        accountEdit: false,
        paymentAccountList: [],
        paymentAccountEdit: null,
        differentPaymentAccountUnitList: [],
        defultAccountUnits: false,
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
        commissionPercent: null,
        IsLive: null
      };
    },

    methods: {
      resetAddress() {
        let vm = this;
        vm.propertyData.basicData.Address1 = "";
        vm.$set(vm.propertyData.basicData, "PostalCode", "");
        vm.$set(vm.propertyData.basicData, 'StateName', "");
        vm.$set(vm.propertyData.basicData, 'CountryName', "");

        vm.CityName = "";
      },
      // getAddress(address) {
      //   let vm = this;
      //   console.log("address", address);
      //   vm.propertyData.basicData.Address2 = address;

      //   console.log("vm.propertyData.basicData.Address2", vm.propertyData.basicData.Address2);
      // },
      getAddressData: function (addressData, placeResultData, id) {
        let vm = this;
        // vm.address = addressData;
        if (addressData && addressData.street_number && addressData.route) {
          this.propertyData.basicData.Address1 = addressData.street_number + ', ' + addressData.route;
        }
        else {
          this.propertyData.basicData.Address1 = addressData.route;
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
        vm.$set(vm.propertyData.basicData, "PostalCode", addressData.postal_code);
        vm.$set(vm.propertyData.basicData, 'StateName', addressData.administrative_area_level_1);
        vm.$set(vm.propertyData.basicData, 'CountryName', addressData.country);
        // vm.$set(vm.CityName, addressData.locality);
        // vm.CityName = addressData.locality;
        vm.$set(vm.propertyData.basicData, 'shortAddress', this.propertyData.basicData.Address1);

        // this.propertyData.basicData.PostalCode = addressData.postal_code;
        // this.propertyData.basicData.CityName = addressData.locality;
        // this.propertyData.basicData.StateName = addressData.administrative_area_level_1;
        // this.propertyData.basicData.CountryName = addressData.country;

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
      showUsedUnitList(paymentAccount) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetConnectedObjects_PaymentAccount",
          params: {
            ModuleAction: "GetConnectedObjects_PaymentAccount",
            PaymentAccountId: paymentAccount.PaymentAccountId,
            PropertyId: vm.PropertyID
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
          vm.propertyData.basicData.UseDefault = 1;
          // vm.getClientDetailByid();
          //CommissionAmount: null,
          //commissionPercent: null
          vm.CommissionAmount =
            vm.propertyData.basicData.DefaultCommissionAmount;
          vm.commissionPercent =
            vm.propertyData.basicData.DefaultCommissionType;
          if (vm.commissionPercent == true) {
            vm.commissionPercent = 1;
          } else if (vm.commissionPercent == false) {
            vm.commissionPercent = 0;
          }
          vm.editDefault = true;
        } else {
          vm.propertyData.basicData.UseDefault = 0;
          vm.editDefault = false;
          vm.CommissionAmount = vm.propertyData.basicData.CommissionAmount;
          vm.commissionPercent = vm.propertyData.basicData.IsPercent;
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
            propertyId: vm.PropertyID,
            unitId: null,
            isClient: true,
            paymentAccount: paymentAccount,
            CommissionPercent: vm.commissionPercent,
            CommissionAmmount: vm.CommissionAmount,
            UseDefault: vm.propertyData.basicData.UseDefault,
            IsLive: vm.IsLive == true ? 1 : 0
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
                vm.getPropertyDetailById();
              }
            }
          }
        });
      },
      savePaymentSetupDetails() { },
      showAccountEdit(index, e) {
        let vm = this;
        e.stopPropagation();
        setTimeout(function () {
          vm.paymentAccountEdit = "accountEdit" + index;
          let classsName = "#" + vm.paymentAccountEdit;
          $(classsName).addClass("show");
        }, 10);
      },
      plusCleanToDirty() {
        let vm = this;
        if (!vm.propertyData.propertyContent.CleanToDirty) {
          vm.propertyData.propertyContent.CleanToDirty = 1;
        }
        vm.propertyData.propertyContent.CleanToDirty =
          parseInt(vm.propertyData.propertyContent.CleanToDirty) + 1;
      },
      minusCleanToDirty() {
        let vm = this;
        if (!vm.propertyData.propertyContent.CleanToDirty) {
          vm.propertyData.propertyContent.CleanToDirty = 1;
        }
        if (vm.propertyData.propertyContent.CleanToDirty > 1) {
          vm.propertyData.propertyContent.CleanToDirty =
            parseInt(vm.propertyData.propertyContent.CleanToDirty) - 1;
        }
      },
      plusInspectToClean() {
        let vm = this;
        if (!vm.propertyData.propertyContent.InspectToClean) {
          vm.propertyData.propertyContent.InspectToClean = 1;
        }
        vm.propertyData.propertyContent.InspectToClean =
          parseInt(vm.propertyData.propertyContent.InspectToClean) + 1;
      },
      minusInspectToClean() {
        let vm = this;
        if (!vm.propertyData.propertyContent.InspectToClean) {
          vm.propertyData.propertyContent.InspectToClean = 1;
        }
        if (vm.propertyData.propertyContent.InspectToClean > 1) {
          vm.propertyData.propertyContent.InspectToClean =
            parseInt(vm.propertyData.propertyContent.InspectToClean) - 1;
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
        if (vm.entitlements.fncPropertyUpdate.isAssigned === -1) {
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
              // vm.UserProperties = response.properties;
              vm.entitlements = response.userEntitlementList;
              // vm.fncIsHousekeepingTaskList();
              vm.tagDisabling();

              // vm.DefaultProperty = response.defaultPropertyId;
            }
          }
        });
      },

      imageURLS(imgGuid) {
        let isBase64 = /^data:image\/([a-zA-Z]*);base64,([^\"]*)/.test(imgGuid);
        if (isBase64) {
          return imgGuid;
        }
        return this.apiUrl + "/downloadImage/" + imgGuid + "/430x300";
      },
      updateCheckInTime(eventData) {
        let scope = this;
        console.log("eventData", eventData);
        // scope.propertyData.propertyContent.checkInTime = eventData.data.HH + ':' + eventData.data.mm + '' + eventData.data.a
        // console.log("timeObj", scope.propertyData.propertyContent.checkInTime);
        // if (
        //   scope.propertyData.propertyContent.checkInTime &&
        //   scope.propertyData.propertyContent.checkOutTime
        // ) {
        //   let checkInTime = scope.propertyData.propertyContent.checkInTime;
        //   let checkOutTime = scope.propertyData.propertyContent.checkOutTime;
        // }
        // console.log("scope.propertyData.propertyContent.checkInTime", scope.propertyData.propertyContent.checkInTime)
        const arr = [1, 2, 3, 4];
        arr.forEach(function (element) {
          console.log("element", element);
        });
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

      updateCheckOutTime(key, timeObj) {
        let scope = this;
        scope.propertyData.propertyContent.checkOutTime = timeObj
          ? timeObj.utc().format("hh:mm")
          : null;
        if (
          scope.propertyData.propertyContent.checkInTime &&
          scope.propertyData.propertyContent.checkOutTime
        ) {
          let checkInTime = scope.propertyData.propertyContent.checkInTime;
          let checkOutTime = scope.propertyData.propertyContent.checkOutTime;
        }
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

      // update
      upDateimg(e) {
        // console.log("ImageIdImageId",ImageId);
        let files = e.target.files || e.dataTransfer.files;
        this.imageData.push(files[0]);
        if (!files.length) {
          //update image
          this.propertyData.propertyContent.PropertyLogo = null;
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
      // update

      updateimage(imageGuid, index, isupdate) {
        console.log("update image", imageGuid);
        // console.log("imagesimages", imageGuid);
        let vm = this;
        // console.log("vm.imageArr[index]",vm.imageArr[index].ImageId);
        vm.$store.dispatch("dataRequestHandler", {
          key: "DeleteImages",
          params: {
            ModuleAction: "deleteImages",
            ImageId: vm.imgs[index].ImageId,
            ImageUrl: vm.imgs[index].ImageUrl,
            isdelete: isupdate
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
                message: "successfully updated"
              });
            }
            vm.getImages();
          }
        });
      },
      showAmenitiesListFnc() {
        this.showAmenitiesList = !this.showAmenitiesList;
        setTimeout(function () {
          this.showLedgerAccounts = !this.showLedgerAccounts;
          $("#Amenitiesdropdowns").show();
        }, 10);
      },
      // showMorepropertyList:function(){

      // },
      // showLesspropertyList:function(){

      // },
      showMorepropertyList() {
        console.log("showMorepropertyList");
        let vm = this;
        (vm.showLess = false), (vm.showMore = true);
      },
      showLesspropertyList() {
        console.log("showLesspropertyList");
        let vm = this;
        (vm.showLess = true), (vm.showMore = false);
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
        scope.policyList[index].showcontent = "Show less";
        scope.policyList[index].showlesscontent = scope.policyList[index].Content;
        console.log(
          "scope.policyList[index].showMore",
          scope.policyList[index].Content
        );
        // }
      },

      showLocationMap: function () {
        this.showPropertyInfo = !this.showPropertyInfo;
        this.showMap = !this.showMap;
      },

      showDropDownList: function () {
        this.showDropDown = !this.showDropDown;
      },

      uploadImages(e) {
        let vm = this;
        if (vm.PropertyID === -1) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "cant upload without entering first section  Details"
          });
        } else {
          this.imageData = [];
          let files = e.target.files || e.dataTransfer.files;
          this.imageData.push(files[0]);
          if (!files.length) {
            this.propertyData.propertyContent.PropertyLogo = null; //upload images
            return;
          } else {
            this.createImage(files[0]);
          }
        }
      },
      createImage(file) {
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
          let obj = {};
          obj.ImageUrl = e.target.result;
          obj.ImageId = -1;

          vm.imageArr.push(obj);

          // console.log("base64" + vm.propertyImages);
          axios.post(url, formData).then(data => {
            console.log(data.data, data.data.length);
            // vm.imageArr.splice(-1, data.data.length);
            console.log("vm.imageArr.splice(-1, data.data.length);", vm.imageArr);
            vm.imageData.splice(0, vm.imageData.length);

            for (let img of data.data) {
              // vm.imageArr.push(apiUrl + '/downloadImage/'+img.imageGuid)
              let obj = {};
              obj.ImageUrl = img.imageGuid;
              obj.ImageId = -1;
              // vm.imageArr.splice(-1,1);
              //vm.imageArr.push(obj);
              vm.imageData.push(obj);
            }
            console.log(vm.imageArr);
            vm.saveImages();
          });
        };
        reader.readAsDataURL(file);
      },

      addToLoop: function (number) {
        let vm = this;
        vm.showpolicybutton = true;
        vm.policyList.push({});
        console.log("policyListpolicyList", vm.policyList);
      },
      removeDummy: function () {
        var elem = document.getElementById("dummy");
        elem.parentNode.removeChild(elem);
      },
      getPolicyDes: function (policy) {
        let vm = this;
        console.log("contenttitle==>", policy.Content);
        console.log("contenttitle==>", policy.ContentTitle);
        vm.propertyData.PolicyData.Content = policy.Content;
        vm.propertyData.PolicyData.ContentTitle = policy.ContentTitle;
        vm.propertyData.PolicyData.StatusId = policy.StatusId;
        vm.ContentId = policy.ContentId;
        // vm.getClientDetailByid();
      },
      getPolicyName: function (policy) {
        let vm = this;
        console.log("contenttitle==>", policy.Content);
        console.log("contenttitle==>", policy.ContentTitle);
        vm.propertyData.PolicyData.Content = policy.Content;
        vm.propertyData.PolicyData.ContentTitle = policy.ContentTitle;
        vm.propertyData.PolicyData.StatusId = policy.StatusId;
        vm.ContentId = policy.ContentId;
        //  vm.getClientDetailByid();
      },
      getStatusName: function (policy) {
        let vm = this;
        console.log("contenttitle==>", policy.Content);
        console.log("contenttitle==>", policy.ContentTitle);
        console.log("contenttitle==>", policy.StatusId);
        vm.propertyData.PolicyData.Content = policy.Content;
        vm.propertyData.PolicyData.ContentTitle = policy.ContentTitle;
        vm.propertyData.PolicyData.StatusId = policy.StatusId;
        vm.ContentId = policy.ContentId;
      },

      SavePropertyPolicyDetails: function () {
        let vm = this;
        if (vm.PropertyID === -1) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "please enter property Details"
          });
        } else {
          vm.$store.dispatch("dataRequestHandler", {
            key: "AddPropertyPolicyDetails",
            params: {
              ModuleAction: "AddPropertyPolicyDetails",
              ContentId: vm.ContentId,
              propertyId: vm.$route.params.propertyId,
              // propertyId:-1,
              PolicyData: vm.propertyData.PolicyData
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
              }
              vm.getPropertyDetailById();
              // let propertyurl = response.recordsets[1][0].PropertyId;
              // vm.$router.push("/propertyDetail/" + propertyurl);
            }
          });
        }
      },

      addAmenities(Amenity) {
        let scope = this;
        scope.ApplyAmenitiesList.push({
          ListId: Amenity.ListId,
          ListName: Amenity.ListName
        });
        var index = scope.AmenitiesList.indexOf(Amenity);
        console.log("index of Amenities=>", index);
        if (index > -1) {
          scope.AmenitiesList.splice(index, 1);
          console.log("scope.AmenitiesList", scope.AmenitiesList);
        }
      },
      removeAmenities(Amenity) {
        let scope = this;
        var index = scope.ApplyAmenitiesList.indexOf(Amenity);
        console.log("index============>", index);
        if (index > -1) {
          scope.ApplyAmenitiesList.splice(index, 1);
          console.log(
            "delete  scope.ApplyAmenitiesList",
            scope.ApplyAmenitiesList
          );
        }
        scope.AmenitiesList.push({
          ListId: Amenity.ListId,
          ListName: Amenity.ListName
        });
        console.log("scope.AmenitiesList after deleting", scope.AmenitiesList);
      },

      SaveClientListOfValues: function () {
        let vm = this;
        if (vm.PropertyID === -1) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "please enter property Details"
          });
        } else {
          vm.showDropDown = false;
          console.log(" vm.ListID", vm.ListID);
          console.log("vm.AmenitiesList", vm.AmenitiesList);
          vm.$store.dispatch("dataRequestHandler", {
            key: "SaveClientListOfValues",
            params: {
              ModuleAction: "SaveClientListOfValues",

              propertyId: vm.$route.params.propertyId,
              // ListId: vm.ListID,
              // ListName: vm.Amenities.ListName,
              // ListDesc: vm.Amenities.ListDesc,
              // ListTypeId: vm.Amenities.ListTypeId,
              Amenities: vm.ApplyAmenitiesList
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
                  message: "successfully Amenities saved"
                });
              }
              vm.getPropertyDetailById();
            }
          });
        }
      },

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
              // vm.propertyData.basicData.CityName = selectedoptions.CityName;
              vm.propertyData.basicData.CountryName = selectedoptions.CountryName;
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
      SavePropertyInfo: function () {
        let vm = this;
        this.$validator.validateAll().then(result => {
          if (result) {
            let Email = vm.propertyData.basicData.Email;
            if (!vm.emailRegEx.test(Email)) {
              //console.log("Invalid email");
              vm.$store.dispatch("toastr", {
                type: "warning",
                message: "Please enter valid E-mail Id",
                header: "Email"
              });

              return;
            }

            // if (vm.isCitySelected == false) {
            //   vm.selectedStateAndCountry.CityId = null;
            // }
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
              key: "AddPropertyInfo",
              params: {
                ModuleAction: "AddPropertyInfo",
                basicData: vm.propertyData.basicData,
                CityName: vm.CityName,
                StatusId: vm.Property_Status.StatusId,
                CityId: null, // vm.selectedStateAndCountry.CityId,
                StateId: null, //vm.selectedStateAndCountry.StateId,
                CountryId: null, //vm.selectedStateAndCountry.CountryId,
                // cityName: vm.searchCity,
                // stateName: vm.selectedStateAndCountry.StateName,
                // countryName: vm.selectedStateAndCountry.CountryName,
                propertyId: vm.PropertyID,
                propertyTypeId: vm.propertyData.basicData.PropertyTypeId
              },
              callback: function (error, response) {
                console.log("SavePropertyInfo", response);

                if (error) {
                  console.error("Error has occured => ", error);
                  vm.$store.dispatch("toastr", {
                    type: "error",
                    header: "Property Info Error!",
                    message: error.sqlMessage ? error.sqlMessage : error
                  });
                  return;
                } else if (response) {
                  console.log("saveproperty details", response);
                  // else {
                  //   vm.PropertyID = response.recordsets[1][0].PropertyId;
                  //   console.log("property info ", response.recordsets);
                  //   vm.$store.dispatch("toastr", {
                  //     type: "success",
                  //     header: "Success!",
                  //     message: "Property Info successfully saved"
                  //   });
                  // }
                  console.log("PropertyID AddPropertyInfo", response);
                  if (
                    (response.recordsets[1][0] &&
                      response.recordsets[0][0].ErrorMessage === " ") ||
                    response.recordsets[0][0].ErrorMessage === null ||
                    response.recordsets[0][0].ErrorMessage === "null"
                  ) {
                    console.log("property info ", response.recordsets);
                    vm.PropertyID = response.recordsets[1][0].PropertyId;
                    console.log("PropertyID AddPropertyInfo", vm.PropertyID);

                    vm.$store.dispatch("toastr", {
                      type: "success",
                      header: "Success!",
                      message: "Property Info successfully saved"
                    });
                  } else {
                    vm.$store.dispatch("toastr", {
                      type: "error",
                      header: "Error While saving",
                      message: response.recordsets[0][0].ErrorMessage
                    });
                  }
                }

                let propertyurl = response.recordsets[1][0].PropertyId;
                vm.$router.push("/propertyDetail/" + propertyurl);
                // vm.enableStateCountry = false;
              }
            });
            // }
          }
        });
        //    return;
      },

      // alert('Correct them errors!');

      addPropertyMDetails: function () {
        this.$validator.validateAll().then(result => {
          if (result) {
            let vm = this;
            vm.$store.dispatch("dataRequestHandler", {
              key: "AddPropertyMDetails",
              params: {
                ModuleAction: "AddPropertyMDetails",
                basicData: this.propertyData.basicData
              },
              callback: function (error, response) {
                if (error) {
                  console.error("Error has occured => ", error);
                  vm.$store.dispatch("toastr", {
                    type: "error",
                    header: "Property Detail Error!",
                    message: error.sqlMessage ? error.sqlMessage : error
                  });
                  return;
                } else {
                  var propertyIdURL = response.recordsets[2][0].PropertyId;
                  vm.$store.dispatch("toastr", {
                    type: "success",
                    header: "Success!",
                    message: "Property Detail successfully saved"
                  });

                  vm.propertyData.basicData.PropertyId = propertyIdURL;
                  vm.$router.push(
                    "/propertyDetail/" + vm.propertyData.basicData.PropertyId
                  );
                }
              }
            });
            // return;
          }

          // alert('Correct them errors!');
        });
      },

      SavePropertyContentDetails: function () {
        let vm = this;
        if (vm.PropertyID === -1) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "Please enter property Details"
          });
        } else if (
          vm.propertyData.propertyContent.Timezone === "" ||
          vm.propertyData.propertyContent.Timezone === null
        ) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "Timezone field is mandatary"
          });
        } else if (
          vm.checkinTime == "00:00 AM" ||
          vm.checkoutTime == "00:00 AM"
        ) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "check-in, check-out fields are mandatary"
          });
        } else if (!vm.propertyData.propertyContent.SortOrder) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "Please enter Sort order"
          });
        } else if (
          isNaN(vm.propertyData.propertyContent.SortOrder) ||
          Number(vm.propertyData.propertyContent.SortOrder) < 1
        ) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "Please enter valid Sort order"
          });
        } else {
          // ajax call
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
          //     console.log(data.data, data.data.length);
          //     // vm.imageArr.splice(-1, data.data.length);
          //     console.log("vm.imageArr.splice(-1, data.data.length);", vm.imageArr);
          //     vm.imageData.splice(0, vm.imageData.length);

          //     for (let img of data.data) {
          //       // vm.imageArr.push(apiUrl + '/downloadImage/'+img.imageGuid)
          //       let obj = {};
          //       obj.ImageUrl = apiUrl + '/downloadImage/' + img.imageGuid;
          //       obj.ImageId = -1;
          //       // vm.imageArr.splice(-1,1);
          //       //vm.imageArr.push(obj);
          //       vm.imageData.push(obj);
          //     }
          //     console.log(vm.imageArr)
          //     vm.saveImages();

          //   })
          console.log("vm.ContentId===>", vm.ContentId);

          vm.$store.dispatch("dataRequestHandler", {
            key: "AddPropertyContentDetails",
            params: {
              ModuleAction: "AddPropertyContentDetails",
              ContentId: vm.ContentId,
              propertyId: vm.PropertyID,
              propertyContent: vm.propertyData.propertyContent,
              Description: vm.propertyData.basicData.Content,
              checkinTime: vm.checkinTime,
              checkoutTime: vm.checkoutTime,
              SortOrder: vm.propertyData.propertyContent.SortOrder
              // checkinTime: vm.checkinTime.hh + ':' + vm.checkinTime.mm + '' + vm.checkinTime.a,
              // checkoutTime: vm.checkoutTime.hh + ':' + vm.checkoutTime.mm + '' + vm.checkoutTime.a
            },
            callback: function (error, response) {
              if (error) {
                console.error("Error has occured => ", error);
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "Property Content data Error!",
                  message: error.sqlMessage ? error.sqlMessage : error
                });
                return;
              } else {
                console.log("response in AddPropertyContentDetails", response);
                vm.ContentId = response.recordsets[0][0].ContentId;

                if (response.recordsets[0][0]["ErrorMessage"]) {
                  vm.$store.dispatch("toastr", {
                    type: "error",
                    header: "Validation Errors!",
                    message: response.recordsets[0][0]["ErrorMessage"]
                  });
                  return;
                } else {
                  vm.$store.dispatch("toastr", {
                    type: "success",
                    header: "Success!",
                    message: "Property Content details successfully saved"
                  });
                }
                vm.$router.push(
                  "/propertyDetail/" + vm.propertyData.basicData.PropertyId
                );
                vm.getPropertyDetailById();
              }
              // let propertyurl = response.recordsets[1][0].PropertyId;
              // vm.$router.push("/propertyDetail/" + propertyurl);
            }
          });
          // }
        }

        // axios.post(url, formData)
        //   .then(data => {
        //     console.log(data.data, data.data.length);

        //     console.log("vm.imageArr.splice(-1, data.data.length);", vm.imageArr);
        //     vm.imageData.splice(0, vm.imageData.length);

        //     for (let img of data.data) {

        //       let obj = {};
        //       obj.ImageUrl = img.imageGuid;
        //       obj.ImageId = -1;

        //       vm.imageData.push(obj);
        //     }
        //     console.log(vm.imageArr)
        //     vm.saveImages();

        //   })
      },

      saveImages(imageArr) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "saveAWS_Image",
          params: {
            ModuleAction: "saveAWS_Image",
            propertyId: this.propertyData.basicData.PropertyId,
            // ImageId:null,
            // ImageUrl:vm.imageArr,
            images: vm.imageData,
            BE_Id: null,
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
                message: "Property_Images successfully saved"
              });
              vm.getImages();
            }
          }
        });
      },

      getImages: function () {
        let scope = this;

        this.$store.dispatch("dataRequestHandler", {
          key: "GetImages",
          params: {
            ModuleAction: "GetImages",
            UnitId: null,
            PropertyId: scope.$route.params.propertyId,
            BE_Id: null
          },
          callback: function (err, response) {
            if (response) {
              console.log("response of get Images", response);
              // if (response.ImgUrls && response.ImgUrls !== null) {
              //   scope.imageArr = response.ImgUrls;s

              // }
              if (response.recordsets[0] && response.recordsets[0] !== null) {
                scope.imageArr = response.recordsets[0];
              } else if (response.recordsets[0] === null) {
                scope.imageArr = [];
              }
            } else {
              console.log(err);
            }
          }
        });
      },


      getPropertyDetailById: function () {
        let scope = this;
        //console.log("In viewpropertydetail" + this.$route.params.propertyId);
        this.$store.dispatch("dataRequestHandler", {
          key: "GetPropertyDetailById",
          params: {
            ModuleAction: "GetPropertyDetailById",
            PropertyId: scope.$route.params.propertyId
          },
          callback: function (err, response) {
            if (response) {
              console.log("response in getPropertyDetailById", response);
              // scope.countryList = response.recordsets[0];
              scope.timeZoneList = response.recordsets[1];
              scope.currencyList = response.recordsets[3];
              if (response.recordsets[2].length > 0) {
                scope.statusList = response.recordsets[2];
                // scope.Property_Status = (response.recordsets[2].StatusName === null || response.recordsets[2].StatusName === undefined || response.recordsets[2].StatusName === "") ? {StatusId:"1",StatusName:"Active"} : response.recordsets[2].StatusName;
                console.log("scope.Property_Status=====>", scope.Property_Status);
              }
              //  console.log("scope.Property_Status=====>",scope.Property_Status)
              console.log("response.recordsets[3]", scope.currencyList);
              /*  if (
                    response.recordsets[5].length > 0 &&
                    response.recordsets[6].length > 0
                  ) */
              if (response.recordsets[4].length > 0) {
                scope.propertyData.basicData = response.recordsets[4][0];
                console.log(" scope.propertyData.basicData", scope.propertyData.basicData);
                // scope.propertyData.propertyContent.Content =
                //   response.recordsets[4][0].Content;
                scope.propertyData.propertyContent.Timezone =
                  response.recordsets[4][0].Timezone;
                scope.propertyData.propertyContent.CurrencyId =
                  response.recordsets[4][0].CurrencyId;
                scope.propertyData.propertyContent.PropertyLogo =
                  response.recordsets[4][0].PropertyLogo;
                scope.propertyData.propertyContent.propertyNickName =
                  response.recordsets[4][0].propertyNickName;
                scope.propertyData.propertyContent.checkInTime =
                  response.recordsets[4][0].CheckInTime;
                scope.propertyData.propertyContent.checkOutTime =
                  response.recordsets[4][0].CheckOutTime;
                scope.propertyData.propertyContent.CommissionPercent =
                  response.recordsets[4][0].IsPercent;
                scope.propertyData.propertyContent.SortOrder =
                  response.recordsets[4][0].SortOrder;
                if (response.recordsets[4][0].InspectToClean) {
                  scope.propertyData.propertyContent.InspectToClean =
                    response.recordsets[4][0].InspectToClean;
                }
                scope.CommissionAmount = scope.propertyData.basicData.CommissionAmount
                scope.commissionPercent = scope.propertyData.basicData.IsPercent
                if (scope.commissionPercent == true) {
                  scope.commissionPercent = 1
                } else {
                  scope.commissionPercent = 0
                }
                if (scope.propertyData.basicData.UseDefault == 1) {
                  scope.editDefault = true;
                } else {
                  scope.editDefault = false;
                }
                if (scope.propertyData.basicData.UseDefault == true) {
                  scope.propertyData.basicData.UseDefault = 1
                } else {
                  scope.propertyData.basicData.UseDefault = 0
                }
                if (response.recordsets[4][0].CleanToDirty) {
                  scope.propertyData.propertyContent.CleanToDirty =
                    response.recordsets[4][0].CleanToDirty;
                }
                if (response.recordsets[4][0].CleanToDirtyFlag == true) {
                  scope.propertyData.propertyContent.CleanToDirtyFlag = 1;
                } else {
                  scope.propertyData.propertyContent.CleanToDirtyFlag = 0;
                }
                if (response.recordsets[4][0].CleanToDirtyTime) {
                  scope.propertyData.propertyContent.CleanToDirtyTime =
                    response.recordsets[4][0].CleanToDirtyTime;
                }
                if (response.recordsets[4][0].InspectToCleanFlag == true) {
                  scope.propertyData.propertyContent.InspectToCleanFlag = 1;
                } else {
                  scope.propertyData.propertyContent.InspectToCleanFlag = 0;
                }
                if (response.recordsets[4][0].InspectToCleanTime) {
                  scope.propertyData.propertyContent.InspectToCleanTime =
                    response.recordsets[4][0].InspectToCleanTime;
                }

                scope.ContentId = response.recordsets[4][0].ContentId;
                if (response && response.recordsets[4][0].PropertyId) {
                  scope.PropertyID = response.recordsets[4][0].PropertyId;
                } else {
                  scope.PropertyID = -1;
                }

                scope.Property_Status =
                  response.recordsets[4][0].StatusId === null ||
                    response.recordsets[4][0].StatusId === undefined ||
                    response.recordsets[4][0].StatusId === ""
                    ? { StatusId: "1", StatusName: "Active" }
                    : {
                      StatusId: response.recordsets[4][0].StatusId,
                      StatusName: response.recordsets[4][0].StatusName
                    };
                // scope.$set(scope.Property_Status, 'StatusId', response.recordsets[4][0].StatusId);
                // scope.$set(scope.Property_Status, 'StatusName', response.recordsets[4][0].StatusName);
                // console.log(
                //   "response.recordsets[4][1].PropertyLogo",
                //   scope.propertyData.propertyContent.PropertyLogo
                // );
                // scope.propertyData.basicData.Name = response.recordsets[5][0].Name;
                console.log(
                  "response.recordsets[4][0]",
                  scope.propertyData.basicData.Name
                );
              }
              scope.commissionPercentColor = null;
              if (
                response.recordsets[4] &&
                response.recordsets[4][0] &&
                scope.$route.params.propertyId != -1
              ) {
                if (response.recordsets[4][0].CheckInTime != null) {
                  // var checkinHour = moment(response.recordsets[4][0].CheckInTime, "hh:mm a").format('hh');
                  // var checkinmin = moment(response.recordsets[4][0].CheckInTime, "hh:mm a").format('mm');
                  // var checkinmeridian = moment(response.recordsets[4][0].CheckInTime, "hh:mm a").format('a');
                  // // console.log("response.recordsets[4][0].CheckInTime===>",response.recordsets[4][0].CheckInTime);
                  // scope.checkinTime.hh = checkinHour;
                  // scope.checkinTime.mm = checkinmin;
                  // scope.checkinTime.a = checkinmeridian;
                  // console.log("checkinHour", checkinHour);
                  // console.log("checkinmin", response.recordsets[4][0].CheckInTime);
                  scope.checkinTime = response.recordsets[4][0].CheckInTime;
                }
                if (response.recordsets[4][0].CheckOutTime != null) {
                  // var checkoutHour = moment(response.recordsets[4][0].CheckOutTime, "hh:mm a").format('hh');
                  // var checkoutmin = moment(response.recordsets[4][0].CheckOutTime, "hh:mm a").format('mm');
                  // var checkoutmeridian = moment(response.recordsets[4][0].CheckOutTime, "hh:mm a").format('a');
                  // console.log("checkoutHour", checkoutHour);
                  // console.log("checkoutmin", checkoutmin);
                  // console.log("response.recordsets[4][0].CheckOutTime", response.recordsets[4][0].CheckOutTime);
                  // scope.checkoutTime.hh = checkoutHour;
                  // scope.checkoutTime.mm = checkoutmin;
                  // scope.checkoutTime.a = checkoutmeridian;
                  scope.checkoutTime = response.recordsets[4][0].CheckOutTime;
                }
              }
              // if (scope.propertyData.basicData.PropertyId != null) {
              //   scope.enableCheck = true;
              // }
              // if (scope.propertyData.basicData.Timezone != null) {
              //   var timeZone = scope.timeZoneList.find(
              //     temp =>
              //       temp.TimeZoneId === scope.propertyData.basicData.Timezone
              //   );

              //   scope.displayDropdowns.timeZone =
              //     timeZone.TimeZoneText + " " + timeZone.TimeZoneValue;
              // }
              if (response.recordsets[5].length > 0) {
                if (response.recordsets[5]) {
                  console.log("response.recordsets[5]", response.recordsets[5]);
                  scope.propertyData.basicData.Address1 =
                    response.recordsets[5][0].Address1;
                  scope.propertyData.basicData.Address2 =
                    response.recordsets[5][0].Address2;

                  scope.propertyData.basicData.PhoneNumber =
                    response.recordsets[5][0].PhoneNumber;
                  scope.propertyData.basicData.Email =
                    response.recordsets[5][0].Email;
                  scope.CityName =
                    response.recordsets[5][0].CityName;
                  scope.propertyData.basicData.CountryName =
                    response.recordsets[5][0].CountryName;
                  scope.searchCity = response.recordsets[5][0].CityName;
                  scope.selectedStateAndCountry.CityId =
                    response.recordsets[5][0].CityId;
                  scope.selectedStateAndCountry.StateId =
                    response.recordsets[5][0].StateId;
                  scope.selectedStateAndCountry.CountryId =
                    response.recordsets[5][0].CountryId;
                  scope.searchState = response.recordsets[5][0].StateName;
                  scope.searchCountry = response.recordsets[5][0].CountryName;
                  scope.propertyData.basicData.PostalCode =
                    response.recordsets[5][0].PostalCode;

                  // vm.ContentId=
                  // console.log("response.recordsets[6][0].CityName",propertyData.basicData.CityName);

                  // if (scope.propertyData.mailingData.CountryId != null) {
                  //   var countryM = scope.countryList.find(
                  //     country_temp =>
                  //       country_temp.CountryId ===
                  //       scope.propertyData.mailingData.CountryId
                  //   );

                  //   scope.displayDropdowns.mailingData_countryName =
                  //     countryM.CountryName;
                  // }
                }
                // if (response.recordsets[6][1]) {
                //   scope.propertyData.billingData = response.recordsets[6][1];
                //   if (scope.propertyData.billingData.CountryId != null) {
                //     var country = scope.countryList.find(
                //       country_temp =>
                //         country_temp.CountryId ===
                //         scope.propertyData.billingData.CountryId
                //     );

                //     scope.displayDropdowns.billingData_countryName =
                //       country.CountryName;
                //   }
                // }
              }
              if (response.recordsets[6].length) {
                scope.policyList = response.recordsets[6];

                console.log("response.recordsets[7]", scope.policyList);
                scope.policyList = response.recordsets[6];
                var showChar = 97;
                for (var i in scope.policyList) {
                  var policycontent = scope.policyList[i].Content;
                  if (policycontent && policycontent.length > showChar) {
                    scope.policyList[i].showlesscontent = policycontent.substr(
                      0,
                      showChar
                    );
                    scope.policyList[i].showcontent = "More...";

                    console.log(
                      "policycontent======>",
                      scope.policyList[i].showlesscontent
                    );
                  } else {
                    scope.policyList[i].showlesscontent = policycontent;
                  }
                  scope.policyList[i].showMore = false;
                  scope.policyList[i].showLess = true;
                }
                // console.log(
                //   "scope.saveclientdetails.PolicyData=>",
                //   scope.policyList
                // );
              }
              if (response.recordsets[7].length) {
                scope.AmenitiesList = response.recordsets[7];
                console.log("response.recordsets[7]", scope.AmenitiesList);
              }
              if (response.recordsets[8].length) {
                scope.ApplyAmenitiesList = response.recordsets[8];
                scope.showLessAmenities = response.recordsets[8].slice(0, 8);
                console.log("ApplyAmenitiesList", scope.ApplyAmenitiesList);

                function findIndexByKeyValue(arraytosearch, key, valuetosearch) {
                  for (var i = 0; i < arraytosearch.length; i++) {
                    if (arraytosearch[i][key] == valuetosearch) {
                      return i;
                    }
                  }
                  return null;
                }

                for (var i in scope.ApplyAmenitiesList) {
                  var index = findIndexByKeyValue(
                    scope.AmenitiesList,
                    "ListId",
                    scope.ApplyAmenitiesList[i].ListId
                  );

                  if (index > -1) {
                    scope.AmenitiesList.splice(index, 1);
                  }
                }
              }
              if (response.recordsets[10] && response.recordsets[10].length > 0) {
                scope.differentPaymentAccountUnitList = response.recordsets[10];
                scope.defultAccountUnits = true;
              }
              // if (response.recordsets[9]) {
              //   scope.imageArr = response.recordsets[9];

              //   console.log("scope.imageArr===>", scope.imageArr)

              // }

              // city response
              // if (
              //   response.selectedStateCityAndCountry !== null &&
              //   scope.$route.params.ReservationId !== "-1"
              // ) {
              //   scope.selectedStateAndCountry =
              //     response.selectedStateCityAndCountry;
              //   if (response.selectedStateCityAndCountry.CityName !== null) {
              //     scope.searchCity =
              //       response.selectedStateCityAndCountry.CityName;
              //   }
              //   scope.onChangeCity(response.selectedStateCityAndCountry.CityId);

              //   scope.selectedCityObj.CityId =
              //     response.selectedStateCityAndCountry.CityId;
              //   scope.selectedCityObj.CityName =
              //     response.selectedStateCityAndCountry.CityName;
              // }
              // if (response.selectedStateCityAndCountry === null) {
              //   scope.selectedStateAndCountry = {};

              //   scope.searchCity = "";
              // }
              // city response

              // else {
              //   scope.propertyData.basicData.description = null;
              //   scope.propertyData.basicData.policy = null;
              // }
              // scope.displayDropDownContent();
              // scope.displayCurrencyName();
              scope.displayDropDownContent();

              scope.displayCurrencyName();
              scope.Get_PaymentAccount_Details();
              // scope.replicateData();
            } else {
              console.log(err);
            }
          }
        });
      },
      // replicateData: function () {
      //   if (this.propertyData.basicData.UseMailingInfo == true) {
      //     this.propertyData.billingData.billingStateId = this.propertyData.mailingData.mailingStateId;
      //     this.propertyData.billingData.ContactName = this.propertyData.mailingData.ContactName;
      //     this.propertyData.billingData.PhoneAreaCode = this.propertyData.mailingData.PhoneAreaCode;
      //     this.propertyData.billingData.PhoneNumber = this.propertyData.mailingData.PhoneNumber;
      //     this.propertyData.billingData.PhoneExtension = this.propertyData.mailingData.PhoneExtension;
      //     this.propertyData.billingData.Email = this.propertyData.mailingData.Email;
      //     this.propertyData.billingData.Address1 = this.propertyData.mailingData.Address1;
      //     this.propertyData.billingData.Address2 = this.propertyData.mailingData.Address2;
      //     this.propertyData.billingData.Address3 = this.propertyData.mailingData.Address3;
      //     this.propertyData.billingData.FaxAreaCode = this.propertyData.mailingData.FaxAreaCode;
      //     this.propertyData.billingData.FaxNumber = this.propertyData.mailingData.FaxNumber;
      //     this.propertyData.billingData.FaxExtension = this.propertyData.mailingData.FaxExtension;
      //     this.propertyData.billingData.City = this.propertyData.mailingData.City;
      //     this.propertyData.billingData.billingState = this.propertyData.mailingData.mailingState;
      //     this.propertyData.billingData.PostalCode = this.propertyData.mailingData.PostalCode;
      //     this.propertyData.billingData.CountryId = this.propertyData.mailingData.CountryId;
      //     this.isDisabled = true;
      //   } else {
      //     this.isDisabled = false;
      //   }
      // },
      changeMethod(field) {
        if (
          this.propertyData.basicData.UseMailingInfo === true &&
          this.propertyData.billingData.hasOwnProperty(field) &&
          this.propertyData.mailingData.hasOwnProperty(field)
        ) {
          this.propertyData.billingData[field] = this.propertyData.mailingData[
            field
          ];
        }
      },
      // displayDropDownContent: function () {
      //   let timeZone = this.timeZoneList.find(
      //     temp => temp.TimeZoneId === this.propertyData.basicData.Timezone
      //   );

      //   this.displayDropdowns.timeZone =
      //     timeZone.TimeZoneText + " " + timeZone.TimeZoneValue;

      // },
      displayDropDownContent: function () {
        console.log("in time zone");
        let timeZones = this.timeZoneList.find(
          temp => temp.IANACode === this.propertyData.propertyContent.Timezone
        );
        console.log(
          "this.propertyData.propertyContent.timeZone",
          this.propertyData.propertyContent.Timezone
        );
        this.displayDropdowns.Timezone = timeZones
          ? timeZones.TimeZoneDetails
          : undefined;
      },
      displayCurrencyName: function () {
        let currency = this.currencyList.find(
          currency_temp =>
            currency_temp.CurrencyId ===
            this.propertyData.propertyContent.CurrencyId
        );
        this.displayDropdowns.basicCurrencyName = currency
          ? currency.CurrencyName + " " + currency.CurrencyAbbr
          : undefined;
      },
      displayMailingCountryName: function () {
        let country = this.countryList.find(
          country_temp =>
            country_temp.CountryId === this.propertyData.mailingData.CountryId
        );

        this.displayDropdowns.mailingData_countryName = country.CountryName;
        this.displayBillingCountryName();
      },
      displayBillingCountryName: function () {
        let country = this.countryList.find(
          country_temp =>
            country_temp.CountryId === this.propertyData.billingData.CountryId
        );
        console.log("countryvalue" + country.CountryName);

        this.displayDropdowns.billingData_countryName = country.CountryName;
      },
      readURL(input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $("#imagePreview").css(
              "background-image",
              "url(" + e.target.result + ")"
            );
            $("#imagePreview").hide();
            $("#imagePreview").fadeIn(650);
          };
          reader.readAsDataURL(input.files[0]);
        }
      },
      displaySection: function (name) {
        if (name === "propertyInfo") {
          this.isBgColor6 = false;
          this.isBgColor1 = true;
          this.isBgColor3 = false;
          this.isBgColor2 = false;
          this.isBgColor4 = false;
          this.isBgColor5 = false;
          this.showPolicies = false;
          this.showPolicy = true;
          this.displaySectionValue = name;
        }
        if (name === "contentDetails") {
          this.isBgColor6 = false;
          this.isBgColor2 = false;
          this.isBgColor1 = false;
          this.isBgColor3 = true;
          this.isBgColor4 = false;
          this.isBgColor5 = false;
          this.showPolicies = false;
          this.showPolicy = true;
          this.displaySectionValue = name;
        }
        if (name === "mailingInformation") {
          this.isBgColor6 = false;
          this.isBgColor3 = true;
          this.isBgColor2 = false;
          this.isBgColor1 = false;
          this.isBgColor4 = false;
          this.isBgColor5 = false;
          this.showPolicies = false;
          this.showPolicy = true;
          this.displaySectionValue = name;
        }
        if (name === "Policy") {
          this.isBgColor6 = false;
          this.isBgColor4 = true;
          this.isBgColor3 = false;
          this.isBgColor2 = false;
          this.isBgColor1 = false;
          this.isBgColor5 = false;
          if (this.policyList && this.policyList.length > 0) {
            this.showpolicybutton = true;
            this.displaySectionValue = name;
          }
          this.showPolicies = true;
          this.showPolicy = false;
        }
        if (name === "Amenities") {
          this.isBgColor6 = false;
          this.isBgColor4 = false;
          this.isBgColor3 = false;
          this.isBgColor2 = false;
          this.isBgColor1 = false;
          this.isBgColor5 = true;
          this.showPolicies = false;
          this.showPolicy = true;
          this.displaySectionValue = name;
        }

        if (name === "paymentSetup") {
          this.isBgColor6 = true;
          this.isBgColor4 = false;
          this.isBgColor3 = false;
          this.isBgColor2 = false;
          this.isBgColor1 = false;
          this.isBgColor5 = false;
          this.showPolicies = false;
          this.showPolicy = false;
          this.displaySectionValue = name;
        }
        // this.displaySectionValue = name;

        // this.displaySectionValue = name;
        // if (name == "propertyInfo" && this.propertyData.basicData.PropertyName == null) {
        //   this.displaySectionValue = name;
        // }
        // else

        //   if (this.enableCheck == false) {
        //     this.displaySectionValue = null;
        //     this.$store.dispatch("toastr", {
        //       type: "warning",

        //       message: "Please enter Property Info !"
        //     });
        //   }
        //   else {
        //     this.displaySectionValue = name;
        //   }
        // if (
        //   name === "propertyInfo" &&
        //   this.propertyData.basicData.PropertyName == null
        // ) {
        //   this.displaySectionValue = name;

        // } else if (this.propertyData.basicData.PropertyName == null) {
        //   this.displaySectionValue = null;
        //   this.$store.dispatch("toastr", {
        //     type: "warning",
        //     message: "Please enter Property Info !"
        //   });
        // } else {
        //   this.displaySectionValue = name;
        // }

        // ?
        // if (this.propertyData.basicData.PropertyName) {
        //     this.displaySectionValue = name;

        //   } else if (name === "propertyInfo") {
        //     this.displaySectionValue = name;
        //   }
        //   else {
        //     this.displaySectionValue = null;
        //     this.$store.dispatch("toastr", {
        //       type: "warning",
        //       message: "Please enter Property Info !"
        //     });
        //   }
        //
      },
      fetchData: function () {
        console.log(this.$route.params.propertyId);
        this.getPropertyDetailById();
      },
      getImageId(id) {
        this.selectedImageId = id;
      },
      getPropertyTypeList() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetPropertyTypeList",
          params: {
            ModuleAction: "GetPropertyTypeList"
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in GetPropertyTypeList", response);
              vm.propertyTypeList = response.recordsets[0];
            }
          }
        });
      },
      Get_PaymentAccount_Details() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_PaymentAccount_Details",
          params: {
            ModuleAction: "Get_PaymentAccount_Details",
            propertyId: vm.PropertyID,
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
              vm.IsLive = response[3][0].IsLive
            }
          }
        });
      }
    },
    computed: {
      propertyName() {
        return `The propertyname name is: ${this.propertyData.propertyName}`;
      },
      fncIsPropertySave() {
        let vm = this;
        if (vm.$route.params.propertyId === "-1") {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncPropertySave"
          )
            ? vm.$store.state.userEntitlementList.fncPropertySave
            : null;
        } else if (vm.$route.params.propertyId > 0) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncPropertyUpdate"
          )
            ? vm.$store.state.userEntitlementList.fncPropertyUpdate
            : null;
        }
      }
    },

    watch: {
      /*  propertyId: function(value) {
            this.getPropertyDetailById();
          } */
      // searchCity(newValue, oldValue) {
      //   let vm = this;
      //   cityList: [];
      //   vm.propertyData.basicData.CityName = vm.searchCity;
      //   if (newValue.length > 0) {
      //     console.log("Firing search", newValue);
      //     vm.$store.dispatch("dataRequestHandler", {
      //       key: "GetCitySearch",
      //       params: {
      //         ModuleAction: "GetCitySearch",
      //         SearchLocation: newValue,
      //         SearchId: 1
      //       },
      //       callback: function (err, response) {
      //         if (err) {
      //           return;
      //         }
      //         // if (response) {
      //         //   console.log("response in search city", response);
      //         //   if (newValue && oldValue)
      //         //      vm.cityList = response;
      //         // }

      //         if (response) {
      //           console.log("response in search city", response);
      //           if (newValue && oldValue) vm.cityList = response;
      //         }
      //       }
      //     });
      //   }
      // },

      searchCity(newValue, oldValue) {
        let vm = this;
        vm.cityList = [];
        // vm.isCitySelected = false;
        // vm.propertyData.basicData.CityName = newValue;
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
                    (newValue && vm.$route.params.PropertyId == "-1")
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
        vm.propertyData.basicData.StateName = newValue;
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
                    (newValue && vm.$route.params.PropertyId == "-1")
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
        vm.propertyData.basicData.CountryName = newValue;
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
                    (newValue && vm.$route.params.PropertyId == "-1")
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
      console.log("propertyDetail mount");
      vm.getPropertyDetailById();
      this.GetUserEntitlementsAndDefaultProperty();
      vm.getImages();
      vm.getPropertyTypeList();
      $(document).click(function (e) {
        console.log("clicked on doc");
        $("#Amenitiesdropdowns").hide();
        $(".searchLocations").hide();
        let classsName = "#" + vm.paymentAccountEdit;
        $(classsName).removeClass("show");
        // $(".searchLocations").hide();
        // if (vm.isCitySelected == false && vm.cityList.length > 0) {
        //   console.log("here in click");
        //   vm.enableStateCountry = true;
        // }

        // vm.showLedgerAccounts = false;
        // vm.showAmenitiesList =false;
      });

      // function readURL(input) {
      // if (input.files && input.files[0]) {
      //   var reader = new FileReader();
      //   reader.onload = function (e) {
      //     $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
      //     $('#imagePreview').hide();
      //     $('#imagePreview').fadeIn(650);
      //   }
      //   reader.readAsDataURL(input.files[0]);
      // }
      // }
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

  .btn:active {
    color: #ccc;
    background-color: #6ab5ae;
    border-color: #6ab5ae;
    outline: none;
  }
</style>