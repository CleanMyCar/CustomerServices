<template src="./myOrders.template.html"></template>

<script>
    import moment from "moment"
    export default {
        name: "myOrders",
        props: [],
        data() {
            return {
                myOrders: [],
                serviceObj: null,
                serviceDeleteReasons: [],
                selectedReasons: [],
                selectedServiceItem: null,
                orderFilters:{
                    FilterDate: moment.utc(),
                    ActualDate: moment.utc()
                }
            };
        },

        methods: {
            getMyOrders() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetMyOrders",
                    params: {
                        Date: vm.orderFilters.ActualDate
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.myOrders.splice(0, vm.myOrders.length, ...response);
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
                this.selectedReasons.splice(0, this.selectedReasons.length);
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
            updateOrdersFilterDate(key, dateObj, objectPassedToParent) {
                this.orderFilters.FilterDate = dateObj ? dateObj.format("Do MMM YYYY") : null;
                this.orderFilters.ActualDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
            }
        },

        computed: {

        },

        mounted() {
            let vm = this;
            vm.getMyOrders();
        }
    };
</script>