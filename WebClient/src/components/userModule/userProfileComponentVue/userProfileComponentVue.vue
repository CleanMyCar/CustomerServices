<template src="./userProfileComponentVue.template.html"></template>
<style>
    fieldset {
        display: block;
        margin-left: 2px;
        margin-right: 2px;
        padding-top: 0.35em;
        padding-bottom: 0.625em;
        padding-left: 0.75em;
        padding-right: 0.75em;
        border: 2px groove;
    }

    legend {
        width: auto !important;
        padding: 5px !important;
    }

    .form-label label {
        color: #484747 !important;
    }

    .labels {
        font-weight: bold;
    }

    .notes {
        color: #7b8288 !important;
    }
</style>
<script>
    import Vue from 'vue'
    import VueAvatar from './vueAvatar/VueAvatar.vue'
    import VueAvatarScale from './vueAvatar/VueAvatarScale.vue'

    export default {
        data() {
            return {
                userProfile: null,
                editMode: false,
                userAddressList: [],
                isOpen: false,
                selectedAddress: null,
                isDialogOpen: false,
                popupMessage: null,
                headerTitle: null
            }
        },
        props: [],
        methods: {
            saveUserProfile: function () {
                var vm = this;
                var img = this.$refs.vueavatar.getImageScaled()
                this.$store.dispatch("dataRequestHandler", {
                    key: "SaveUserProfile",
                    params: vm.userProfile,
                    callback: function (err, response) {
                        //console.log(response);
                        if (response.ErrorMessage) {
                            vm.headerTitle = "Validations"
                            vm.popupMessage = response.ErrorMessage;
                            vm.isDialogOpen = true;
                            return;
                        }
                        vm.changeToEditMode();
                    }
                });
            },
            getUserProfile: function () {
                var vm = this;
                this.$store.dispatch("dataRequestHandler", {
                    key: 'GetUserProfile', params: {}, callback: function (err, response) {
                        vm.userProfile = response.userDetails;
                        if (vm.userProfile.ProfileImage) {
                            setTimeout(function () {
                                vm.$refs.vueavatar.loadImage(vm.userProfile.ProfileImage)
                            }, 500);
                        }
                        else {
                            setTimeout(function () {
                                vm.$refs.vueavatar.loadImage("https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png")
                            }, 500);
                        }
                        vm.getUserAddress();
                    }
                });
            },
            onChangeScale(scale) {
                this.$refs.vueavatar.changeScale(scale)
            },
            saveClicked() {
                var img = this.$refs.vueavatar.getImageScaled()
                // use img 
            },
            onImageReady(scale) {
                this.$refs.vueavatarscale.setScale(scale)
            },
            changeToEditMode() {
                this.editMode = !this.editMode;
            },
            addAddress() {
                this.selectedAddress = {
                    AddressId: -1
                }
                this.isOpen = !this.isOpen
            },
            addressCallback() {
                this.getUserAddress();
                this.isOpen = !this.isOpen
            },
            closeAddressPopup() {
                this.isOpen = !this.isOpen
            },
            getUserAddress() {
                var vm = this;
                this.$store.dispatch("dataRequestHandler", {
                    key: 'GetUserAddressIds',
                    params: {},
                    callback: function (err, response) {
                        vm.userAddressList.splice(0, vm.userAddressList.length, ...response);
                    }
                });
            },
            closeToastrPopup(){
                this.isDialogOpen = false
            }
        },
        computed: {
        },
        components: {
            VueAvatar,
            VueAvatarScale
        },
        mounted() {
            this.getUserProfile();
        }
    }

</script>