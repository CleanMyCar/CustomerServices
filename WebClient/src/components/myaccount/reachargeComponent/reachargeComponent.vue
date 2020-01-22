<template src="./reachargeComponent.template.html"></template>

<script>
    import moment from "moment-timezone";
    import * as axios from 'axios';
    export default {
        name: "rechargeWallet",
        props: [],
        data() {
            return {
                myWalletTransactions: [],
                rechargeAmount: null,
                rechargeAmounts: [
                    { Id: 1, Amount: 400 },
                    { Id: 2, Amount: 500 },
                    { Id: 3, Amount: 1000 },
                    { Id: 4, Amount: 1200 },
                    { Id: 5, Amount: 1500 },
                    { Id: 6, Amount: 2000 },
                ],
                selectedRechargeId: null,
                isDialogOpen: false,
                popupMessage: null,
                headerTitle: null,
                walletSummary: {},
                isWalletChanged: false
            }
        },

        methods: {
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
            returnDateTime(date) {
                return date ? moment.utc(date).format("Do MMM YYYY") : null
            },
            selectRecharge(recharge) {
                this.selectedRechargeId = recharge.Id;
                this.rechargeAmount = recharge.Amount;
            },
            closeToastrPopup() {
                this.isDialogOpen = false;
            },
            rechargeWallet() {
                let vm = this;
                if (vm.rechargeAmount && !isNaN(vm.rechargeAmount) && Number(vm.rechargeAmount) > 0) {


                    let url = (window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":1339" : '')) + '/api/rechargeWallet';
                    window.location.href = url + "?Amount=" + this.rechargeAmount + "&token=" + window.localStorage.getItem('rttoken')
                    return;
                    let receiveMessage = function (event) {
                        console.log(event);
                        if (event.origin === window.location.origin) {
                            let data = event.data;

                            if (data.transactionId) {
                                vm.getUserWalletSummary();
                                vm.isWalletChanged = true;
                                vm.rechargeAmount = null;
                            }

                        }
                        else {
                            console.log("received response from another page ", event.origin)
                        }
                    }
                    window.removeEventListener('message', receiveMessage, false);
                    window.addEventListener("message", receiveMessage, false);

                    window.open(url + "?Amount=" + this.rechargeAmount + "&token=" + window.localStorage.getItem('rttoken'), '_blank', 'width=600,height=600');

                }
                else {
                    this.isDialogOpen = true;
                    this.headerTitle = "Validation";
                    this.popupMessage = "Please enter valid amount";
                }
            }

        },

        computed: {

        },

        mounted() {
            let vm = this;
            vm.getUserWalletSummary();
        },
        watch: {
            rechargeAmount() {
                if (this.rechargeAmount && Number(this.rechargeAmount) > 10000) {
                    this.isDialogOpen = true;
                    this.headerTitle = "Validation";
                    this.popupMessage = "Please recharge amount below 10000";
                }
            },
            $route: "getUserWalletSummary"
        }
    };
</script>