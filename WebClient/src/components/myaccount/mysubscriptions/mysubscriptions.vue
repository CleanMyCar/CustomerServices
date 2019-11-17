<template src="./mysubscriptions.template.html"></template>

<script>
    export default {
        name: "mysubscriptions",
        props: [],
        data() {
            return {
                subscriptions: []
            };
        },

        methods: {
            getMySubscriptions() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetMySubscriptions",
                    params: {
                        serviceId: vm.$route.params.serviceId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.subscriptions.splice(0, vm.subscriptions.length, ...response);
                    }
                });
            },
            pauseSubscription(serviceObj){

            },
            resumeSubscription(serviceObj){
                
            }
        },

        computed: {

        },

        mounted() {
            let vm = this;
            vm.getMySubscriptions();
        }
    };
</script>