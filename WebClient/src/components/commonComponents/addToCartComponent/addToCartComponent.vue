<template src="./addToCartComponent.template.html"></template>

<script>
    import Vue from "vue";
    import VeeValidate from "vee-validate";
    Vue.use(VeeValidate);

    export default {
        name: "addToCartComponent",
        props: ["updateParent", "closeVehicleAddPopup", "product", "serviceSaved"],
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
            },
            addServiceToCart(){
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "SaveProductToCart",
                    params:  vm.product,
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if(response.CartProductId){
                            vm.$store.state.bus.$emit("refreshCart");
                        }
                    }
                });
            },
            confirmOrder(){
                this.updateParent(0);
            }
        },
        computed: {

        },
        mounted() {
        },
        watch: {
            $route: "fetchData",
            product(){

            },
            serviceSaved(){
                if(this.serviceSaved){
                    this.addServiceToCart();
                }
            }
        }
    };
</script>