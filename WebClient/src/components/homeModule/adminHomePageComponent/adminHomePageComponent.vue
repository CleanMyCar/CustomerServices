<template src="./adminHomePageComponent.template.html"></template>

<script>
    import moment from "moment-timezone";
    export default {
        name: "adminHomePage",
        props: [],
        data() {
            let detailTabs = [],
                tobeAssignedTabs = { text: 'To be Assigned Services', id: 1 },
                assignedTab = { text: 'Assigned Services', id: 4 },
                compltedTab = { text: 'Completed Services', id: 5 },
                notcompletedTab = { text: 'Not Completed Services', id: 6 };

            detailTabs.push(tobeAssignedTabs);
            detailTabs.push(assignedTab);
            detailTabs.push(compltedTab);
            detailTabs.push(notcompletedTab);

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
                    ServiceId: null,
                    AddressId: null,
                    PersonId: null
                },
                adminServiceList: [],
                buildingList: [],
                servicePerons: []
            };
        },

        methods: {
            selectTab(tabId, event) {
                let vm = this;
                this.selectedTabId = tabId;
                vm.services.splice(0, vm.services.length);
                vm.pendingServiceFilter.PersonId = null;
                vm.getRequestedServices();
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
            returnServiceDateTime(serviceObj) {
                if (serviceObj && this.selectedTabId == 1 && serviceObj.ChildServiceDate && serviceObj.ChildParentId) {
                    return moment.utc(serviceObj.ChildServiceDate).format("Do MMM YYYY")
                }
                if (serviceObj && serviceObj.ServiceDate) {
                    return moment.utc(serviceObj.ServiceDate).format("Do MMM YYYY")
                }
                return null;

            },
            returnDateTime(date) {
                return date ? moment.utc(date).format("Do MMM YYYY") : null
            },
            getRequestedServices(serviceStatusId) {
                let vm = this;
                vm.serviceType = vm.$route.params.serviceType

                let filterItems = {
                    serviceType: vm.$route.params.serviceType,
                    serviceStatusId: vm.selectedTab,
                    ServiceDate: vm.pendingServiceFilter.ActualServiceDate,
                    ServiceId: vm.pendingServiceFilter.ServiceId,
                    AddressId: vm.pendingServiceFilter.AddressId,
                    PersonId: vm.pendingServiceFilter.PersonId
                }

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
            getServiceAmount(service) {
                let amount = service.VehicleTypeId == 2 ? (service.ServiceType == 2 ? service.FourWheelerOncePrice : service.FourWheelerSubPrice) : (service.ServiceType == 2 ? service.Price : service.SubscriptionPrice)
                return amount * service.Quantity;
            },
            updateServiceDate(key, dateObj, objectPassedToParent) {
                this.pendingServiceFilter.ServiceDate = dateObj ? dateObj.format("Do MMM YYYY") : null;
                this.pendingServiceFilter.ActualServiceDate = dateObj ? dateObj.format("YYYY-MM-DD") : null;
            },
            getAdminServices() {
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
            },
            getBuildingsAndServicePersons() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetBuildingsAndServicePersons",
                    params: {
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.buildingList.splice(0, vm.buildingList.length, ...response.buildings);
                            vm.servicePerons.splice(0, vm.servicePerons.length, ...response.servicePerons);
                        }
                    }
                });
            },
        },
        computed: {
            selectedTab() {
                return this.selectedTabId;
            },
            timeslots() {
                return this.$store.state.timeslots;
            }
        },

        mounted() {
            let vm = this;
            vm.getAdminServices();
            vm.getBuildingsAndServicePersons();
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