<template src="./roleList.template.html"></template>
<script>
  export default {
    name: "RoleList",
    props: [""],
    data() {
      return {
        roleList: [],
        headerColumnList: [],
        toggleFilterPanel:false,
        isGreyOut: false,
        headerColumnList: {

          NAME: {
            Label: "NAME",
            IsChecked: true,
            ColumnName: "RoleName", isSortLoading: false, isAscOrDesc: null
          },
          DESCRIPTION: { Label: "DESCRIPTION", IsChecked: true, ColumnName: "RoleDescription", isSortLoading: false, isAscOrDesc: null },
          STATUS: { Label: "STATUS", IsChecked: true, ColumnName: "StatusId", isSortLoading: false, isAscOrDesc: null },
        },
        viewSaveObject: {
          sortColumn: null,
          sortOrder: null,
        },
        filterObj: {

          SortBy: null,
          SortOrder: null,

        },
        filterColumnList: {
          UnitCount: { Label: "Unit Count", ColumnName: "UnitCount" },
          Published: { Label: "Published", ColumnName: "Published" },
          
        },

      };
    },
    methods: {

      ascSort(sortBy, sortOrder) {
        let vm = this;


        vm.filterObj.SortBy = sortBy;
        vm.filterObj.SortOrder = sortOrder;

        vm.getRoleList();
        for (var i in vm.headerColumnList) {

          var obj = vm.headerColumnList[i];
          console.log("obj", obj)
          if (sortBy.toString() === obj.ColumnName) {
            console.log("obj.ColumnName", obj.ColumnName);
            vm.headerColumnList[i].isSortLoading = true;
            vm.headerColumnList[i].isAscOrDesc = sortOrder.toString();
          }
        }

        //vm.getReservationsList(vm.propertyId, vm.UnitTypeId, vm.ViewListId, SortBy, SortOrder, vm.sourceID);
      },
      createNewInstance: function () {
        this.$router.push("/roleDetail/-1");
      },
      deleteRole: function () { },
      renderRoleDetail: function (roleObj) {
        this.$router.push("/roleDetail/" + roleObj.RoleId);
      },
      getRoleList: function () {
        let self = this;

        self.$store.dispatch("dataRequestHandler", {
          key: "GetRoleList",
          params: { filterObj: self.filterObj },
          callback: function (err, response) {
            //console.log(response);
            if (err) {
              return;
            }
            if (response.recordsets[1]) {
              self.roleList = response.recordsets[1];
              // if (self.roleList.length > 0) {
              //   self.$store.dispatch("toastr", {
              //     type: "success",
              //     header: "Success!",
              //     message: "roleList List Rendered"
              //   });
              // }
            }
            self.loading = false;
              for (var i in self.headerColumnList) {

                if (self.headerColumnList[i].ColumnName !== "LOGO") {
                  var obj = self.headerColumnList[i];
                  console.log("obj", obj)

                  if (self.filterObj.SortBy === obj.ColumnName.toString()) {
                    console.log("obj.ColumnName", obj.ColumnName);
                    self.headerColumnList[i].isSortLoading = false;
                    self.isGreyOut = false;
                    if (self.isGreyOut === false && self.headerColumnList[i].isSortLoading === false) {
                      $('ul.dropdown-menu').removeClass('show').addClass('hide');
                    }

                    // vm.headerColumnList[i].isAscOrDesc = sortOrder.toString();
                  }

                }
              }
          }
        });
      },
      fetchData: function () {
        console.log(this.$route.params.userId);
        this.getRoleList();
      }
    },
    computed: {
      fncIsRoleList() {
        let vm = this;
        return vm.$store.state.userEntitlementList.hasOwnProperty("fncRoleList")
      },
      // fncIsRoleSelect(){
      //   let vm =this;
      //    return vm.$store.state.userEntitlementList.hasOwnProperty("fncRoleSelect")
      // },
      fncIsRoleNew() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncRoleNew")) {
          console.log("fncRoleNew =>", vm.$store.state.userEntitlementList);
          let fncRoleNew = vm.$store.state.userEntitlementList.fncRoleNew
          console.log("fncRoleNew", fncRoleNew)
          return fncRoleNew;
        }
        return null;
      },
      fncIsRoleList() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncRoleList")) {
          console.log("fncRoleList =>", vm.$store.state.userEntitlementList);
          let fncRoleList = vm.$store.state.userEntitlementList.fncRoleList
          console.log("fncRoleList", fncRoleList)
          return fncRoleList;
        }
        return null;
      },
      fncIsRoleSelect() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncRoleSelect")) {
          console.log("fncRoleSelect =>", vm.$store.state.userEntitlementList);
          let fncRoleSelect = vm.$store.state.userEntitlementList.fncRoleSelect
          console.log("fncRoleSelect", fncRoleSelect)
          return fncRoleSelect;
        }
        return null;
      }
    },
    mounted() {
      this.getRoleList();
      // $(this.$el).find("ul.dropdown-menu").click(function (e) {
      //   e.stopPropagation();
      // });
    },
    watch: {
      $route: "fetchData"
    }
  };
</script>