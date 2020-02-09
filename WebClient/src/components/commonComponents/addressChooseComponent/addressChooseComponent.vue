<template src="./addressChooseComponent.template.html"></template>

<script>
    import Vue from "vue";
    import VeeValidate from "vee-validate";
    Vue.use(VeeValidate);

    export default {
        name: "addressChooseComponent",
        props: ["updateParent", "isOpen", "selectedAddress", "closeAddressPopup"],
        data() {
            return {
                userAddressList: []
            };
        },
        methods: {

            saveAddress(status) {
                let vm = this;
                vm.$validator.validateAll().then(result => {
                    if (result) {
                        vm.$store.dispatch("dataRequestHandler", {
                            key: "SaveAddress",
                            params: Object.assign(vm.address, { StatusId: status, IsUserAddress: true }),
                            callback: function (err, response) {
                                if (err) {
                                    return;
                                }
                                // vm.getMyProducts();
                                $("#chooseAddressPopup").modal("hide");
                                if (vm.updateParent) {
                                    vm.updateParent(vm.address);
                                }
                            }
                        });

                    }
                });

            },
            cancel() {
                $("#chooseAddressPopup").modal("hide");
                this.closeAddressPopup();
            },
            navigateToBack() {
                this.$router.push("/");
            },
            closeValidationPopup() {
                $("#vehicleValidationPopup").modal("hide")
            },
            getAddressList() {
                var vm = this;
                this.$store.dispatch("dataRequestHandler", {
                    key: 'GetUserAddressIds',
                    params: {},
                    callback: function (err, response) {
                        vm.userAddressList.splice(0, vm.userAddressList.length, ...response);
                    }
                });
            },
            addressCallback(address) {
                this.selectedAddress(address);
                $("#chooseAddressPopup").modal("hide")
            }
        },

        computed: {
            countries() {
                return this.$store.state.countryStateCities;
            },
            states() {
                return this.$store.state.countryStateCities[this.address.Country].states;
            },
            cities() {
                return this.$store.state.countryStateCities[this.address.Country].states[this.address.State].cities;
            }
        },

        mounted() {
            let vm = this;
            vm.getAddressList();
            $("#chooseAddressPopup").modal("show")
        },
        watch: {
            $route: "fetchData",
            isOpen() {
                let vm = this;
                if (this.isOpen) {
                    if (vm.selectedAddress && vm.selectedAddress.AddressId > 0) {
                        vm.getAddressDetails();
                    }
                    else {
                        vm.addAddressDetails();
                    }
                    $("#chooseAddressPopup").modal("show")
                }
                else {
                    $("#chooseAddressPopup").modal("hide")
                }
            }
        }
    };
</script>