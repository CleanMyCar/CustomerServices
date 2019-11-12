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