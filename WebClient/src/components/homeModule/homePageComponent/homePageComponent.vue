<template src="./homePageComponent.template.html"></template>

<script>
    export default {
        name: "homePage",
        props: [],
        data() {
            return {
                frequentServices: [],
                servicesList: null,
                serviceObj: null,
                SearchText: null,
                defaultCarImage: "../../../src/content/images/car.png",
                defaultBikeImage: "../../../src/content/images/bike.png",
                bannerImages: []
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
                            vm.servicesList = response;;
                        }
                    }
                });
            },
            getFrequentServices(searchText, numberOfRecords) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetFrequentServices",
                    params: {
                        SearchText: searchText,
                        NumberOfRecords: numberOfRecords
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.frequentServices.splice(0, vm.frequentServices.length, ...response);
                        }
                    }
                });
            },
            getAllServices() {
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
            },
            getBannerImages(){
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetBannerImages",
                    params: {
                        IsLogin: 0,
                        Source: 'Web'
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.bannerImages.splice(0, vm.bannerImages.length, ...response);
                            setTimeout(function(){
                                showSlides(1)
                            }, 5); 
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
            vm.getFrequentServices();
            vm.getBannerImages();
        },
        watch: {
            SearchText(value) {
                if (value && value.length > 2) {
                    this.getServices(value, -1)
                }
                else if (value.length == 0) {
                    this.getServices(null, -1)
                }
            }
        }


    };
</script>

<style>
    .searchTextInput {
        padding: 10px;
        font-size: 17px;
        border: 1px solid grey;
        float: left;
        width: 80%;
        background: #f1f1f1;
    }

    .button-holder {
        float: left;
        width: 15%;
        padding: 5px;
        /* background: #2196F3; */
        color: white;
        font-size: 17px;
        border: 1px solid grey;
        border-left: none;
        /* Prevent double borders */
        cursor: pointer;
    }
</style>