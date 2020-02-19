<template src="./userListVue.template.html"></template>
<script>
    import moment from 'moment'
    export default {
        // options
        name: "userListComponent",
        props: [],
        data() {
            return {
                apiUrl: window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":1339" : ''),
                userList: [],
                headerColumnList: [],
                toggleFilterPanel: false,
                loading: true,
                headerColumnList: {

                    LOGINID: {
                        Label: "FIRST NAME",
                        IsChecked: true,
                        ColumnName: "UserFirstName",
                        isSortLoading: false,
                        isAscOrDesc: null

                    },
                    NAME: {
                        Label: "last NAME",
                        IsChecked: true,
                        ColumnName: "UserLastName",
                        isSortLoading: false,
                        isAscOrDesc: null
                    },

                    EMAIL: { Label: "EMAIL", IsChecked: true, ColumnName: "Email", isSortLoading: false, isAscOrDesc: null },
                    MOBIILENUMBER: { Label: "MOBILE NUMBER", IsChecked: true, ColumnName: "mobileNumber", isSortLoading: false, isAscOrDesc: null },
                    STATUS: { Label: "STATUS", IsChecked: true, ColumnName: "StatusId", isSortLoading: false, isAscOrDesc: null },
                    RoleId: { Label: "Role", IsChecked: true, ColumnName: "RoleName", isSortLoading: false, isAscOrDesc: null },
                    CreatedDate: { Label: "Registered Date", IsChecked: true, ColumnName: "RoleName", isSortLoading: false, isAscOrDesc: null },
                },

                filterObj: {

                    SortBy: null,
                    SortOrder: null,

                },


                listType: 'list'
            };
        },
        methods: {
            imageURLS(imgGuid) {

                let isBase64 = /^data:image\/([a-zA-Z]*);base64,([^\"]*)/.test(imgGuid)
                if (isBase64) {
                    return imgGuid;
                }
                return this.apiUrl + '/downloadImage/' + imgGuid;
            },
            closeFilter() {
                this.toggleFilterPanel = false;
            },

            ascSort(sortBy, sortOrder) {
                let vm = this;
                // for (let index = 0; index < vm.headerColumnList.length; index++) {
                //          console.log("headerColumnList[0]", headerColumnList[index])                       
                //  }


                vm.filterObj.SortBy = sortBy;
                vm.filterObj.SortOrder = sortOrder;
                for (var i in vm.headerColumnList) {
                    if (vm.headerColumnList[i].ColumnName !== "LOGO") {
                        var obj = vm.headerColumnList[i];
                        console.log("obj", obj);
                        // for (var j in obj.sortLabels) {
                        if (sortBy.toString() === obj.ColumnName) {
                            console.log("obj.ColumnName", obj.ColumnName);
                            vm.headerColumnList[i].isSortLoading = true;
                            vm.headerColumnList[i].isAscOrDesc = sortOrder.toString();
                            //   }
                            // }
                        }
                    }
                }

                vm.getData();


                //vm.getReservationsList(vm.propertyId, vm.UnitTypeId, vm.ViewListId, SortBy, SortOrder, vm.sourceID);
            },
            editUser: function () {
                this.editMode = !this.editMode;
            },
            createNewInstance: function () {
                let uiPageName = this.$store.state.uiPageName;
                this.$router.push("/userDetail/-1");
            },
            getData: function () {
                //call action to get data
                let self = this;
                this.$store.dispatch("dataRequestHandler", {
                    key: "GetUserList",
                    params:
                        {
                            ModuleAction: "GetUserList",
                            filterObj: self.filterObj
                        },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        else {
                            console.log("response in GetUserList", response);
                            self.userList = response.recordsets[0];                            
                            self.loading = false;
                            // for (var i in self.headerColumnList) {

                            //     if (self.headerColumnList[i].ColumnName !== "LOGO") {
                            //         var obj = self.headerColumnList[i];
                            //         console.log("obj", obj)

                            //         if (self.filterObj.SortBy === obj.ColumnName.toString()) {
                            //             console.log("obj.ColumnName", obj.ColumnName);
                            //             self.headerColumnList[i].isSortLoading = false;
                            //             // vm.headerColumnList[i].isAscOrDesc = sortOrder.toString();
                            //         }

                            //     }
                            // }

                        }

                    }
                })
            },
            editParentInstance: function () {
                window.location.href = this.$store.state.uiPageName + "#client/" + this.clientId + "/entity/" + this.entityId + "/edit";
            },
            renderUserDetail: function (userObj) {
                //console.log(userObj);
                this.$router.push("/userDetail/" + userObj.UserId);
            },
            switchView() {
                if (this.listType == 'list')
                    this.listType = 'card';
                else
                    this.listType = 'list';
            },
            getFormattedDate(date){
                return moment(date).format("Do MMM, YYYY")
            }
        },
        computed: {
            // fncIsUserNew(){
            //     let vm =this;
            //     return vm.$store.state.userEntitlementList.hasOwnProperty("fncUserNew")
            // },
            // fncIsUserList(){
            //     let vm =this;
            //     return vm.$store.state.userEntitlementList.hasOwnProperty("fncUserList")
            // },
            // fncIsUserSelect(){
            //     let vm =this;
            //     return vm.$store.state.userEntitlementList.hasOwnProperty("fncUserSelect")
            // },
            fncIsUserSelect() {
                let vm = this;
                if (vm.$store.state.userEntitlementList.hasOwnProperty("fncUserSelect")) {
                    console.log("fncUserSelect =>", vm.$store.state.userEntitlementList);
                    let fncUserSelect = vm.$store.state.userEntitlementList.fncUserSelect
                    console.log("fncUserSelect", fncUserSelect)
                    return fncUserSelect;
                }

                return null;
            },
            fncIsClientDelete() {
                let vm = this;
                if (vm.$store.state.userEntitlementList.hasOwnProperty("fncClientDelete")) {
                    console.log("fncClientDelete =>", vm.$store.state.userEntitlementList);
                    let fncClientDelete = vm.$store.state.userEntitlementList.fncClientDelete
                    console.log("fncClientDelete", fncClientDelete)
                    return fncClientDelete;
                }

                return null;
            },
            fncIsUserList() {
                let vm = this;
                if (vm.$store.state.userEntitlementList.hasOwnProperty("fncUserList")) {
                    console.log("fncUserList =>", vm.$store.state.userEntitlementList);
                    let fncUserList = vm.$store.state.userEntitlementList.fncUserList
                    console.log("fncUserList", fncUserList)
                    return fncUserList;
                }

                return null;
            },
            fncIsUserNew() {
                let vm = this;
                if (vm.$store.state.userEntitlementList.hasOwnProperty("fncUserNew")) {
                    console.log("fncUserNew =>", vm.$store.state.userEntitlementList);
                    let fncUserNew = vm.$store.state.userEntitlementList.fncUserNew
                    console.log("fncIsUserNew", fncUserNew)
                    return fncUserNew;
                }

                return null;
            }
        },
        watch: {
            // parentId: function (value) {
            //     this.getData();
            // }
        },
        mounted() {
            this.getData();
            // $(this.$el).find("ul.dropdown-menu").click(function (e) {
            //     e.stopPropagation();
            // });
        }
    }

</script>