<template src="./toastrMessageComponent.template.html"></template>

<script>
    export default {
        name: "toastrMessageComponent",
        props: ["updateParent", "isOpen", "message", "closeToastrPopup", "headerTitle"],
        data() {
            return {
            };
        },
        methods: {
            cancel() {
                $("#toastrMessagePopup").modal("hide");
                this.closeToastrPopup();
            }            
        },
        computed: {

        },
        mounted() {
            let vm = this;
            $("#toastrMessagePopup").modal("show")
        },
        watch: {
            $route: "fetchData",
            isOpen() {
                let vm = this;
                if (this.isOpen) {
                    $("#toastrMessagePopup").modal("show")
                }
                else {
                    $("#toastrMessagePopup").modal("hide")
                }
            }
        }
    };
</script>