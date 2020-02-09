<template src="./addressPopupComponent.template.html"></template>

<script>
    import Vue from "vue";
    import VeeValidate from "vee-validate";
    Vue.use(VeeValidate);

    export default {
        name: "addressPopupComponent",
        props: ["updateParent", "isOpen", "selectedAddress", "closeAddressPopup"],
        data() {
            return {
                address: null
            };
        },

        methods: {
            addAddressDetails() {
                this.address = {
                    AddressId: -1,
                    AddressLine1: null,
                    AddressLine2: null,
                    Landmark: null,
                    IsDefault: false,
                    Country: 101,
                    State: 36,
                    City: 4460,
                    Pincode: null
                }
                $("#addAddressPopup").modal("show");
            },
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
                                $("#addAddressPopup").modal("hide");
                                if (vm.updateParent) {
                                    vm.updateParent(vm.address);
                                }
                            }
                        });

                    }
                });

            },
            cancel() {
                $("#addAddressPopup").modal("hide");
                this.closeAddressPopup();
            },
            navigateToBack() {
                this.$router.push("/");
            },
            closeValidationPopup() {
                $("#vehicleValidationPopup").modal("hide")
            },
            getAddressDetails() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAddressDetails",
                    params: {
                        AddressId: vm.selectedAddress.AddressId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.address = response;
                    }
                });
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
            if (vm.selectedAddress && vm.selectedAddress.AddressId > 0) {
                vm.getAddressDetails();
            }
            else {
                vm.addAddressDetails();
            }
            $("#addAddressPopup").modal("show")
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
                    $("#addAddressPopup").modal("show")
                }
                else {
                    $("#addAddressPopup").modal("hide")
                }
            }
        }
    };
</script>