<template src="./assignPersonComponent.template.html"></template>

<script>
    export default {
        name: "assignPersonComponent",
        props: ["service", "updateServicePerson"],
        data() {
            return {
                assignPersonObj: null,
                searchNameText: null,
                showServicePersonList: false,
                servicePersonList: []
            };
        },

        methods: {
            assignService() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "AssignPersonToService",
                    params: {
                        RequestId: vm.service.RequestId,
                        UserId: vm.assignPersonObj.UserId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        // vm.servicePersonList.splice(0, vm.servicePersonList.length, ...response);
                        vm.updateServicePerson(vm.service, vm.assignPersonObj);
                    }
                });
            },
            selectServicePerson(person) {
                let vm = this;
                console.log(person);
                vm.searchNameText = person.UserLastName + " " + person.UserFirstName + ", " + person.AddressLine1 + " " + person.AddressLine2 + ", " + person.Landmark + " " + person.CityName + ", " + person.StateName;
                vm.showServicePersonList = false;
                vm.assignPersonObj = person;
            },
            getServicePersonList() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServicePersonList",
                    params: {
                        searchNameText: vm.searchNameText
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.servicePersonList.splice(0, vm.servicePersonList.length, ...response);
                        vm.showServicePersonList = true;
                    }
                });
            },
            getUserDetail() {
                let vm = this;
                if (!vm.service.ServicePersonId)
                    return;

                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetUserPrimaryAddress",
                    params: {
                        UserId: vm.service.ServicePersonId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.selectServicePerson(response);
                        // vm.showServicePersonList = true;
                    }
                });
            }
        },
        computed: {
        },

        mounted() {
            let vm = this;
            vm.getUserDetail();
        },
        watch: {
            $route: "getServices",
            searchNameText(searchText) {
                if (searchText && searchText.trim() && searchText.trim().length > 2 && searchText.trim().length < 10) {
                    this.getServicePersonList()
                }
            },
            service() {
                this.getUserDetail();
            }
        }

    };
</script>