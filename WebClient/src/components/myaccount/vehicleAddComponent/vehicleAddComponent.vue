<template src="./vehicleAddComponent.template.html"></template>

<script>
    import Vue from "vue";
    import VeeValidate from "vee-validate";
    Vue.use(VeeValidate);

    export default {
        name: "vehicleAddComponent",
        props: ["updateParent", "closeVehicleAddPopup", "vehicleId", "serviceDetail", "isPersonal"],
        data() {
            return {
                myServiceProducts: [],
                serviceType: null,
                vehicleInfo: {
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
                searchAddressText: null,
                addressList: [],
                showAddressList: false,
                validations:{}
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
                    VehicleTypeId: this.serviceDetail ? this.serviceDetail.VehicleCategoryType : "2",
                    FourWheelerTypeId: this.serviceDetail && this.serviceDetail.VehicleCategoryType == "2" ? "2" : null
                }
                $("#newVehicleDetailsPopup").modal("show");
            },
            changeVehicleType(vehicleType, event) {

            },
            addNewVehicle() {
                let vm = this;
                 vm.$validator.validateAll().then(result => {
                    if (result) {                
                        vm.$store.dispatch("dataRequestHandler", {
                            key: "SaveVehicleDetails",
                            params: Object.assign(vm.newVehicleDetails, { IsPersonal: vm.isPersonal }),
                            callback: function (err, response) {
                                if (err) {
                                    return;
                                }
                                // vm.getMyProducts();
                                $("#newVehicleDetailsPopup").modal("hide");
                                if(vm.updateParent){
                                    vm.updateParent(vm.newVehicleDetails);
                                }
                            }
                        });

                }   
                });
               
            },
            cancel() {
                $("#newVehicleDetailsPopup").modal("hide");
                this.closeVehicleAddPopup();
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
                this.searchAddressText = addressObj.AddressLine1 + " " + addressObj.AddressLine2 + ", " + addressObj.Landmark + ", " + addressObj.CityName + ", " + addressObj.StateName
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
            closeValidationPopup(){
                $("#vehicleValidationPopup").modal("hide")
            },
            getVehicleTypes(){
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetVehicleTypes",
                    params: {
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.vehicleTypes = response[0];
                        vm.fourWheelerTypes = response[1];
                    }
                });
            },
            getVehicleDetails(){
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetVehicleDetail",
                    params: {
                        VehicleId: vm.vehicleId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.newVehicleDetails = response;
                        vm.selectAddress(response);
                        $("#newVehicleDetailsPopup").modal("show");
                    }
                });
            }
        },

        computed: {

        },

        mounted() {
            let vm = this;
            vm.addNewVehicleInfo();
            vm.getVehicleTypes();
            if(vm.vehicleId && vm.vehicleId > 0){
                vm.getVehicleDetails();
            }
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
            },
            vehicleId(value){
                if(value && value > 0){
                    this.getVehicleDetails();
                }
            }
        }
    };
</script>