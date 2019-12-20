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
                    TimeSlot: "1",
                    AddressId: null
                },
                newVehicleDetails: null,
                fourWheelerTypes: [],
                vehicleTypes: [],
                newVehicleImage: null,
                subscriptionTypes: [],
                vehicleAddress: null,
                searchAddressText: null,
                defaultCarImage: "../../../src/content/images/car.png",
                defaultBikeImage: "../../../src/content/images/bike.png",
                addressList: [],
                showAddressList: false,
                selectedVehicle: null,
                openedVehicleAddPopup: false
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
                //this.newVehicleDetails = {
                //    AddressId: null,
                //    VehicleNumber: null,
                //    VehicleMake: null,
                //    VehicleModel: null,
                //    ParkingLot: null,
                //    VehicleTypeId: "1",
                //    FourWheelerTypeId: null
                //}
                //$("#newVehicleDetailsPopup").modal("show");
                this.openedVehicleAddPopup = true;
                this.vehicleAddress = {
                    VehicleId: -1
                }
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
                if ((event && event.currentTarget.checked) || product.VehicleId) {
                    vm.vehicleInfo.VehicleId = product.VehicleId;
                    vm.selectedVehicle = product;
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
                    vm.vehicleAddress = null,
                    vm.selectedVehicle = null
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
                        Promocode: vm.vehicleInfo.Promocode,
                        ServiceDate: vm.vehicleInfo.ServiceDate,
                        TimeSlot: vm.vehicleInfo.TimeSlot,
                        WeeklyDay: vm.vehicleInfo.WeeklyDay
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (vm.serviceType == 2) {
                            vm.$router.push("/myOrders");
                        }
                        if (vm.serviceType == 1) {
                            vm.$router.push("/mysubscriptions");
                        }
                    }
                });
            },
            navigateToBack() {
                this.$router.push("/");
            },
            updateServiceDate(key, dateObj, objectPassedToParent) {
                this.vehicleInfo.ServiceDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
            },
            getAddressBySearchText(text) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAddressBySearch",
                    params: {
                        searchText: text
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.addressList.splice(0, vm.addressList.length, ...response);
                        vm.showAddressList = true;
                    }
                });
            },
            selectAddress(addressObj) {
                this.newVehicleDetails.AddressId = addressObj.AddressId;
                this.searchAddressText = addressObj.AddressLine1 + " " + addressObj.AddressLine2 + ", " + addressObj.Landmark + " " + addressObj.CityName + ", " + addressObj.StateName
                this.showAddressList = false;
            },
            filesChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                let vm = this;
                let reader = new FileReader();
                reader.onload = e => {
                    vm.newVehicleDetails.VehicleImage = e.target.result;
                }
                reader.readAsDataURL(files[0]);
            },
            editVehicleAddress(){
                this.openedVehicleAddPopup = true;
            },
            closeVehicleAddPopup(){
                this.openedVehicleAddPopup = false;
            },
            updateVehicleAddress(selectedVehicle){
                this.chooseVehicle(selectedVehicle)
                this.openedVehicleAddPopup = false;
                this.getMyProducts();
            }
            
        },

        computed: {
            servicePrice() {
                let vm = this;
                if (this.selectedVehicle) {
                    if (vm.selectedVehicle.FourWheelerTypeId) {
                        let vehiclePriceInfo = this.fourWheelerTypes.filter((vehicle) => {
                            return vehicle.Id == vm.selectedVehicle.FourWheelerTypeId;
                        })
                        if (vehiclePriceInfo && vehiclePriceInfo.length > 0) {
                            return vm.serviceType == 2 ? vehiclePriceInfo[0].Price : vehiclePriceInfo[0].SubscriptionPrice;
                        }
                    }
                    else {
                        return vm.serviceType == 2 ? vm.serviceDetail.Price : vm.serviceDetail.SubscriptionPrice;
                    }
                }
                return 0;
            }
        },

        mounted() {
            let vm = this;
            console.log("mounted")
            vm.fetchData();
        },
        watch: {
            $route: "fetchData",
            searchAddressText(value) {
                if (value && value.trim().length > 2 && value.trim().length < 10) {
                    this.getAddressBySearchText(value);
                }
                else {
                    this.addressList.splice(0, this.addressList.length)
                }
            }
        }
    };
</script>
<style>
    .vechiles {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* IMAGE STYLES */
    .vechiles+img {
        cursor: pointer;
    }

    /* CHECKED STYLES */
    .vechiles:checked+img {
        outline: 2px solid blue;
    }
</style>