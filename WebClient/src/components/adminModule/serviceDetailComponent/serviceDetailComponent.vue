<template src="./serviceDetailComponent.template.html"></template>

<script>
    import moment from "moment-timezone";
    import Vue from "vue";
    import VeeValidate from "vee-validate";
    Vue.use(VeeValidate);

    export default {
        name: "serviceDetailComponent",
        props: [],
        data() {
            return {
                serviceDetail: null,
                isOnceEnabled: false,
                isSubscribeEnabled: false,
                defaultImage: null,
                vehicleTypes: [],
                fourWheelerTypes: [],
                subscribeTypes: [],
                timeslots: []
            };
        },

        methods: {
            getServiceDetail() {
                let vm = this;

                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServiceDetail",
                    params: {
                        serviceId: vm.$route.params.serviceId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (vm.$route.params.serviceId == -1) {
                            vm.serviceDetail = {
                                ServiceId: -1,
                                ServiceName: null,
                                IsEnabled: true,
                                SubscriptionPrice: null,
                                Price: null,
                                ServiceImage: null,
                                ServiceDescription: null,
                                VehicleCategoryType: "2",
                                serviceFourWheelerTypes: [],
                                serviceSubscribeTypes: [],
                                IsSubscriptionEnabled: false,
                                IsPurchaseOnceEnabled: false,
                                ServiceOrder: 1,
                                IsFrequent: 0,
                                Discount: 0
                            }
                        }
                        if (response.serviceDetail) {
                            vm.serviceDetail = response.serviceDetail;
                        }
                        vm.vehicleTypes.splice(0, vm.vehicleTypes.length, ...response.vehicleTypes)
                        vm.fourWheelerTypes.splice(0, vm.fourWheelerTypes.length, ...response.fourWheelerTypes)
                        vm.subscribeTypes.splice(0, vm.subscribeTypes.length, ...response.subscribeTypes)
                        vm.timeslots.splice(0, vm.timeslots.length, ...response.timeslots)
                    }
                });
            },
            togglePrice(evt) {
                // console.log(evt.currentTarget.checked)
                if (!evt.currentTarget.checked) {
                    this.serviceDetail.Price = null;
                }
            },
            toggleSubscribe(evt) {
                if (!evt.currentTarget.checked) {
                    this.serviceDetail.SubscriptionPrice = null;
                }
            },
            saveService() {
                let vm = this;
                // vm.$validator.validateAll().then(result => {
                //     if (result) {
                vm.$store.dispatch("dataRequestHandler", {
                    key: "SaveServiceDetail",
                    params: {
                        serviceDetail: vm.serviceDetail,
                        fourWheelerTypes: vm.fourWheelerTypes
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.$router.push("/manageServices");
                    }
                });
                //     }
                // });
            },
            Cancel() {
                this.$router.push("/manageServices");
            },
            filesChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                let vm = this;
                let reader = new FileReader();
                reader.onload = e => {
                    vm.serviceDetail.ServiceImage = e.target.result;
                }
                reader.readAsDataURL(files[0]);
            },
            selectTimeSlot(timeslotObj) {
                let index = this.serviceDetail.serviceTimeslots.indexOf(timeslotObj.TimeSlotId);
                if (index > -1) {
                    this.serviceDetail.serviceTimeslots.splice(index, 1);
                }
                else {
                    this.serviceDetail.serviceTimeslots.push(timeslotObj.TimeSlotId);
                }
            },
            getFormatedTime(time) {
                return moment.utc(time).format("HH:mm")
            }
        },
        computed: {
            role() {
                return this.$store.state.loggedInUserDetail ? this.$store.state.loggedInUserDetail.UserRoleId : null
            }
        },

        mounted() {
            let vm = this;
            vm.getServiceDetail();
        },
        watch: {
            $route: "getServiceDetail",
            'serviceDetail.VehicleCategoryType'(type) {
                if (type == "2") {
                    this.serviceDetail.Price = null;
                    this.serviceDetail.SubscriptionPrice = null;
                }
            },
            'serviceDetail.ServiceOrder'(value) {
                if (value <= 0) {
                    this.serviceDetail.ServiceOrder = null;
                }
            }
        }
    };
</script>