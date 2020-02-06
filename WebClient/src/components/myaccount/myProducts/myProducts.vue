<template src="./myProducts.template.html"></template>

<script>
    export default {
        name: "myProducts",
        props: [],
        data() {
            return {
                myVehicles: [],
                openedVehicleAddPopup: false,
                selectedVehicle: null,
                defaultCarImage: "../../../src/content/images/car.png",
                defaultBikeImage: "../../../src/content/images/bike.png",
                openHistoryPopup: false,
                nonPersonalVehicles: []
            };
        },

        methods: {
            getMyProducts() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetMyProducts",
                    params: {
                        IsPersonal: 1
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.myVehicles.splice(0, vm.myVehicles.length, ...response.vehicles);
                    }
                });
            },
            getNonPersonalProducts() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetMyProducts",
                    params: {
                        IsPersonal: 0
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.nonPersonalVehicles.splice(0, vm.nonPersonalVehicles.length, ...response.vehicles);
                    }
                });
            },
            pauseSubscription(serviceObj) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "PauseSubscriptionItem",
                    params: vm.serviceObj,
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        $("#deleteConfimationPopup").modal("hide");
                        vm.serviceObj = null
                        vm.getMySubscriptions();
                        //vm.serviceDeleteReasons.splice(0, vm.serviceDeleteReasons.length, ...response);
                    }
                });
            },
            deleteCustomerService() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "DeleteSubscription",
                    params: vm.serviceObj,
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        $("#deleteConfimationPopup").modal("hide");
                        vm.serviceObj = null
                        vm.getMySubscriptions();
                        //vm.serviceDeleteReasons.splice(0, vm.serviceDeleteReasons.length, ...response);
                    }
                });
            },
            openVehicleAddPopup(){
                this.selectedVehicle = null;
                this.openedVehicleAddPopup = !this.openedVehicleAddPopup;
            },
            closeVehicleAddPopup(){
                this.openedVehicleAddPopup = !this.openedVehicleAddPopup;
            },
            deleteVehicle(){
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "DeleteVehicle",
                    params: vm.selectedVehicle,
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.selectedVehicle = null;
                        vm.closeValidationPopup();
                        vm.getMyProducts();   
                    }
                });
            },
            openConfirmationPopup(vehicle){
                let vm = this;
                vm.selectedVehicle = vehicle;
                $("#deleteVehiclePopup").modal("show");
            },
            closeValidationPopup(){
                $("#deleteVehiclePopup").modal("hide");
            },
            editProduct(product){
                this.selectedVehicle = product;
                this.openedVehicleAddPopup = !this.openedVehicleAddPopup;
            },
            navigateToProductHistory(product){                
                this.openHistoryPopup = true;
                this.selectedVehicle = product
            },
            changeNotificationFlg(product, flag){
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "UpdateVehicleNotificationFlag",
                    params: {
                        VehicleId: product.VehicleId,
                        Flag: flag
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }                        
                        vm.getMyProducts();
                    }
                });
            },
            callbackFromHistoryPopup(){
                this.openHistoryPopup = false;
            }

        },

        computed: {
        },

        mounted() {
            let vm = this;
            vm.getMyProducts();
            vm.getNonPersonalProducts();
        }
    };
</script>