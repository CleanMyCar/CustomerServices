<template src="./assignServiceComponent.template.html"></template>

<script>
    import moment from "moment-timezone";
    export default {
        name: "assignServiceComponent",
        props: [],
        data() {
            return {
                pendingServices: [],
                serviceType: null,
            };
        },

        methods: {
            getServices() {
                let vm = this;
                vm.serviceType = vm.$route.params.serviceType

                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAllPendingServicesByType",
                    params: {
                        serviceType: vm.$route.params.serviceType
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.pendingServices.splice(0, vm.pendingServices.length, ...response);
                    }
                });
            },
            returnDateTime(date) {
                return date ? moment(date).format("Do MMM YYYY") : null
            }
        },
        computed: {
        },

        mounted() {
            let vm = this;
            vm.getServices();
        },
        watch: {
            $route: "getServices",
        }


    };
</script>