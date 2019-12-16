<template src="./homePageComponent.template.html"></template>

<script>
    export default {
        name: "homePage",
        props: [],
        data() {
            return {
                entityNamesdata: {},
                servieList: [],
                serviceObj: null,
                SearchText: null
            };
        },

        methods: {
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
                        
                        if (response.userDetails.UserRoleId === 2) {
                            vm.getServices(null, 20);
                        }
                    }
                })
            },
            getServices(searchText, numberOfRecords) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServiceList",
                    params: {
                        SearchText: searchText,
                        NumberOfRecords: numberOfRecords
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.servieList.splice(0, vm.servieList.length, ...response);
                        }
                    }
                });
            },
            getAllServices(){
                this.getServices(null, -1)
            },
            showMoreInfo(serviceObj) {
                this.serviceObj = serviceObj;
                $("#primaryEmailPopup").modal("show");
            },
            chooseOption(serviceObj, optionType) {
                this.$router.push("/purchaseService/" + serviceObj.ServiceId + "/" + optionType);
            },
            getAdminDashborad() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAdminDashboard",
                    params: {
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.servieList.splice(0, vm.servieList.length, ...response);
                        }
                    }
                });
            },
            getServicePersonDashborad() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServicePersonDashborad",
                    params: {
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.servieList.splice(0, vm.servieList.length, ...response);
                        }
                    }
                });
            }
        },
        computed: {
            role() {
                return this.$store.state.loggedInUserDetail ? this.$store.state.loggedInUserDetail.UserRoleId : null
            }
        },

        mounted() {
            let vm = this;
            vm.getUserDetails();
        },
        watch: {
            SearchText(value){
                if(value && value.length > 2){
                    this.getServices(value, -1)
                }
                else if(value.length == 0){
                    this.getServices(null, -1)
                }
            }
        }


    };
</script>