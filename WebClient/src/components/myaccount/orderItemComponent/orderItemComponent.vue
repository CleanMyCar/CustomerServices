<template src="./orderItemComponent.template.html"></template>

<script>
    import moment from "moment-timezone";
    export default {
        name: "orderItem",
        props: ["orderId", "pauseOrder", "resumeOrder", "deleteOrder"],
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
                // this.serviceObj = serviceItem;
                // $("#pauseServiceDetailsPopup").modal("show");
                this.pauseOrder(serviceItem)
            },
            addDetailsToPauseResume(serviceObj) {
                // this.serviceObj = serviceItem;
                this.resumeOrder(serviceItem);
            },
            cancel() {
                $("#pauseServiceDetailsPopup, #deleteConfimationPopup").modal("hide");
            },
            deleteCustomerService(serviceObj) {
                let vm = this;
                vm.deleteOrder(serviceObj)
            },
            returnDateTime(date) {
                return date ? moment(date).format("Do MMM YYYY") : null
            }
        },

        computed: {
            disableDelete(){
                return this.orderDetails && moment(this.orderDetails.ServiceDate).diff(moment(), "seconds") < 0;
            }
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