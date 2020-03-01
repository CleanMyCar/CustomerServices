<template src="./addAmountToWallet.template.html"></template>
<script>
    export default {
        // options
        name: "addAmountToWallet",
        props: [],
        data() {
            return {
                userList: [],
            };
        },
        methods: {
            getData: function () {
                //call action to get data
                let self = this;
                this.$store.dispatch("dataRequestHandler", {
                    key: "GetUserList",
                    params:
                    {
                        ModuleAction: "GetUserList",
                        filterObj: self.filterObj
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        else {
                            console.log("response in GetUserList", response);
                            self.userList = response.recordsets[0];
                        }
                    }
                })
            },
            rechargeToUser(user) {
                if (user.rechargeAmount && !isNaN(user.rechargeAmount) && user.rechargeReason && user.rechargeReason.trim()) {

                    let vm = this;
                    vm.$store.dispatch("dataRequestHandler", {
                        key: "ManualRechargeToUser",
                        params:
                        {
                            Amount: user.rechargeAmount,
                            UserId: user.UserId,
                            WalletId: user.WalletId,
                            Reason: user.rechargeReason
                        },
                        callback: function (err, response) {
                            if (err) {
                                return;
                            }
                            else {
                                // console.log("response in GetUserList", response);
                                vm.getData();
                            }
                        }
                    })
                }
                else{
                    alert("enter valid amount/reason")
                }
            }
        },
        computed: {
        },
        watch: {
        },
        mounted() {
            this.getData();
        }
    }

</script>