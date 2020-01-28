<template src="./userCartPanel.template.html"></template>

<script>
    export default {
        name: "userCartPanel",
        props: ["updateParent", "panelCallback"],
        data() {
            return {
                cartItems: [],
                selectedIndex: null,
                isDialogOpen: false,
                popupMessage: null,
                headerTitle: null
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
            getUserCartItems() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetUserCartItems",
                    params: {},
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.cartItems.splice(0, vm.cartItems.length, ...response);
                    }
                });
            },
            deleteConfirmationPopup(index) {
                this.selectedIndex = index;
            },
            deleteCurrentItem(selectedIndex) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "DeleteCartItem",
                    params: {
                        CartItemId: vm.cartItems[selectedIndex].Id
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.cartItems.splice(vm.selectedIndex, 1);
                        vm.$store.state.bus.$emit("refreshCart");
                    }
                });
            },
            callbackFromConfirmation(flag) {
                if (flag) {
                    this.deleteCurrentItem();
                }
                else {
                    this.selectedIndex = -1
                }
            },
            callbackFromQuantity(updatedValue, cartItem) {
                cartItem.Quantity = updatedValue
            },
            checkoutUserCartItems() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "CheckoutUserCartItems",
                    params: {
                        cartItems: vm.cartItems
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        if (response.ErrorMessage) {                                                        
                            vm.headerTitle = "Alert !!";
                            vm.popupMessage = response.ErrorMessage;
                            vm.isDialogOpen = !vm.isDialogOpen;
                            setTimeout(function(){
                                $(".modal-backdrop").css("z-index", "")
                            }, 100)
                            
                            return
                        }
                        vm.cartItems.splice(0, vm.cartItems.length);
                        vm.$store.state.bus.$emit("refreshCart");
                    }
                });
            },
            itemPrice(cartItem) {
                return cartItem.ServiceType == 2 ?
                    (cartItem.VehicleCategoryType == 2 ? cartItem.SubscribeItemPrice * cartItem.Quantity : cartItem.Price * cartItem.Quantity) :
                    (cartItem.VehicleCategoryType == 2 ? cartItem.SubscribeSubscriptionPrice * cartItem.Quantity : cartItem.SubscriptionPrice * cartItem.Quantity)
            },
            closeToastrPopup() {
                this.isDialogOpen = !this.isDialogOpen;
            },
        },
        computed: {
            cartTotalValue() {
                let totalValue = 0
                this.cartItems.forEach((cartItem) => {
                    totalValue += cartItem.ServiceType == 2 ?
                        (cartItem.VehicleCategoryType == 2 ? cartItem.SubscribeItemPrice * cartItem.Quantity : cartItem.Price * cartItem.Quantity) :
                        (cartItem.VehicleCategoryType == 2 ? cartItem.SubscribeSubscriptionPrice * cartItem.Quantity : cartItem.SubscriptionPrice * cartItem.Quantity);
                })
                return totalValue;
            }
        },
        mounted() {
            let vm = this;
            vm.getUserCartItems();
            vm.$store.state.bus.$on('refreshCart', function (params) {
                vm.getUserCartItems();
            })
        },
        watch: {

        }
    };
</script>