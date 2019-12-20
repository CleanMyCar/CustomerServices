<template src="./quantityComponent.template.html"></template>

<script>
    import Vue from "vue";
    import VeeValidate from "vee-validate";
    Vue.use(VeeValidate);

    export default {
        name: "quantityComponent",
        props: ["updateParent", "closeVehicleAddPopup", "inputValue"],
        data() {
            return {
                value: null
            };
        },

        methods: {
            incrementQuantity() {
                this.value = this.value ? this.value + 1 : 1
            },
            decrementQuantity() {
                if (this.value > 1)
                    this.value = this.value - 1;
            }
        },

        computed: {

        },

        mounted() {
            this.value = this.inputValue
        },
        watch: {
            $route: "fetchData",
            value(value) {
                this.updateParent(value);
            },
            inputValue() {
                this.value = this.inputValue;
            }
        }
    };
</script>