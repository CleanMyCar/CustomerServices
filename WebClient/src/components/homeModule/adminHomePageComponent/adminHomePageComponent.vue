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
                selectedTabId: 1,
                pendingServiceFilter: {
                    ServiceDate: moment.utc(),
                    ActualServiceDate: moment.utc().format("YYYY-MM-DD"),
                    ServiceId: null
                },
                adminServiceList: []
            };
        },

        methods: {
            selectTab(tabId, event) {
                let vm  = this;
                this.selectedTabId = tabId;
                vm.services.splice(0, vm.services.length);
                if(tabId == 1){
                    this.getRequestedServices(1);
                }
                else if(tabId == 2){
                    this.getRequestedServices(3);
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
                return date ? moment(date).format("Do MMM YYYY") : null
            },
            getRequestedServices(serviceStatusId) {
                let vm = this;
                vm.serviceType = vm.$route.params.serviceType

                let filterItems = {
                    serviceType: vm.$route.params.serviceType,
                    serviceStatusId: serviceStatusId
                }
                
                filterItems.ServiceDate = vm.pendingServiceFilter.ActualServiceDate                
                filterItems.ServiceId = vm.pendingServiceFilter.ServiceId

                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAllPendingServicesByType",
                    params: filterItems,
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
                this.getRequestedServices(1);
                // this.getRequestedServices(3);
            },
            getServiceAmount(service){
                let amount = service.VehicleTypeId == 2 ? (service.ServiceType == 2 ? service.FourWheelerOncePrice : service.FourWheelerSubPrice) : (service.ServiceType == 2 ? service.Price : service.SubscriptionPrice )
                return amount * service.Quantity;
            },
            updateServiceDate(key, dateObj, objectPassedToParent) {
                this.pendingServiceFilter.ServiceDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
                this.pendingServiceFilter.ActualServiceDate = dateObj ? dateObj.format("YYYY-MM-DD") : null;
            },
            getAdminServices(){                
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAllServices",
                    params: {
                        SelectedStatus: 1
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.adminServiceList.splice(0, vm.adminServiceList.length, ...response);
                            vm.pendingServiceFilter.ServiceId = vm.adminServiceList[0]["ServiceId"];
                            vm.getRequestedServices(1);
                        }
                    }
                });            
            }
        },
        computed: {
            selectedTab() {
                return this.selectedTabId;
            },
            timeslots(){
                return this.$store.state.timeslots;
            }
        },

        mounted() {
            let vm = this;
            vm.getAdminServices();            
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