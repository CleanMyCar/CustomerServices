<template src="./adminHomePageComponent.template.html"></template>

<script>
    import moment from "moment-timezone";
    export default {
        name: "adminHomePage",
        props: [],
        data() {
            return {
                dashBoardDetails: null,
                services: [],
                serviceType: null,
                assignServiceObj: null,
                searchNameText: null,
                showServicePersonList: false,
                servicePersonList: []
            };
        },

        methods: {
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
                        vm.dashBoardDetails = response;
                    }
                });
            },
            showPendingVehicleServices() {
                this.$router.push("/assignService/1");
            },
            returnDateTime(date) {
                return date ? moment(date).format("Do MMM YYYY") : null
            },
            getServices() {
                let vm = this;
                vm.serviceType = vm.$route.params.serviceType

                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAllPendingServicesByType",
                    params: {
                        serviceType: vm.$route.params.serviceType
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.services.splice(0, vm.services.length, ...response);
                    }
                });
            },
            openAssignPopup(serviceObj) {
                this.assignServiceObj = serviceObj;
                $("#assignServicePopup").modal("show");
            },
            assignService(){

            },
            cancel(){
                $("#assignServicePopup").modal("hide");
            },
            selectServicePerson(person){

            },
            getServicePersonList(){
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServicePersonList",
                    params: {
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.servicePersonList.splice(0, vm.servicePersonList.length, ...response);
                        vm.showServicePersonList = true;
                    }
                });
            },
            updateServicePerson(service, servicePersonObj){
                service.ServicePersonId = servicePersonObj.UserId;
            }
        },
        computed: {
        },

        mounted() {
            let vm = this;
            // vm.getAdminDashborad();
            vm.getServices();
        },
        watch: {
            $route: "getServices",
            searchNameText(searchText){
                if(searchText && searchText.trim() && searchText.trim().length > 2){
                    this.getServicePersonList()
                }
            }
        }

    };
</script>