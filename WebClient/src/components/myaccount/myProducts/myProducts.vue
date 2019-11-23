<template src="./myProducts.template.html"></template>

<script>
    export default {
        name: "myProducts",
        props: [],
        data() {
            return {
                myVehicles: [],
                openedVehicleAddPopup: false
            };
        },

        methods: {
            getMyProducts() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetMyProducts",
                    params: {
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.myVehicles.splice(0, vm.myVehicles.length, ...response.vehicles);
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
                this.openedVehicleAddPopup = !this.openedVehicleAddPopup
            }
        },

        computed: {

        },

        mounted() {
            let vm = this;
            vm.getMyProducts();
        }
    };
</script>