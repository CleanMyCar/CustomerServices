<template src="./apartmentsAddressComponent.template.html"></template>

<script>
    export default {
        name: "apartmentsAddressComponent",
        props: [],
        data() {
            return {
                addressList: [],
                showEdit: false
            };
        },

        methods: {
            getServices(searchText, numberOfRecords) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAllServices",
                    params: {
                        SearchText: searchText,
                        NumberOfRecords: numberOfRecords,
                        SelectedStatus: vm.selectedStatus
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.serviceList.splice(0, vm.serviceList.length, ...response);
                        }
                    }
                });
            },
            newAddress() {
                this.showEdit = true;
            },
            cancel(){
                this.showEdit = false;
            },
            getServiceDetail(service) {
                this.$router.push("/serviceDetail/" + service.ServiceId);
            },
            updateServiceFrequent(service, evt) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "UpdateServiceFrequencyFlag",
                    params: {
                        ServiceId: service.ServiceId,
                        IsFrequent: evt.currentTarget.checked
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.getServices(null, -1);
                    }
                });
            },

            updateServiceOrder(service) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "UpdateServiceOrder",
                    params: {
                        ServiceId: service.ServiceId,
                        ServiceOrder: service.ServiceOrder
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.getServices(null, -1);
                    }
                });
            },
        },
        computed: {
            role() {
                return this.$store.state.loggedInUserDetail ? this.$store.state.loggedInUserDetail.UserRoleId : null
            },
            statusList() {
                return this.$store.state.status;
            }
        },

        mounted() {
            let vm = this;
            vm.getServices(null, -1);
        },
        watch: {

        }
    };
</script>