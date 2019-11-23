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
                window.location.href = "/login.html"
            }
        },
        computed: {
            userProfile(){
                return this.$store.state.loggedInUserDetail ? this.$store.state.loggedInUserDetail : null;
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
        background: #eee
    }

    .profilePicture {
        /* border-radius: 50%;
        width: 50%;
        height: 50%; */
        display: inline-block;
        width: 150px;
        height: 150px;
        border-radius: 50%;

        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;


    }

    .name {
        font-size: 40px;
    }
</style>