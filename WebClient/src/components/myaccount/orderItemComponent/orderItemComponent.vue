<template src="./orderItemComponent.template.html"></template>

<script>
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