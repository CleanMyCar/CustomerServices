<template src="./apartmentsAddressComponent.template.html"></template>

<script>
    export default {
        name: "apartmentsAddressComponent",
        props: [],
        data() {
            return {
                addressList: [],
                showEdit: false,
                selectedAddress: null
            };
        },

        methods: {
            getAddressList() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAddressBySearch",
                    params: {
                        SearchText: null
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.addressList.splice(0, vm.addressList.length, ...response);
                        }
                        vm.showEdit = false;
                    }
                });
            },
            newAddress() {
                this.showEdit = true;
                this.selectedAddress = {
                    AddressId: null,
                    AddressLine1: null,
                    AddressLine2: null,
                    Country: 101,
                    State: 36,
                    City: 4460,
                    Pincode: null,
                    StatusId: 1
                }
            },
            cancel() {
                this.showEdit = false;
            },
            saveAddress(service, evt) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "SaveAddress",
                    params: Object.assign(vm.selectedAddress, { IsUserAddress: false }),
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.getAddressList();
                    }
                });
            },

            getAddressDetail(address) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAddressDetails",
                    params: {
                        AddressId: address.AddressId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.selectedAddress = response;
                        vm.showEdit = true;
                    }
                });
            },
        },
        computed: {
            statusList() {
                return this.$store.state.status;
            },
            countries() {
                return this.$store.state.countryStateCities;
            },
            states() {
                return this.$store.state.countryStateCities[this.selectedAddress.Country].states;
            },
            cities() {
                return this.$store.state.countryStateCities[this.selectedAddress.Country].states[this.selectedAddress.State].cities;
            }
        },

        mounted() {
            let vm = this;
            vm.getAddressList();
        },
        watch: {

        }
    };
</script>