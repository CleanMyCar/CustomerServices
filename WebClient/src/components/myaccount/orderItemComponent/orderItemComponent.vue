<template src="./orderItemComponent.template.html"></template>

<script>
    export default {
        name: "orderItem",
        props: ["orderId"],
        data() {
            return {
                subscriptions: [],
                serviceObj: null,
                serviceDeleteReasons: [],
                selectedReasons: [],
                orderDetails: null
            };
        },

        methods: {
            getOrderDetails() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetOrderDetails",
                    params: {
                        RequestId: vm.orderId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.orderDetails = response;
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
                    key: "DeleteMySubscription",
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
            deleteConfirm(serviceObj) {
                this.serviceObj = serviceObj;
                $("#deleteConfimationPopup").modal("show");
                this.getDeleteReasons();
            },
            updateFilterStartDate(key, dateObj, objectPassedToParent) {
                this.serviceObj.StartDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
            },
            updateFilterEndDate(key, dateObj, objectPassedToParent) {
                this.serviceObj.EndDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
            },
        },

        computed: {

        },

        mounted() {
            let vm = this;
            // vm.getMySubscriptions();
            this.getOrderDetails();
        },
        watch: {
            orderId() {
                this.getOrderDetails();
            }
        }
    };
</script>