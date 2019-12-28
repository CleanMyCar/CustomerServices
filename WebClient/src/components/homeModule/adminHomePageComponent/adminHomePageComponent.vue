<template src="./adminHomePageComponent.template.html"></template>

<script>
    import moment from "moment-timezone";
    export default {
        name: "adminHomePage",
        props: [],
        data() {
            let detailTabs = [], tobeAssignedTabs = { text: 'To be Assigned Services', id: 1 },
                assignedTab = { text: 'Assigned Services', id: 2 };

            detailTabs.push(tobeAssignedTabs);
            detailTabs.push(assignedTab);
            return {
                detailTabs,
                dashBoardDetails: null,
                services: [],
                serviceType: null,
                assignServiceObj: null,
                searchNameText: null,
                showServicePersonList: false,
                servicePersonList: [],
                selectedTabId: 1
            };
        },

        methods: {
            selectTab(tabId, event) {
                let vm  = this;
                this.selectedTabId = tabId;
                vm.services.splice(0, vm.services.length);
                if(tabId == 1){
                    this.getServices(1);
                }
                else if(tabId == 2){
                    this.getServices(3);
                }
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
                        vm.dashBoardDetails = response;
                    }
                });
            },
            showPendingVehicleServices() {
                this.$router.push("/assignService/1");
            },
            returnDateTime(date) {
                return date ? moment.utc(date).format("Do MMM YYYY") : null
            },
            getServices(serviceStatusId) {
                let vm = this;
                vm.serviceType = vm.$route.params.serviceType

                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAllPendingServicesByType",
                    params: {
                        serviceType: vm.$route.params.serviceType,
                        serviceStatusId: serviceStatusId
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
            assignService() {

            },
            cancel() {
                $("#assignServicePopup").modal("hide");
            },
            selectServicePerson(person) {

            },
            getServicePersonList() {
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
            updateServicePerson(service, servicePersonObj) {
                // service.ServicePersonId = servicePersonObj.UserId;
                this.getServices(1);
                // this.getServices(3);
            },
            getServiceAmount(service){
                let amount = service.VehicleTypeId == 2 ? (service.ServiceType == 2 ? service.FourWheelerOncePrice : service.FourWheelerSubPrice) : (service.ServiceType == 2 ? service.Price : service.SubscriptionPrice )
                return amount * service.Quantity;
            }
        },
        computed: {
            selectedTab() {
                return this.selectedTabId;
            }
        },

        mounted() {
            let vm = this;
            // vm.getAdminDashborad();
            vm.getServices(1);
            $(this.$el).click(function () {
                vm.$store.state.bus.$emit("hideAutoSuggest");
            })
        },
        watch: {
            
            searchNameText(searchText) {
                if (searchText && searchText.trim() && searchText.trim().length > 2) {
                    this.getServicePersonList()
                }
            }
        }

    };
</script>