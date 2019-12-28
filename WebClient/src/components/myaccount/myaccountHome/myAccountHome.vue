<template src="./myAccountHome.template.html"></template>

<script>
    export default {
        name: "myAccountHome",
        props: [],
        data() {
            return {
            };
        },

        methods: {
            navigateToMyProfile(){
                this.$router.push("/userprofile");
            },
            navigateToMySubscriptions(){
                this.$router.push("/mysubscriptions");
            },
            navigateToMyProducts(){
                this.$router.push("/myproducts");
            },
            navigateToMyWallet(){
                this.$router.push("/myWallet");
            }
        },

        computed: {

        },

        mounted() {
            let vm = this;
            console.log("mounted")
        }
    };
</script>