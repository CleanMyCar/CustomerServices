<template src="./myOrders.template.html"></template>

<script>
    export default {
        name: "myOrders",
        props: [],
        data() {
            return {
                subscriptions: [],
                serviceObj: null,
                serviceDeleteReasons: [],
                selectedReasons: [],
                selectedServiceItem: null,
                inactiveOrders: []
            };
        },

        methods: {
            getMyOrders() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetMyOrders",
                    params: {

                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.subscriptions.splice(0, vm.subscriptions.length, ...response.activeOrders);
                        vm.inactiveOrders.splice(0, vm.inactiveOrders.length, ...response.allOrders);
                    }
                });
            },
            addDetailsToPause(serviceItem) {
                this.serviceObj = serviceItem;
                $("#pauseServiceDetailsPopup").modal("show");
            },
            addDetailsToPauseResume(serviceObj) {
                this.serviceObj = serviceItem;
            },
            pauseSubscription(serviceObj) {

            },
            resumeSubscription(serviceObj) {

            },
            cancel() {
                $("#pauseServiceDetailsPopup, #deleteConfimationPopup").modal("hide");
            },
            getDeleteReasons() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServiceDeleteReasons",
                    params: {
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.serviceDeleteReasons.splice(0, vm.serviceDeleteReasons.length, ...response);
                    }
                });
            },
            deleteCustomerService() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "DeleteSubscription",
                    params: vm.selectedServiceItem,
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        $("#deleteConfimationPopup").modal("hide");
                        vm.selectedServiceItem = null
                        vm.getMyOrders();
                        //vm.serviceDeleteReasons.splice(0, vm.serviceDeleteReasons.length, ...response);
                    }
                });
            },
            deleteConfirm(serviceObj) {
                this.selectedServiceItem = serviceObj;
                $("#deleteConfimationPopup").modal("show");
                this.getDeleteReasons();
            },

            pauseOrder(serviceItem) {
                this.selectedServiceItem = serviceItem;
                $("#pauseServiceDetailsPopup").modal("show");
            },
            resumeOrder(serviceItem) {
                this.selectedServiceItem = serviceItem;
                // $("#pauseServiceDetailsPopup").modal("show");
            },
            updateFilterStartDate(key, dateObj, objectPassedToParent) {
                this.selectedServiceItem.StartDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
            },
            updateFilterEndDate(key, dateObj, objectPassedToParent) {
                this.selectedServiceItem.EndDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
            },
            pauseSubscription() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "PauseSubscriptionItem",
                    params: vm.selectedServiceItem,
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        $("#pauseServiceDetailsPopup").modal("hide");
                        vm.selectedServiceItem = null
                        vm.getMyOrders();
                    }
                });
            },
        },

        computed: {

        },

        mounted() {
            let vm = this;
            vm.getMyOrders();
        }
    };
</script>