<template src="./roleDetail.template.html"></template>
<script>
  export default {
    name: "RoleDetail",
    props: [],
    data() {
      return {
        isBgColor1 : true,
        entityPermissionUseCaseMapping: null,
        role_Status: {},
        roleDetail: {
          Name: "",
          Description: "",
          // StatusId: 1

        },
        entityPermissionScheme: [],
        usecasesAssociatedToRole: [],
        specialFunctions:[],
        HousekeepingIncludede:[],
        StatusObj: [],
        nullObject: null,
        // selectedStatusObj: {
        //   StatusName : "Active",
        //   StatusId: 1
        // },
        entityNames: ["View", "Add", "Update", "Delete", "Reports","IsIncluded"]
      };
    },
    methods: {
      checkAllPermissionsForSelectedEntity(inst, $event) {
        if (inst.View !== null) {
          inst.View = $event.target.checked === true ? 1 : 0;
        }

        if (inst.Add !== null) {
          inst.Add = $event.target.checked === true ? 1 : 0;
        }

        if (inst.Update !== null) {
          inst.Update = $event.target.checked === true ? 1 : 0;
        }

        if (inst.Delete !== null) {
          inst.Delete = $event.target.checked === true ? 1 : 0;
        }

        if (inst.Reports !== null) {
          inst.Reports = $event.target.checked === true ? 1 : 0;
        }

        if (inst.Manage !== null) {
          inst.Manage = $event.target.checked === true ? 1 : 0;
        }
        inst.isCheckAllPermissions = true;
        console.log($event.target.checked);
      },
      permissionChanged(inst, $event, permission_name) {
        let shouldEntityCheckBoxBeChecked = false;
        if ($event.target.checked === false) {
          inst.isCheckAllPermissions = shouldEntityCheckBoxBeChecked;
        } else {
          this.entityNames.forEach(obj => {
            if (permission_name != obj) {
              if (inst[obj] !== null) {
                if (inst[obj] === 1 || inst[obj] === true) {
                  shouldEntityCheckBoxBeChecked = true;

                }

                else {
                  shouldEntityCheckBoxBeChecked = false;
                  inst.View = 1;
                }
              }
            }
          });
          inst.isCheckAllPermissions = shouldEntityCheckBoxBeChecked;
        }
      },
      getRoleDetail: function () {
        let self = this;

        self.$store.dispatch("dataRequestHandler", {
          key: "GetRoleDetail",
          params: {
            ModuleAction: "GetRoleDetail",
            RoleId: self.$route.params.roleId
          },
          callback: function (err, response) {
            console.log("GetRoleDetail===>", response);
            if (err) {
              return;
            }

            if (response.hasOwnProperty("statusObj")) {
              self.StatusObj = response.statusObj

              self.role_Status = (response.roleObj.StatusName === null || response.roleObj.StatusName === undefined || response.roleObj.StatusName === "") ? { StatusId: "1", StatusName: "Active" } : { StatusId: response.roleObj.StatusId, StatusName: response.roleObj.StatusName };
              console.log("self.role_Status", self.role_Status);

            }
            if (response.hasOwnProperty("roleObj")) {
              self.roleDetail = response.roleObj;
              console.log("self.roleDetail", self.roleDetail);
              // self.$set(self.role_Status, 'StatusId', response.roleObj.StatusId);
              // self.$set(self.role_Status, 'StatusName', response.roleObj.StatusName);
              self.roleDetail.StatusId = response.roleObj.StatusId

              // console.log("self.roleDetail",self.roleDetail);
            }
            if (response.hasOwnProperty("entityPermissionScheme")) {
              console.log(response.entityPermissionScheme);
              response.entityPermissionScheme.forEach(entityPermissionObj => {
                // This logic has to be changed to account the check for a permission only and if only its defined.
                let shouldEntityCheckBoxBeChecked = true;

                if (entityPermissionObj.Add !== null) {
                  if (entityPermissionObj.Add === 0 || entityPermissionObj.Add === false) {
                    shouldEntityCheckBoxBeChecked = false;
                  }
                }

                if (entityPermissionObj.View !== null && shouldEntityCheckBoxBeChecked === true) {
                  if (entityPermissionObj.View === 0 || entityPermissionObj.View === false) {
                    shouldEntityCheckBoxBeChecked = false;
                  }
                }

                if (entityPermissionObj.Update !== null && shouldEntityCheckBoxBeChecked === true) {
                  if (entityPermissionObj.Update === 0 || entityPermissionObj.Update === false) {
                    shouldEntityCheckBoxBeChecked = false;
                  }
                }

                if (entityPermissionObj.Delete !== null && shouldEntityCheckBoxBeChecked === true) {
                  if (entityPermissionObj.Delete === 0 || entityPermissionObj.Delete === false) {
                    shouldEntityCheckBoxBeChecked = false;
                  }
                }

                if (entityPermissionObj.Reports !== null && shouldEntityCheckBoxBeChecked === true) {
                  if (entityPermissionObj.Reports === 0 || entityPermissionObj.Reports === false) {
                    shouldEntityCheckBoxBeChecked = false;
                  }
                }

                if (entityPermissionObj.Manage !== null && shouldEntityCheckBoxBeChecked === true) {
                  if (entityPermissionObj.Manage === 0 || entityPermissionObj.Manage === false) {
                    shouldEntityCheckBoxBeChecked = false;
                  }
                }
                // if (entityPermissionObj.Limited !== null && shouldEntityCheckBoxBeChecked === true) {
                //   if (entityPermissionObj.Limited === 0 || entityPermissionObj.Limited === false) {
                //     shouldEntityCheckBoxBeChecked = false;
                //   }
                // }
                // if (entityPermissionObj.Advanced !== null && shouldEntityCheckBoxBeChecked === true) {
                //   if (entityPermissionObj.Advanced === 0 || entityPermissionObj.Advanced === false) {
                //     shouldEntityCheckBoxBeChecked = false;
                //   }
                // }


                

                entityPermissionObj.isCheckAllPermissions = shouldEntityCheckBoxBeChecked;
              });
              self.entityPermissionScheme.splice(0, self.entityPermissionScheme.length, ...response.entityPermissionScheme);
            }

            if (response.hasOwnProperty("entityPermissionUseCaseMapping")) {
              self.entityPermissionUseCaseMapping =
                response.entityPermissionUseCaseMapping;
            }
            
            if (response.hasOwnProperty("specialFunctions")) {
              self.specialFunctions =
                response.specialFunctions;
                console.log(" self.specialFunctions==>",self.specialFunctions);
            }
            if (response.hasOwnProperty("HousekeepingIncludede")) {
              self.HousekeepingIncludede =
                response.HousekeepingIncludede;
                console.log(" self.HousekeepingIncludede==>",self.HousekeepingIncludede);
            }
            
          }
        });
      },

      saveRole() {
        let vm = this;
        vm.$validator.validateAll().then(result => {
          // if ((vm.roleDetail.RoleName === "" || vm.roleDetail.RoleName === undefined)) {
          //   console.log("vm.guestInfo.GuestFirstName");
          //   vm.$store.dispatch("toastr", {
          //     type: "warning",
          //     header: "Warning",
          //     message: "RoleName is mandatary"
          //   });
          // }


          // else {

          // vm.roleDetail.StatusId = vm.roleDetail.StatusId;


          let saveRoleObj = {

            roleDetail: vm.roleDetail,
            StatusId: vm.role_Status.StatusId,
            useCaseIds: []

          };


          // else{
          vm.entityPermissionScheme.forEach(schemeObj => {
            if (schemeObj.Add === 1 || schemeObj.Add === true) {
              if (vm.entityPermissionUseCaseMapping.hasOwnProperty(schemeObj.EntityId)
                && vm.entityPermissionUseCaseMapping[schemeObj.EntityId].hasOwnProperty("Add")
                && !isNaN(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Add"])) {
                saveRoleObj.useCaseIds.push(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Add"]);
              }
            }

            if (schemeObj.View === 1 || schemeObj.View === true) {
              if (vm.entityPermissionUseCaseMapping.hasOwnProperty(schemeObj.EntityId)
                && vm.entityPermissionUseCaseMapping[schemeObj.EntityId].hasOwnProperty("View")
                && !isNaN(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["View"])) {
                saveRoleObj.useCaseIds.push(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["View"]);
              }
            }

            if (schemeObj.Update === 1 || schemeObj.Update === true) {
              if (vm.entityPermissionUseCaseMapping.hasOwnProperty(schemeObj.EntityId)
                && vm.entityPermissionUseCaseMapping[schemeObj.EntityId].hasOwnProperty("Update")
                && !isNaN(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Update"])) {
                saveRoleObj.useCaseIds.push(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Update"]);
              }
            }

            if (schemeObj.Delete === 1 || schemeObj.Delete === true) {
              if (vm.entityPermissionUseCaseMapping.hasOwnProperty(schemeObj.EntityId)
                && vm.entityPermissionUseCaseMapping[schemeObj.EntityId].hasOwnProperty("Delete")
                && !isNaN(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Delete"])) {
                saveRoleObj.useCaseIds.push(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Delete"]);
              }
            }

            if (schemeObj.Reports === 1 || schemeObj.Reports === true) {
              if (vm.entityPermissionUseCaseMapping.hasOwnProperty(schemeObj.EntityId)
                && vm.entityPermissionUseCaseMapping[schemeObj.EntityId].hasOwnProperty("Reports")
                && !isNaN(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Reports"])) {
                saveRoleObj.useCaseIds.push(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Reports"]);
              }
            }
            if (schemeObj.Manage === 1 || schemeObj.Manage === true) {
              if (vm.entityPermissionUseCaseMapping.hasOwnProperty(schemeObj.EntityId)
                && vm.entityPermissionUseCaseMapping[schemeObj.EntityId].hasOwnProperty("Manage")
                && !isNaN(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Manage"])) {
                saveRoleObj.useCaseIds.push(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Manage"]);
              }
            }
           
          });
          vm.HousekeepingIncludede.forEach(schemeObj => {
            if (schemeObj.IsIncluded === 1 || schemeObj.IsIncluded === true) {
              // if (vm.entityPermissionUseCaseMapping.hasOwnProperty(schemeObj.EntityId)
              //   && vm.entityPermissionUseCaseMapping[schemeObj.EntityId].hasOwnProperty("Update")
              //   && !isNaN(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Update"])) {
              //   saveRoleObj.useCaseIds.push(vm.entityPermissionUseCaseMapping[schemeObj.EntityId]["Update"]);

              // }
              saveRoleObj.useCaseIds.push(schemeObj.UsecaseId);
              console.log("saveRoleObj.useCaseIds", saveRoleObj.useCaseIds);
            }
          });

          console.log("useCaseIdsAssociated => ", saveRoleObj.useCaseIds);
          console.log("saveRoleObj.useCaseIds", saveRoleObj.useCaseIds);
          if (saveRoleObj.useCaseIds && saveRoleObj.useCaseIds.length === 0) {
            vm.$store.dispatch("toastr", {
              type: "warning",
              header: "Warning",
              message: "entitlements  are required"
            });
          }

          // if (( vm.roleDetail && vm.roleDetail.RoleName === "" || vm.roleDetail.RoleName === undefined || vm.roleDetail.RoleName === " " )) {
          //   console.log("vm.guestInfo.GuestFirstName");
          //   vm.$store.dispatch("toastr", {
          //     type: "warning",
          //     header: "Warning",
          //     message: "RoleName is mandatary"
          //   });
          // }


          else {
            vm.$store.dispatch("dataRequestHandler", {
              key: "SaveRoleDetail",
              params: saveRoleObj,
              //  StatusId : vm.role_Status.StatusId,
              callback: function (err, response) {
                console.log("SaveRoleDetail", response);
                if (err) {
                  vm.$store.dispatch("toastr", {
                    type: "error",
                    header: "roles error!",
                    message: error.sqlMessage ? error.sqlMessage : error
                  });
                  return;
                }
                if (response && response.errorMessage === "" || response.errorMessage === null || response.errorMessage === "null") {
                  console.log("SaveRoleDetail", response);
                  vm.$router.push("/roleDetail/" + response.RoleIdSaved);
                  vm.$store.dispatch("toastr", {
                    type: "success",
                    header: "Success!",
                    message: "roles  successfully saved"
                  });
                  console.log("location reload");
                  location.reload();
                  vm.GetUserEntitlementsAndDefaultProperty();


                }
                else {
                  vm.$store.dispatch("toastr", {
                    type: "error",
                    header: "Error While saving",
                    message: response.errorMessage
                  });

                  vm.GetUserEntitlementsAndDefaultProperty();
                  // location.reload();
                }


              }
            });
          }
        });
      
      },

      GetUserEntitlementsAndDefaultProperty() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetUserEntitlementsAndDefaultProperty",
          params: {
            ModuleAction: "GetUserEntitlementsAndDefaultProperty",
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in GetUserEntitlementsAndDefaultProperty", response);
              // vm.UserProperties = response.properties;
              // vm.DefaultProperty = response.defaultPropertyId;
              vm.userEntitlementList = response.userEntitlementList;
              console.log("vm.userEntitlementList", vm.userEntitlementList)


            }
          }
        })
      },
      fetchData: function () {
        console.log(this.$route.params.roleId);
        this.getRoleDetail();
      }
    },
    computed: {
      selectAllEntity: {
        get: function () {
          let isSelectAllChecked = true;

          this.entityPermissionScheme.forEach(obj => {
            if ((obj.View === 0 || obj.View === false) && isSelectAllChecked) {
              isSelectAllChecked = false;
            }
            if ((obj.Add === 0 || obj.Add === false) && isSelectAllChecked) {
              isSelectAllChecked = false;
            }
            if ((obj.Update === 0 || obj.Update === false) && isSelectAllChecked) {
              isSelectAllChecked = false;
            }
            if ((obj.Delete === 0 || obj.Delete === false) && isSelectAllChecked) {
              isSelectAllChecked = false;
            }
            if ((obj.Reports === 0 || obj.Reports === false) && isSelectAllChecked) {
              isSelectAllChecked = false;
            }
            if ((obj.Manage === 0 || obj.Manage === false) && isSelectAllChecked) {
              isSelectAllChecked = false;
            }

            if ((obj.isCheckAllPermissions === 0 || obj.isCheckAllPermissions === false) && isSelectAllChecked) {
              isSelectAllChecked = false;
            }
          });

          return isSelectAllChecked;
        },
        set: function (value) {
          this.entityPermissionScheme.forEach(obj => {
            if (obj.View !== this.nullObject) {
              obj.View = value === true ? 1 : 0;
            }
            if (obj.Add !== this.nullObject) {
              obj.Add = value === true ? 1 : 0;
            }
            if (obj.Update !== this.nullObject) {
              obj.Update = value === true ? 1 : 0;
            }
            if (obj.Delete !== this.nullObject) {
              obj.Delete = value === true ? 1 : 0;
            }
            if (obj.Reports !== this.nullObject) {
              obj.Reports = value === true ? 1 : 0;
            }
            if (obj.Manage !== this.nullObject) {
              obj.Manage = value === true ? 1 : 0;
            }

            obj.isCheckAllPermissions = value === true ? 1 : 0;
          });
        }
      },
      viewSelectAll: {
        get: function () {
          let isViewSelectAllChecked = true;

          this.entityPermissionScheme.forEach(obj => {
            if ((obj.View === 0 || obj.View === false) && isViewSelectAllChecked) {
              isViewSelectAllChecked = false;
            }
          });

          return isViewSelectAllChecked;
        },
        set: function (value) {
          this.entityPermissionScheme.forEach(obj => {
            if (obj.View !== this.nullObject) {
              obj.View = value === true ? 1 : 0;
            }
          });
        }
      },

      addSelectAll: {
        get: function () {
          let isAddSelectAllChecked = true;

          this.entityPermissionScheme.forEach(obj => {
            if ((obj.Add === 0 || obj.Add === false) && isAddSelectAllChecked) {
              isAddSelectAllChecked = false;
            }
          });

          return isAddSelectAllChecked;
        },
        set: function (value) {
          this.entityPermissionScheme.forEach(obj => {
            if (obj.Add !== this.nullObject) {
              obj.Add = value === true ? 1 : 0;
            }
          });
        }
      },
      updateSelectAll: {
        get: function () {
          let isUpdateSelectAllChecked = true;

          this.entityPermissionScheme.forEach(obj => {
            if ((obj.Update === 0 || obj.Update === false) && isUpdateSelectAllChecked) {
              isUpdateSelectAllChecked = false;
            }
          });

          return isUpdateSelectAllChecked;
        },
        set: function (value) {
          this.entityPermissionScheme.forEach(obj => {
            if (obj.Update !== this.nullObject) {
              obj.Update = value === true ? 1 : 0;
            }
          });
        }
      },
      deleteSelectAll: {
        get: function () {
          let isDeleteSelectAllChecked = true;

          this.entityPermissionScheme.forEach(obj => {
            if ((obj.Delete === 0 || obj.Delete === false) && isDeleteSelectAllChecked) {
              isDeleteSelectAllChecked = false;
            }
          });

          return isDeleteSelectAllChecked;
        },
        set: function (value) {
          this.entityPermissionScheme.forEach(obj => {
            if (obj.Delete !== this.nullObject) {
              obj.Delete = value === true ? 1 : 0;
            }
          });
        }
      },
      reportsSelectAll: {
        get: function () {
          let isReportsSelectAllChecked = true;

          this.entityPermissionScheme.forEach(obj => {
            if ((obj.Reports === 0 || obj.Reports === false) && isReportsSelectAllChecked) {
              isReportsSelectAllChecked = false;
            }
          });

          return isReportsSelectAllChecked;
        },
        set: function (value) {
          this.entityPermissionScheme.forEach(obj => {
            if (obj.Reports !== this.nullObject) {
              obj.Reports = value === true ? 1 : 0;
            }
          });
        }
      },
      manageSelectAll: {
        get: function () {
          let isManageSelectAllChecked = true;

          this.entityPermissionScheme.forEach(obj => {
            if ((obj.Manage === 0 || obj.Manage === false) && isManageSelectAllChecked) {
              isManageSelectAllChecked = false;
            }
          });

          return isManageSelectAllChecked;
        },
        set: function (value) {
          this.entityPermissionScheme.forEach(obj => {
            if (obj.Manage !== this.nullObject) {
              obj.Manage = value === true ? 1 : 0;
            }
          });
        }
      },
      fncIsRoleSave() {
        let vm = this;
        if (vm.$route.params.roleId === "-1") {
          return vm.$store.state.userEntitlementList.hasOwnProperty("fncRoleSave") ? vm.$store.state.userEntitlementList.fncRoleSave : null;
        }
        else if (vm.$route.params.roleId > 0) {
          return vm.$store.state.userEntitlementList.hasOwnProperty("fncRoleUpdate") ? vm.$store.state.userEntitlementList.fncRoleUpdate : null;
        }

      }
    },
    mounted() {
      this.getRoleDetail();
      this.GetUserEntitlementsAndDefaultProperty();

    },
    watch: {
      $route: "fetchData"
    }
  };
</script>