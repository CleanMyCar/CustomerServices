<template src="./viewAddressComponent.template.html"></template>

<script>
    import moment from "moment-timezone";
    export default {
        name: "viewAddressComponent",
        props: ["addressId"],
        data() {
            return {
                addressDetails: null,
                isOpen: false,
                selectedAddress: null,
                isDialogOpen: false,
                popupMessage: null,
                headerTitle: null
            };
        },

        methods: {
            getAddressDetails() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAddressDetails",
                    params: {
                        AddressId: vm.addressId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.addressDetails = response;
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
            returnDateTime(date) {
                return date ? moment(date).format("Do MMM YYYY") : null
            },
            editAddress() {
                this.isOpen = !this.isOpen;
                this.selectedAddress = this.addressDetails;
            },
            closeAddressPopup() {
                this.isOpen = !this.isOpen;
            },
            addressCallback() {
                this.isOpen = !this.isOpen;
                this.getAddressDetails();
            },
            deleteAddress() {
                let vm = this;
                if (vm.addressDetails.IsDefault) {
                    vm.headerTitle = "Alert !!";
                    vm.popupMessage = "You cannot delete default address";
                    vm.isDialogOpen = !vm.isDialogOpen;
                    return;
                }

                vm.$store.dispatch("dataRequestHandler", {
                    key: "DeleteAddress",
                    params: { StatusId: -2, AddressId: vm.addressDetails.AddressId },
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
            },
            closeToastrPopup(){
                this.isDialogOpen = !this.isDialogOpen;
            }
        },

        computed: {
            disableDelete() {
                return this.orderDetails && moment(this.orderDetails.ServiceDate).diff(moment(), "seconds") < 0;
            }
        },

        mounted() {
            let vm = this;
            this.getAddressDetails();
        },
        watch: {
            addressId() {
                this.getAddressDetails();
            }
        }
    };
</script>