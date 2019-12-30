<template src="./supportComponent.template.html"></template>
<script>
    import Vue from "vue";
    import VeeValidate from "vee-validate";
    Vue.use(VeeValidate);

    export default {
        name: "support",
        props: [],
        data() {
            return {
                feedback: {
                    Message: null,
                    Name: null,
                    Email: null,
                    MobileNumber: null
                }
            };
        },

        methods: {
            submitForm: function () {
                let vm = this;
                vm.$validator.validateAll().then(result => {
                    if (result) {
                        vm.$store.dispatch("dataRequestHandler", {
                            key: "SubmitFeedback",
                            params: vm.feedback,
                            callback: function (error, response) {
                                if (error) {
                                    vm.$store.dispatch("toastr", {
                                        type: "error",
                                        header: "Error!",
                                        message: "There is server error"
                                    });
                                    return;
                                }

                                if (response && response.Id) {
                                    vm.$store.dispatch("toastr", {
                                        type: "success",
                                        header: "Success!",
                                        message: "Your feedback submitted sucessfully"
                                    });
                                    vm.resetForm();
                                }
                            }

                        });
                    }
                });
            },
            changePassword: function () {
                let self = this;
                self.$store.dispatch("dataRequestHandler", {
                    key: "UpdatePassword",
                    params: {
                        UserId: self.$route.params.userId,
                        OldPassword: self.currentpassword,
                        NewPassword: self.newpassword,
                        ModuleAction: "UpdatePassword"

                    },
                    callback: function (err, response) {
                        console.log("userupdate password", response);
                        if (err) {
                            return;
                        }
                        else if (response) {
                            self.$store.dispatch("toastr",
                                {
                                    type: "success",
                                    message: "Password changed successfully",
                                    header: "Success"
                                });
                        }
                    }
                });
            },
            cancel() {
                this.$router.push("/users")
            },
            resetForm() {
                this.feedback = {
                    Message: null,
                    Name: null,
                    Email: null,
                    MobileNumber: null
                }
            },
            fillUserDetails(){
                this.feedback.Name = this.loggedInUser.UserFirstName + " " + this.loggedInUser.UserLastName;
                this.feedback.Email = this.loggedInUser.Email;
                this.feedback.MobileNumber = this.loggedInUser.MobileNumber;
            }
        },
        computed: {
            loggedInUser(){
                return this.$store.state.loggedInUserDetail;
            }
        },
        mounted() {
            this.fillUserDetails();
        },
        beforeDestroy() {

        },
        watch: {
            loggedInUser(){
                this.fillUserDetails();
            }
        }
    };
</script>