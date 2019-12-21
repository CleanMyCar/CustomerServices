<template src="./quantityComponent.template.html"></template>

<script>
    import Vue from "vue";
    import VeeValidate from "vee-validate";
    Vue.use(VeeValidate);

    export default {
        name: "quantityComponent",
        props: ["updateParent", "closeVehicleAddPopup", "inputValue", "disabled", "callbackResponse"],
        data() {
            return {
                value: null
            };
        },

        methods: {
            incrementQuantity() {
                this.value = this.value ? Number(this.value) + 1 : 1
            },
            decrementQuantity() {
                if (this.value > 1){
                    this.value = Number(this.value) - 1;
                }
            }
        },

        computed: {

        },

        mounted() {
            this.value = this.inputValue
        },
        watch: {
            value(value) {
                if(value == 0){
                    this.value = 1;
                }
                this.updateParent(value, this.callbackResponse);
            },
            inputValue() {
                this.value = this.inputValue;
            }
        }
    };
</script>