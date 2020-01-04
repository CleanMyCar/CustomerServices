<template src="./deleteConfirmationPopup.template.html"></template>

<script>
    export default {
        name: "deleteConfirmationPopup",
        props: ["updateParent", "isOpen", "headerTitle", "message"],
        data() {
            return {
                value: null
            };
        },

        methods: {
            confirm(flag) {
                this.updateParent(flag);
                $("#deleteConfirmationPopup").modal("hide");
            }
        },

        computed: {

        },

        mounted() {
            if (this.isOpen != null && this.isOpen > -1) {
                $("#deleteConfirmationPopup").modal("show");
            }
        },
        watch: {
            isOpen() {
                if (this.isOpen != null && this.isOpen > -1) {
                    $("#deleteConfirmationPopup").modal("show");
                }
                else {
                    $("#deleteConfirmationPopup").modal("hide");
                }
            }
        }
    };
</script>