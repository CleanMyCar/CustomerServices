<template src="./vehicleAddComponent.template.html"></template>

<script>
    export default {
        name: "vehicleAddComponent",
        props: ["updateParent"],
        data() {
            return {
                serviceDetail: null,
                myServiceProducts: [],
                serviceType: null,
                vehicleInfo: {
                    isPersonal: true,
                    VehicleId: null,
                    Frequency: null,
                    TimeSlot: "1"
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
                        // vm.getMyProducts();
                        $("#newVehicleDetailsPopup").modal("hide");
                        if(vm.updateParent){
                            vm.updateParent();
                        }
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
            navigateToBack() {
                this.$router.push("/");
            },
            updateServiceDate(key, dateObj, objectPassedToParent) {
                this.vehicleInfo.ServiceDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
            }
        },

        computed: {

        },

        mounted() {
            let vm = this;
            vm.addNewVehicleInfo();
        },
        watch: {
            $route: "fetchData"
        }
    };
</script>