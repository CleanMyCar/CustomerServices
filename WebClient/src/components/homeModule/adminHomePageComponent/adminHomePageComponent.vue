<template src="./adminHomePageComponent.template.html"></template>

<script>
    export default {
        name: "adminHomePage",
        props: [],
        data() {
            return {
                dashBoardDetails: null
            };
        },

        methods: {
            getAdminDashborad() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAdminDashboard",
                    params: {
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.dashBoardDetails = response;
                    }
                });
            },
            showPendingVehicleServices(){
                this.$router.push("/assignService/1");
            }
        },
        computed: {
        },

        mounted() {
            let vm = this;
            vm.getAdminDashborad();
        },
        watch:{}

    };
</script>