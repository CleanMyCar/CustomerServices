<template src="./serviceDetailComponent.template.html"></template>

<script>
    export default {
        name: "serviceDetailComponent",
        props: [],
        data() {
            return {
                serviceDetail: null,
                isOnceEnabled: false,
                isSubscribeEnabled: false,
                defaultImage: null
            };
        },

        methods: {
            getServiceDetail() {
                let vm = this;

                if (vm.$route.params.serviceId == -1) {
                    vm.serviceDetail = {
                        ServiceId: -1,
                        ServiceName: null,
                        IsEnabled: true,
                        SubscriptionPrice: null,
                        Price: null,
                        ServiceImage: null,
                        ServiceDescription: null
                    }
                    return;
                }

                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServiceDetail",
                    params: {
                        serviceId: vm.$route.params.serviceId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.serviceDetail = response.serviceDetail;
                        }
                    }
                });
            },
            togglePrice(evt) {
                console.log(evt.currentTarget.checked)
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
                vm.$store.dispatch("dataRequestHandler", {
                    key: "SaveServiceDetail",
                    params: vm.serviceDetail,
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.$router.push("/manageServices");
                    }
                });
            },
            Cancel() {

            },
            filesChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                let vm = this;
                let reader = new FileReader();
                reader.onload = e => {
                    vm.serviceDetail.ServiceImage = e.target.result;
                }
                reader.readAsDataURL(files[0]);
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
        }
    };
</script>