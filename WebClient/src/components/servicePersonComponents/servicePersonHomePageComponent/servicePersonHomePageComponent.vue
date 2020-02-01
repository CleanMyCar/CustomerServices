<template src="./servicePersonHomePageComponent.template.html"></template>

<script>
    import moment from "moment-timezone";
    export default {
        name: "servicePersonHomePage",
        props: [],
        data() {
            return {
                entityNamesdata: {},
                servieList: [],
                serviceObj: null,
                todayDate: moment.utc().format("DD MMM, YYYY"),
                selectedProduct: null,
                selectedOption: null
            };
        },

        methods: {
            getServices() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAssignedServices",
                    params: {
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.servieList.splice(0, vm.servieList.length, ...response);
                        }
                    }
                });
            },
            showMoreInfo(serviceObj) {
                this.serviceObj = serviceObj;
                $("#primaryEmailPopup").modal("show");
            },
            chooseOption(serviceObj, optionType) {
                this.$router.push("/purchaseService/" + serviceObj.ServiceId + "/" + optionType);
            },
            getServicePersonDashborad() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServicePersonDashborad",
                    params: {
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.servieList.splice(0, vm.servieList.length, ...response);
                        }
                    }
                });
            },
            taskStatusChangePopup(productObj) {
                this.selectedProduct = productObj;
                $("#taskStatusChangePopup").modal("show")
            },
            updateServiceDetails() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "UpdateServiceStatus",
                    params: {
                        StatusId: vm.selectedOption == 'yes' ? 5 : 6,
                        RequestId: vm.selectedProduct.RequestId,
                        Notes: vm.selectedProduct.notes,
                        ServiceType: vm.selectedProduct.ServiceType,
                        Amount: vm.selectedProduct.VehicleTypeId == 2 ? (vm.selectedProduct.ServiceType == 2 ? vm.selectedProduct.FourWheelerOncePrice : vm.selectedProduct.FourWheelerSubPrice) : (vm.selectedProduct.ServiceType == 2 ? vm.selectedProduct.Price : vm.selectedProduct.SubscriptionPrice),
                        // vm.selectedProduct.ServiceType == 2 ? vm.selectedProduct.Price : vm.selectedProduct.SubscriptionPrice,
                        Attachment: vm.selectedProduct.Attachment
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response.ErrorMessage) {
                            vm.$store.dispatch("toastr", {
                                type: "error",
                                header: "Error!",
                                message: response.ErrorMessage
                            });
                            return;
                        }
                        $("#taskStatusChangePopup").modal("hide");
                        vm.closeConfirmationPopup();
                        vm.getServices();
                    }
                });

            },
            cancel() {
                this.selectedProduct.checked = false;
                $("#taskStatusChangePopup").modal("hide");
            },
            showConfirmationPopup(flag) {
                $("#serviceNotesPopup").modal("show")
                this.selectedOption = flag;
            },
            closeConfirmationPopup() {
                this.selectedOption = null;
                $("#serviceNotesPopup").modal("hide")
            },
            filesChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                let vm = this;
                let reader = new FileReader();
                reader.onload = e => {
                    vm.selectedProduct.Attachment = e.target.result;
                }
                reader.readAsDataURL(files[0]);
            }
        },
        computed: {
            userProfile() {
                return this.$store.state.loggedInUserDetail;
            },
            timeslots() {
                return this.$store.state.timeslots;
            }
        },

        mounted() {
            let vm = this;
            vm.getServices();
        },


    };
</script>