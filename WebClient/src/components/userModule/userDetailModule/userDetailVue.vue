<template src="./userDetailVue.template.html"></template>

<style>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }

  /* .js-is-hidden {
	display: none;
} */

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
<script>
  //   var box = document.querySelector(".box");

  // // Detect all clicks on the document
  // document.addEventListener("click", function(event) {
  // 	// If user clicks inside the element, do nothing
  // 	if (event.target.closest(".box")) return;

  // 	// If user clicks outside the element, hide it!
  // 	box.classList.add("js-is-hidden");
  // });
  $(document).click(function () {
    $("#dropdown").hide('fast');
  });

  $("#dropdown").click(function (e) {
    e.stopPropagation();
  });

  import Vue from "vue";
  import VeeValidate from "vee-validate";
  import * as axios from 'axios';

  Vue.use(VeeValidate);



  export default {
    name: "UserDetail",
    props: ["userId"],
    data() {

      return {
        apiUrl: window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":1339" : ''),
        isBgColor1: true,
        isBgColor2: false,
        isBgColor3: false,
        isBgColor4: false,
        defaultPropertyId: {},
        IsDefault: 1,
        editMode: false,
        currentpassword: "",
        newpassword: "",
        conformpassword: "",

        selectedUser: "",
        imageData: [],
        imageArr: [],
        logo: '',

        // pencil:true,
        // upload:false,


        // StatusId:1,
        showNewUser: false,
        newEntity: null,
        emailRegEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        userDetail: {
          UserId: -1,
          LoginId: "",
          UserFirstName: "",
          UserLastName: "",
          Email: "",
          UserPassword: "",
          currentpassword: "",
          Repassword: "",
          OldPassword: null,
          ProfileImage: "",
          StatusId: null,

          DeviceIds: {
            apps: {
              Android: [],
              IOS: [],
              Web: [],
              Email: [],
              SMS: []
            }
          }
        },
        phoneNumberRegEx: /^\d{10}$/,
        passwordVerification: {
          CurrentPassword: "",
          NewPassword: "",
          Repassword: ""
        },
        showModal: false,
        RoleList: [],
        checkedRole: [],
        propertyList: [],
        propertylist: [],
        showPropertyList: false,
        dropDownList: false,
        propertylistItems: [],
        checkedProperty: [],
        user_Status: {},
        statusList: [],
        displaySectionValue: "userDetails",
        showMore: false,
        showLess: true,

        // propertymore:'more',
        showRoles: false,
        showProperties: false,




        applyRoleList: [],
        ApplypropertyList: []
      };


    },

    methods: {
      imageURLS(imgGuid) {

        let isBase64 = /^data:image\/([a-zA-Z]*);base64,([^\"]*)/.test(imgGuid)
        if (isBase64) {
          return imgGuid;
        }
        return this.apiUrl + '/downloadImage/' + imgGuid + '/430x300';
      },
      showAmenitiesListFnc() {
        setTimeout(function () {
          this.dropDownList = !this.dropDownList;
          $("#dropdownlist").show();
        }, 10);

      },


      showMorepropertyList() {
        console.log("showMorepropertyList");
        let vm = this;
        vm.showLess = false,
          vm.showMore = true
      },
      showLesspropertyList() {
        console.log("showLesspropertyList");
        let vm = this;
        vm.showLess = true,
          vm.showMore = false
      },
      // removeAppliedRoleList: function (applyRole) {
      //   let scope = this;
      //   var index = scope.applyRoleList.indexOf(applyRole);
      //   console.log("index============>", index);
      //   if (index > -1) {
      //     scope.applyRoleList.splice(index, 1);
      //   }
      // },

      removeAppliedRoleList(applyRole) {
        let scope = this;
        applyRole.IsAssigned = 0

      },


      removeAppliedPropertyList(property) {
        let scope = this;
        property.IsAssigned = 0

      },


      // addRoles: function (role) {
      //   let vm = this;
      //   vm.applyRoleList.push({
      //     RoleId: role.RoleId,
      //     RoleName: role.RoleName
      //   });

      // },
      addRoles(role) {
        let scope = this;
        role.IsAssigned = 1;
        console.log(JSON.stringify(scope.RoleList))
        scope.applyRoleList.push(role);

      },


      addProperties(property) {
        let scope = this;
        property.IsAssigned = 1;
        console.log(JSON.stringify(scope.propertyList))
        scope.ApplypropertyList.push(property);

      },


      showRoleList: function () {
        this.showRoles = !this.showRoles
      },
      showpropertyList: function () {
        this.showProperties = !this.showProperties
      },


      //   submit:function() {
      //     alert("validation ok");
      //   this.$validator
      //     .validateAll()
      //     .then(function(response) {
      //       // Validation success if response === true
      //     })
      //     .catch(function(e) {
      //       // Catch errors
      //     })
      // },
      redirectToPassword: function () {
        let vm = this
        vm.$router.push("/userValidate");
      },
      deleteUser: function () {
      },
      editUser: function () {
        this.editMode = !this.editMode;
      },


      saveUser: function () {
        let vm = this;
        let userDetail = vm.userDetail;

        if (!vm.emailRegEx.test(userDetail.Email)) {
          //console.log("Invalid email");
          vm.$store.dispatch("toastr", {
            type: "warning",
            message: "Please enter valid E-mail Id",
            header: "Email"
          });
          return;
        }
        if ((userDetail.LoginId === "" || userDetail.LoginId === undefined) || (userDetail.Email === "" || userDetail.UserPassword === "" || userDetail.UserPassword === undefined)) {
          // console.log("vm.guestInfo.GuestFirstName");
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "LoginId,  E-mail, UserPassword are mandatary"
          });
        }
        else {


          // if (vm.roleList.length > 0) {
          //   for (let roleIndex = 0; roleIndex < vm.roleList.length; roleIndex++) {
          //     if (Number(vm.roleList[roleIndex]["IsAssigned"]))
          //       vm.checkedRole.push(vm.roleList[roleIndex]["RoleId"]);
          //   }
          // }


          // if (vm.propertyList.length > 0) {
          //   for (let propertyIndex = 0; propertyIndex < vm.propertyList.length; propertyIndex++) {
          //     if (Number(vm.propertyList[propertyIndex]["IsAssigned"]))
          //       vm.checkedProperty.push(vm.propertyList[propertyIndex]["PropertyId"]);
          //   }
          // }
          if (vm.propertyList && vm.propertyList.length > 0) {
            let defaultPropertyObj = vm.propertyList.filter(function (propertyObj) {
              return propertyObj.IsDefault;
            });
            // console.log("defaultPropertyObj", defaultPropertyObj);
          }





          // if (vm.applyRoleList !== null) {
          //   console.log("in for loop");
          //   console.log(" vm.applyRoleList.length", vm.applyRoleList.length);

          //   for (let i = 0; i < vm.applyRoleList.length; i++) {
          //     console.log("i", i);
          //     console.log("vm.applyRoleList", vm.applyRoleList[i])
          //     roleIds.push(vm.applyRoleList[i].RoleId);
          //     console.log('roleIds', roleIds)
          //   }
          // }
          let roleIds = [];
          for (var i in vm.RoleList) {
            if (vm.RoleList[i].IsAssigned === 1) {
              roleIds.push(vm.RoleList[i].RoleId);
            }
          }

          let propertyIds = [];
          for (var i in vm.propertyList) {
            if (vm.propertyList[i].IsAssigned === 1) {
              propertyIds.push(vm.propertyList[i].PropertyId);
            }
          }
          // if (vm.prop !== null) {
          //   console.log("in for loop");
          //   console.log(" vm.ApplypropertyList.length", vm.ApplypropertyList.length);

          //   for (let i = 0; i < vm.ApplypropertyList.length; i++) {
          //     console.log("i", i);
          //     console.log("vm.ApplypropertyList", vm.ApplypropertyList[i])
          //     propertyIds.push(vm.ApplypropertyList[i].PropertyId);
          //     console.log('PropertyIds=====>', propertyIds);
          //   }
          // }
          this.userDetail.ProfileImage = vm.logo;
          console.log("this.userDetail.ProfileImage", this.userDetail.ProfileImage);
          let userObject = {
            UserId: vm.$route.params.userId,
            LoginId: vm.userDetail.LoginId,
            UserFirstName: vm.userDetail.UserFirstName,
            UserLastName: vm.userDetail.UserLastName,
            Email: vm.userDetail.Email,
            // UserPassword: vm.userDetail.UserPassword,
            UserPassword: vm.userDetail.UserPassword,
            profileImage: vm.userDetail.ProfileImage,
            DeviceIds: vm.userDetail.DeviceIds,
            StatusId: vm.user_Status.StatusId,
            roleIds: roleIds,
            propertyIds: propertyIds,
            // defaultPropertyId: defaultPropertyObj && defaultPropertyObj[0] ? defaultPropertyObj[0].PropertyId : -1,
            ModuleAction: "SaveUserDetail"
          };


          vm.$store.dispatch("dataRequestHandler", {
            key: "CreateUser",
            params: userObject,
            // applyRoleList: vm.applyRoleList,

            callback: function (error, response) {
              // console.log("userobject", userObject);

              console.log("userresponse", response);
              if (error) {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "user error!",
                  message: error.sqlMessage ? error.sqlMessage : error
                });
                return;
              }

              if ((response && response[0][0].ErrorMessage === "") || response[1][0].ErrorMessage === "" || response[0][0].ErrorMessage === " " || response[0][0].ErrorMessage === null || response[0][0].ErrorMessage === "null") {
                // console.log("SaveRoleDetail", response);
                // vm.$router.push("/roleDetail/" + response.RoleIdSaved);
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "user saved sucessfully"
                });
                // console.log("location reload");
                // location.reload();
                // vm.GetUserEntitlementsAndDefaultProperty()   
                let userUrl = response[2][0].UserId;
                vm.$router.push("/userDetail/" + userUrl);
                location.reload();
              }

              else {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "Error While saving",
                  message: response[0][0].ErrorMessage
                });
              }
              // }
            }

          });
        }

        // vm.$store.dispatch("dataRequestHandler", {
        //   key: "CreateUser",
        //   params: userObject,
        //   callback: function (err, response) {
        //     console.log("userobject", userObject);
        //     // console.log("response", response);
        //     // console.log("userresponse", response);
        //     if (response.recordsets[1][0].UserId > 0) {
        //       vm.$router.push("/users");
        //     }
        //     else
        //       vm.$store.dispatch("toastr", {
        //         type: "error",
        //         message: "allowed only one radio check",
        //         header: "radio"
        //       });

        //   }

        // });


        // vm.checkedProperty.forEach(function (value) {
        //   if(value === defaultPropertyObj){
        //     vm.$store.dispatch("toastr", {
        //           type:"success",
        //           header: "radio check success!",
        //           message: "success",
        //         });
        // //         vm.$store.dispatch("dataRequestHandler", {
        // //   key: "CreateUser",
        // //   params: userObject,
        // //   callback: function (err, response) {
        // //     if (err) {
        // //       return;
        // //     }
        // //     else
        // //       vm.$router.push("/users");
        // //   }

        // // });

        //     }

        //     else
        //       vm.$store.dispatch("toastr", {
        //         type:"error",
        //         header: "radio",
        //        message: "does not allow where radio is not assigned to right propertyId",

        //     });


        // });

      },
      // userListRender(){
      //   let vm = this;
      //   vm.$router.push("/users");
      //   },
      deletelogo: function (logo) {
        let vm = this;
        vm.pencil = false;
        vm.upload = true;
        console.log("logo=====>", logo);
        vm.logo = "";
      },
      getUserDetail: function () {
        let self = this;

        self.$store.dispatch("dataRequestHandler", {
          key: "GetUserDetail",
          params: {
            UserId: self.$route.params.userId,
            ModuleAction: "GetUserDetailById"
          },
          callback: function (err, response) {
            console.log("user Detail recordsets", response);
            if (err) {
              return;
            }
            console.log("getUserDetail.response => ", JSON.parse(JSON.stringify(response)));
            // if (response.recordsets[0][0]) {

            //   self.userDetail = response.recordsets[1][0];
            // }
            // if (Array.isArray(response.recordsets[2])) {
            //   self.RoleList = response.recordsets[2];
            // }
            // if (Array.isArray(response.recordsets[3])) {


            //   self.propertyList = response.recordsets[3];


            //   self.ApplypropertyList = response.recordsets[3].slice(0, 8)
            //   console.log("propertylist", self.propertyList);

            // }


            // if (Array.isArray(response.recordsets[4])) {
            //   self.statusList = response.recordsets[4];
            //   console.log("statusList", self.statusList);
            // }
            // roles


            if (response.hasOwnProperty("rolesList")) {
              self.RoleList = response.rolesList;
            }
            if (response.hasOwnProperty("statusList")) {
              self.statusList = response.statusList;
              // console.log("self.statusList",self.statusList);
              // self.user_Status = (response.userObj.StatusId === null || response.userObj.StatusId=== undefined || response.userObj.StatusId === "") ? {StatusId:"1",StatusName:"Active"} :{statusId:response.userObj.StatusId,StatusName:response.userObj.StatusName};

              console.log("self.user_Status", self.user_Status);

              console.log("statusList==> of user", self.statusList)
            }
            if (response.hasOwnProperty("userObj")) {
              self.userDetail = response.userObj;
              // self.$set(self.user_Status, 'StatusId', response.userObj.StatusId);
              // self.$set(self.user_Status, 'StatusName', response.userObj.StatusName);
              // console.log("self.userDetail==============>", response.userObj)
              // console.log("self.statusList",self.statusList);

              self.user_Status = (response.userObj.StatusId === null || response.userObj.StatusId === undefined || response.userObj.StatusId === "") ? { StatusId: "1", StatusName: "Active" } : { StatusId: response.userObj.StatusId, StatusName: response.userObj.StatusName };
              console.log("response.userObj.StatusId", response.userObj.StatusId);
              if (response.userObj.ProfileImage != null || response.userObj.ProfileImage != "") {
                console.log("response.userObj.ProfileImage", response.userObj.ProfileImage);
                self.logo = response.userObj.ProfileImage;

              }

            }

            if (response.hasOwnProperty("propertylist")) {
              self.propertyList = response.propertylist;
              self.ApplypropertyList = self.propertylist.slice(0, 8)
            }


          }
        });
      },

      //assign user to role
      onUserSearch(options) {
        let that = this;
        that.$store.dispatch("dataRequestHandler", {
          key: "SearchUsers",
          params: {
            query: options.query
          },
          callback: (err, response) => {
            if (Array.isArray(response)) {
              this.searchUserResultsArray.splice(0, Infinity, ...response[0]);
            }
          }
        });
      },
      toggleUserSearch(instruction) {
        let showUserSearch =
          typeof instruction === "boolean" ? instruction : false;
        if (!showUserSearch) {
          this.searchUserResultsArray.splice(0);
        }
      },
      assignUserToRole(selectedUserInstance) {
        //console.log(selectedUserInstance);
        this.userDetail.response.ReportingManagerId =
          selectedUserInstance.vwUserIdText;
      },
      fetchData: function () {
        console.log(this.$route.params.userId);
        this.getUserDetail();
      },
      roles: function (role) {
        this.checkedRole.push(role.RoleId);
      },
      properties: function (property) {
        this.checkedProperty.push(property.PropertyId);
      },

      displaySection: function (name) {
        if (name === "userDetails") {
          console.log("name", name)
          this.isBgColor1 = true
          this.isBgColor3 = false
          this.isBgColor2 = false
          this.isBgColor4 = false
        }
        if (name === "loginDetails") {
          this.isBgColor2 = true
          this.isBgColor1 = false
          this.isBgColor3 = false
          this.isBgColor4 = false
        }
        if (name === "rolesDetails") {
          this.isBgColor3 = false
          this.isBgColor2 = true
          this.isBgColor1 = false
          this.isBgColor4 = false
        }
        if (name === "propertyDetails") {
          this.isBgColor4 = false
          this.isBgColor3 = true
          this.isBgColor2 = false
          this.isBgColor1 = false
        }
        if (name === "hide") {
          this.displaySectionValue = '';
        }
        console.log("In display section " + name);
        this.displaySectionValue = name;
      },
      // processLogo(e) {
      //   let files = e.target.files || e.dataTransfer.files;
      //   if (!files.length) {
      //     this.userDetail.ProfileImage = null;
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
      //     this.userDetail.ProfileImage = vm.image;
      //   };

      //   reader.readAsDataURL(file);
      // },
      // aws image
      processLogo(e) {
        // this.pencil = true;
        // this.upload=false;
        // this.pencil= true;
        let files = e.target.files || e.dataTransfer.files;
        this.imageData.push(files[0])
        if (!files.length) {
          this.userDetail.ProfileImage = null;
          return;
        } else {
          this.createImage(files[0]);
        }
      },
      createImage(file) {
        let reader = new FileReader();
        let vm = this;
        reader.onload = e => {
          vm.image = e.target.result;
          // vm.saveclientdetails.clientContent.ClientLogo = vm.image;
          // console.log("image===================>",vm.image)
          // vm.clientImages.push(vm.image);
          const formData = new FormData();
          Array
            .from(Array(this.imageData.length).keys())
            .map(x => {
              formData.append("photos", this.imageData[x], this.imageData[x].name);
            });
          // console.log(apiUrl + '/upload')
          let url = this.apiUrl + '/upload';


          // if (isLogo == 0) {
          //   let obj = {};
          //   obj.ImageUrl = vm.image;
          //   obj.ImageId = -1;

          //   vm.imageArr.push(obj);

          //   axios.post(url, formData)
          //     .then(data => {
          //       console.log(data.data);
          //       vm.imageData.splice(0, vm.imageData.length);
          //       for (let img of data.data) {
          //         // vm.imageArr.push(apiUrl + '/downloadImage/' + img.imageGuid)
          //         let obj = {};
          //         obj.ImageUrl = img.imageGuid;
          //         obj.ImageId = -1;
          //         // vm.imageArr.splice(-1,1);
          //         vm.imageData.push(obj);
          //       }
          //       // console.log(vm.imageArr)
          //       vm.saveImages();

          //     })

          // }
          // else {
          axios.post(url, formData)
            .then(data => {
              console.log(data.data);
              vm.imageData.splice(0, vm.imageData.length);
              for (let img of data.data) {

                vm.logo = img.imageGuid;
              }

            })

          // }

        };
        reader.readAsDataURL(file);
      },
      // aws image

      changePassword: function () {


        let self = this;

        self.$store.dispatch("dataRequestHandler", {
          key: "UpdatePassword",
          params: {
            UserId: self.$route.params.userId,
            OldPassword: self.currentpassword,
            NewPassword: self.newpassword,
            ModuleAction: "UpdatePassword"

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
      resetPassword: function () {


        let self = this;

        self.$store.dispatch("dataRequestHandler", {
          key: "ResetPassword",
          params: {
            UserId: self.$route.params.userId,
            OldPassword: self.OldPassword,
            NewPassword: self.newpassword,
            ModuleAction: "ResetPassword"

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


      getUserProfile() {
        let self = this;
        console.log("getUserProfile mounted")
        self.$store.dispatch("dataRequestHandler", {
          key: 'GetUserProfile', params: {}, callback: function (err, response) {


            if (response) {

              self.selectedUser = (response[0][0].UserId).toString();
              console.log("self.selectedUser", self.selectedUser);

            }


          }
        });
      },

    },
    computed: {

      // fncIsUserSave() {
      //   let vm = this;

      //   if (vm.userDetail.UserId === "" || vm.userDetail.UserId === -1 ||  vm.userDetail.UserId === "-1" ) {
      //     return vm.$store.state.userEntitlementList.hasOwnProperty("fncUserSave") ? vm.$store.state.userEntitlementList.fncUserSave : null;
      //   }
      //   else if (vm.userDetail.UserId > 0) {
      //     return vm.$store.state.userEntitlementList.hasOwnProperty("fncUserUpdate") ? vm.$store.state.userEntitlementList.fncUserUpdate : null;
      //   }

      // }
      fncIsUserSave() {
        let vm = this;
        if (vm.$route.params.userId === "-1" || vm.$route.params.userId === -1) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncUserSave"
          )
            ? vm.$store.state.userEntitlementList.fncUserSave
            : null;
        } else if (vm.$route.params.userId > 0) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncUserUpdate"
          )
            ? vm.$store.state.userEntitlementList.fncUserUpdate
            : null;
        }
      }

    },
    mounted() {
      console.log("user detail");
      this.getUserDetail();
      this.getUserProfile();
      $(document).click(function (e) {
        console.log("clicked on doc");
        $("#dropdownlist").hide();
        // vm.showLedgerAccounts = false;
        // vm.showAmenitiesList =false;
      })
    },
    beforeDestroy() {
      // $(document).unbind( "click");
    },
    watch: {
      $route: "fetchData"
    },
    components: {
      modal: {
        data() {
          return { showModal: false };
        },
        // template: "#modal-template",
        methods: {}
      }
    }
  };
</script>