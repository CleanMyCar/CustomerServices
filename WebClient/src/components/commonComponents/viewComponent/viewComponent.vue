<template src="./viewComponent.template.html"></template>
<script type="text/javascript">
    export default {
        name: "viewComponent",
        props: ["entityId", "entityTypeId"],
        data() {
            return {
                tagsList: [],
                searchTag: null,
                showAutoComplete: false,
                entityTags: []
            };
        },
        methods: {

        },
        computed: {
        },
        mounted() {

        },
        watch: {
        },
        destroyed() {

        }
    };

</script>