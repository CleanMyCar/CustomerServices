<template src="./guestProfileListVue.template.html"></template>
<script>
    export default {
        // options
        name: "guestProfileListComponent",
        props: [],
        data() {
            return {
                guestProfileList: [],
                listType: 'list'
            };
        },
        methods: {
            switchView() {
                if (this.listType == 'list')
                    this.listType = 'card';
                else
                    this.listType = 'list';
            },
            createNewInstance(){
                this.$router.push("/guestProfileDetail/" + -1 + "/" + -1);
            },
         
        },
        computed: {
            
        },
        watch: {
            
        },
        mounted() {
            
        }
    }

</script>