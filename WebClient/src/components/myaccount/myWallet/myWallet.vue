<template src="./myWallet.template.html"></template>

<script>
    import moment from "moment-timezone";
    export default {
        name: "myWallet",
        props: ["hideHeader"],
        data() {
            return {
                myWalletTransactions: [],
            }
        },

        methods: {
            getMyWalletTransactions() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetMyWalletTransactions",
                    params: {

                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.myWalletTransactions.splice(0, vm.myWalletTransactions.length, ...response);
                    }
                });
            },
            returnDateTime(date) {
                return date ? moment.utc(date).format("Do MMM YYYY") : null
            },

        },

        computed: {

        },

        mounted() {
            let vm = this;
            vm.getMyWalletTransactions();
        }
    };
</script>