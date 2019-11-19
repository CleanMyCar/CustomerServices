<template src="./purchaseService.template.html"></template>

<script>
    export default {
        name: "purchaseService",
        props: [],
        data() {
            return {
                serviceDetail: null,
                myServiceProducts: [],
                serviceType: null,
                vehicleInfo: {
                    isPersonal: true,
                    VehicleId: null,
                    Frequency: null,
                    TimeSlot: "10:00"
                },
                newVehicleDetails: null,
                fourWheelerTypes: [],
                vehicleTypes: [],
                newVehicleImage: null,
                subscriptionTypes: [],
                vehicleAddress: null,
                searchAddressText: null
            };
        },

        methods: {
            getMyProducts() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetMyServiceProducts",
                    params: {
                        serviceId: vm.$route.params.serviceId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.myServiceProducts.splice(0, vm.myServiceProducts.length, ...response);
                    }
                });
            },
            fetchData: function () {
                // console.log(this.$route.params.serviceId);
                // console.log(this.$route.params.serviceType);
                let vm = this;
                vm.serviceType = vm.$route.params.serviceType; //1 - subscribe, 2 - Purchase Once                
                vm.getMyProducts();
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServiceDetail",
                    params: {
                        serviceId: vm.$route.params.serviceId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.serviceDetail = response.serviceDetail;
                        vm.vehicleTypes = response.vehicleTypes;
                        vm.fourWheelerTypes = response.fourWheelerTypes;
                        vm.subscriptionTypes = response.subscribeTypes
                    }
                });

            },
            changeSelection(event) {
                this.vehicleInfo.isPersonal = !this.vehicleInfo.isPersonal;
                // $(".personalVehicle").not(event.currentTarget).prop('checked', false);
            },
            addNewVehicleInfo() {
                this.newVehicleDetails = {
                    AddressId: null,
                    VehicleNumber: null,
                    VehicleMake: null,
                    VehicleModel: null,
                    ParkingLot: null,
                    VehicleTypeId: "1",
                    FourWheelerTypeId: null
                }
                $("#newVehicleDetailsPopup").modal("show");
            },
            changeVehicleType(vehicleType, event) {

            },
            addNewVehicle() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "SaveVehicleDetails",
                    params: Object.assign(vm.newVehicleDetails, { IsPersonal: vm.vehicleInfo.isPersonal }),
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.getMyProducts();
                        $("#newVehicleDetailsPopup").modal("hide");
                    }
                });

            },
            cancel() {
                $("#newVehicleDetailsPopup").modal("hide");
            },
            chooseVehicle(product, event) {
                let vm = this;
                if (event.currentTarget.checked) {
                    this.vehicleInfo.VehicleId = product.VehicleId;
                    vm.$store.dispatch("dataRequestHandler", {
                        key: "GetVechicleAddress",
                        params: { VehicleId: product.VehicleId },
                        callback: function (err, response) {
                            if (err) {
                                return;
                            }
                            vm.vehicleAddress = response;
                        }
                    });
                }
                else {
                    this.vehicleInfo.VehicleId = null;
                    vm.vehicleAddress = null
                }
            },
            confirmServiceOrder() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "RequestVehicleService",
                    params: {
                        VehicleId: vm.vehicleInfo.VehicleId,
                        ServiceType: vm.serviceType,
                        ServiceId: vm.$route.params.serviceId,
                        Frequency: vm.vehicleInfo.Frequency,
                        Promocode: vm.vehicleInfo.Promocode

                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        // vm.vehicleAddress = response;
                        this.$router.push("/mysubscriptions");

                    }
                });
            },
            navigateToBack() {
                this.$router.push("/");
            }
        },

        computed: {

        },

        mounted() {
            let vm = this;
            console.log("mounted")
            vm.fetchData();
        },
        watch: {
            $route: "fetchData"
        }
    };
</script>