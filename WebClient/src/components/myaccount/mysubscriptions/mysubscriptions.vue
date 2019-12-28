<template src="./mysubscriptions.template.html"></template>

<script>
    import moment from "moment";
    export default {
        name: "mysubscriptions",
        props: [],
        data() {
            return {
                subscriptions: [],
                serviceObj: null,
                serviceDeleteReasons: [],
                selectedReasons: []
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
                this.serviceObj = JSON.parse(JSON.stringify(serviceItem));
                this.$set(this.serviceObj, 'StartDate', moment.utc().add(1, 'days'));
                this.$set(this.serviceObj, 'EndDate', moment.utc().add(1, 'days'));

                $("#pauseServiceDetailsPopup").modal("show");
            },
            addDetailsToPauseResume(serviceObj) {                
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "ResumeSubscriptionItem",
                    params: serviceObj,
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.getMySubscriptions();               
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
                        $("#pauseServiceDetailsPopup").modal("hide");
                        vm.serviceObj = null
                        vm.getMySubscriptions();
                        //vm.serviceDeleteReasons.splice(0, vm.serviceDeleteReasons.length, ...response);
                    }
                });
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
                    params: {
                        serviceObj: vm.serviceObj,
                        selectedReasons: vm.selectedReasons
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        $("#deleteConfimationPopup").modal("hide");
                        vm.serviceObj = null
                        vm.getMySubscriptions();
                        vm.selectedReasons.splice(0, vm.selectedReasons.length);
                    }
                });
            },
            deleteConfirm(serviceObj) {
                this.serviceObj = serviceObj;
                $("#deleteConfimationPopup").modal("show");
                this.getDeleteReasons();
            },
            updateFilterStartDate(key, dateObj, objectPassedToParent) {
                this.serviceObj.StartDate = dateObj ? dateObj.format("Do MMM YYYY") : null;
                this.serviceObj.EndDate = dateObj ? dateObj.format("Do MMM YYYY") : null
                this.serviceObj.ServicePauseDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
                this.serviceObj.ServiceEndDate = dateObj ? dateObj.format("DD MMM YYYY") : null
            },
            updateFilterEndDate(key, dateObj, objectPassedToParent) {
                this.serviceObj.EndDate = dateObj ? dateObj.format("Do MMM YYYY") : null;
                this.serviceObj.ServiceEndDate = dateObj ? dateObj.format("DD MMM YYYY") : null
            },
            getFormattedDate(date){
                return moment.utc(date).format("DD MMM, YYYY")
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