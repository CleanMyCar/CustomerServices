<template src="./mysubscriptions.template.html"></template>

<script>
    export default {
        name: "mysubscriptions",
        props: [],
        data() {
            return {
                subscriptions: [],
                serviceObj: null,
                serviceDeleteReasons: [],
                selectedReasons:[]
            };
        },

        methods: {
            getMySubscriptions() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetMySubscriptions",
                    params: {
                        serviceId: vm.$route.params.serviceId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.subscriptions.splice(0, vm.subscriptions.length, ...response);
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
                $("#pauseServiceDetailsPopup").modal("hide");
            },
            selectDeleteReason() {
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

            }
        },

        computed: {

        },

        mounted() {
            let vm = this;
            vm.getMySubscriptions();
        }
    };
</script>