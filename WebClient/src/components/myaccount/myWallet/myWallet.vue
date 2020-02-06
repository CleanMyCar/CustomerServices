<template src="./myWallet.template.html"></template>

<script>
    import moment from "moment-timezone";
    export default {
        name: "myWallet",
        props: ["hideHeader", "isWalletChanged"],
        data() {
            return {
                myWalletTransactions: [],
                walletSummary: {}
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

            getUserWalletSummary() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetUserWalletSummary",
                    params: {

                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.walletSummary = response;
                    }
                });
            },
        },

        computed: {

        },

        mounted() {
            let vm = this;
            vm.getMyWalletTransactions();
            vm.getUserWalletSummary();
        },
        watch:{
            isWalletChanged(){
                this.getMyWalletTransactions();
                this.getUserWalletSummary();
            }
        }
    };
</script>