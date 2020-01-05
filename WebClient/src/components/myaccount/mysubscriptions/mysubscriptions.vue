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
                selectedReasons: [],
                newbtn: "../../../src/content/images/subscribe.png",
                calendarStartDate: moment.utc().add(1, 'days'),
                subscriptionTypes: [],
                serviceDetail: null
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
            opneModifyPopup(serviceObj) {
                let vm = this;
                vm.serviceObj = serviceObj;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServiceDetail",
                    params: {
                        serviceId: vm.serviceObj.ServiceId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.serviceDetail = response.serviceDetail;
                        vm.subscriptionTypes = response.subscribeTypes
                        $("#modifyServiceDetailsPopup").modal("show");
                    }
                });

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
            getFormattedDate(date) {
                return moment(date).format("DD MMM, YYYY")
            },
            navigateToHomePage() {
                this.$router.push("/")
            },
            closeModifyPopup(flag) {
                if (flag) {
                    this.updateSubscription();
                }
                $("#modifyServiceDetailsPopup").modal("hide")
            },
            updateSubscription() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "UpdateSubscription",
                    params: vm.serviceObj,
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.getMySubscriptions();
                    }
                });
            },
            selectSubscribeType(product) {
                this.serviceObj.Frequency = product.SubscribeId;
                if (product.SubscribeId != 2) {
                    this.serviceObj.WeeklyDay = null;
                }
            },
            selectWeeklyday(day) {
                this.serviceObj.WeeklyDay = day;
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