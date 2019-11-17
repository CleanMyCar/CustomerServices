<template src="./mysubscriptions.template.html"></template>

<script>
    export default {
        name: "mysubscriptions",
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