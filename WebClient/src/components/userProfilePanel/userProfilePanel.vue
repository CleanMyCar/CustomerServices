<template src="./userProfilePanel.template.html"></template>

<script>
    export default {
        name: 'userProfilePanel',
        props: ["panelCallback"],
        data() {
            return {
            }
        },
        methods: {
            getUserProfileSummary() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetUserProfile",
                    params: {},
                    callback: function (error, response) {
                        if (error) {
                            vm.$store.dispatch("toastr", {
                                type: "error",
                                header: "user error!",
                                message: error.sqlMessage ? error.sqlMessage : error
                            });
                            return;
                        }
                        vm.userProfile = response;
                    }
                })
            },
            fetchData() {

            },
            redirectToHome() {
                this.panelCallback();
                this.$router.push("/")
            },
            redirectToMyAccount() {
                this.panelCallback();
                this.$router.push("/myAccount")
            },
            redirectToMyProducts() {
                this.panelCallback();
                this.$router.push("/myProducts")
            },
            redirectToMyOrders() {
                this.panelCallback();
                this.$router.push("/myOrders")
            },
            userLogout() {
                this.panelCallback();
                window.localStorage.removeItem('rttoken');
                if(window.webkit && window.webkit.messageHandlers){
                    window.webkit.messageHandlers.jsHandler.postMessage({type: "logout"});
                }
                window.location.href = "/login.html"

                // window.location.href = "preindex.html?logout=ios";
            },
            redirectToRequestMaterial() {
                this.panelCallback();
                this.$router.push("/requestMaterial")
            },
            redirectToCompanyAssets() {
                this.panelCallback();
                this.$router.push("/assets")
            },
            redirectToUsers() {
                this.panelCallback();
                this.$router.push("/users")
            },
            redirectToManageServices() {
                this.panelCallback();
                this.$router.push("/manageServices")
            },
            redirectToUsersWallet() {
                this.panelCallback();
                this.$router.push("/addAmountToWallet")
            },
            redirectToMySubscriptions() {
                this.panelCallback();
                this.$router.push("/mysubscriptions")
            },
            redirectToSupport() {
                this.panelCallback();
                this.$router.push("/support")
            },
            redirectToRecharge() {
                this.panelCallback();
                this.$router.push("/recharge/-1")
            },
            redirectToManageAddress() {
                this.panelCallback();
                this.$router.push("/serviceApartments")
            },
        },
        computed: {
            userProfile() {
                return this.$store.state.loggedInUserDetail ? this.$store.state.loggedInUserDetail : null;
            },
            userRole() {
                return this.userProfile && this.userProfile.UserRoleId;;
            },
            userWallet() {
                return this.$store.state.loggedInUserWallet;
            }

        },
        beforeDestroy() {

        },
        watch: {
            $route: "fetchData"
        },
        mounted() {
            // this.getUserProfileSummary();
        }
    }
</script>
<style>
    .profileUl li {
        padding: 10px;
        cursor: pointer;
    }

    .iconUser {
        width: 35px;
        height: 35px;
        border-radius: 30px;
        background: #eee;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .profilePicture {
        /* border-radius: 50%;
        width: 50%;
        height: 50%; */
        display: inline-block;
        width: 120px;
        height: 120px;
        border-radius: 50%;

        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;


    }

    .name {
        font-size: 40px;
    }
</style>