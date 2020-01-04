<template src="./historyPopupComponent.template.html"></template>

<script>
    import moment from "moment"
    export default {
        name: "historyPopupComponent",
        props: ["vehicleId", "updateParent", "isOpen"],
        data() {
            return {
                productOrders: [],
                vehicleDetails: null
            };
        },

        methods: {
            getVehicleHistory() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetVehicleHistory",
                    params: {
                        VehicleId: vm.vehicleId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.vehicleDetails = response.vehicleDetails;
                        vm.productOrders.splice(0, vm.productOrders.length, ...response.history);
                    }
                });
            },
            cancel() {
                $("#historyComponentPopup").modal("hide");
                this.updateParent();
            },
            getFormattedDate(date) {
                if (date)
                    return moment.utc(date).format("Do MMM, YYYY")
                return ""
            }
        },

        computed: {

        },

        mounted() {
            let vm = this;
            $("#historyComponentPopup").modal("show")
            vm.getVehicleHistory();
        },
        watch: {
            vehicleId() {
                this.getVehicleHistory();
            },
            isOpen() {
                let vm = this;
                if (this.isOpen) {
                    $("#historyComponentPopup").modal("show")
                }
                else {
                    $("#historyComponentPopup").modal("hide")
                }
            }
        }
    };
</script>