<template src="./homePageComponent.template.html"></template>

<script>
    export default {
        name: "homePage",
        props: [],
        data() {
            return {
                entityNamesdata: {},
                servieList: [],
                serviceObj: null
            };
        },

        methods: {
            getServices() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServiceList",
                    params: {
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            vm.servieList.splice(0, vm.servieList.length, ...response);
                        }
                    }
                });
            },
            showMoreInfo(serviceObj) {
                this.serviceObj = serviceObj;
                $("#primaryEmailPopup").modal("show");
            },
            chooseOption(serviceObj, optionType) {
                this.$router.push("/purchaseService/" + serviceObj.ServiceId + "/" + optionType);
            }
        },
        computed: {

        },

        mounted() {
            let vm = this;
            vm.getServices();

        },


    };
</script>