<template src="./servicePersonHomePageComponent.template.html"></template>

<script>
    export default {
        name: "servicePersonHomePage",
        props: [],
        data() {
            return {
                entityNamesdata: {},
                servieList: [],
                serviceObj: null
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
                        vm.$store.state.loggedInUserDetail = response;
                        if (vm.$store.state.loggedInUserDetail.UserRoleId === 1) {
                            vm.getServices();
                        }
                        else if (vm.$store.state.loggedInUserDetail.UserRoleId === 2) {
                            vm.getAdminDashborad();
                        }
                        else if (vm.$store.state.loggedInUserDetail.UserRoleId === 3) {
                            vm.getServicePersonDashborad();
                        }
                    }
                })
            },
            getServices() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServiceList",
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
            showMoreInfo(serviceObj) {
                this.serviceObj = serviceObj;
                $("#primaryEmailPopup").modal("show");
            },
            chooseOption(serviceObj, optionType) {
                this.$router.push("/purchaseService/" + serviceObj.ServiceId + "/" + optionType);
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
        },

        mounted() {
            let vm = this;
            vm.getUserDetails();
        },


    };
</script>