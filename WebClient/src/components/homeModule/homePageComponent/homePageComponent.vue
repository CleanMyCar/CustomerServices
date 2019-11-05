<template>
    <div></div>
</template>

<script>
    export default {
        name: "homePage",
        props: [],
        data() {
            return {
                entityNamesdata: {},

            };
        },

        methods: {
            landingpage() {
                let vm = this;
                if (vm.entityNamesdata.length > 1) {
                    let reservationEntity = vm.entityNamesdata.filter(x => x.EntityName == "Reservations");
                    let houseKeeperEntity = vm.entityNamesdata.filter(x => x.EntityName == "Housekeeper");
                    let houseKeeperInchargeEntity = vm.entityNamesdata.filter(x => x.EntityName == "Housekeeping Inspector");


                    // || x.EntityName == "HouseKeeper"

                    if (reservationEntity[0] && reservationEntity[0].EntityName) {
                        vm.$router.push("/ReservationList");
                        vm.$store.state.bus.$emit('setParentAndSubmenuListCalendarIcons', 'Reservations');
                    }
                    else if (reservationEntity[0] && reservationEntity[0].EntityName && houseKeeperEntity[0] && houseKeeperEntity[0].EntityName) {
                        vm.$router.push("/houseKeepingStatus");
                        vm.$store.state.bus.$emit('setParentAndSubmenuListCalendarIcons', 'HouseKeepingStatus');


                    }
                    else if (houseKeeperEntity[0] && houseKeeperEntity[0].EntityName) {
                        vm.$router.push("/houseKeepingStatus");
                        vm.$store.state.bus.$emit('setParentAndSubmenuListCalendarIcons', 'HouseKeepingStatus');
                    }
                    else if (houseKeeperInchargeEntity[0] && houseKeeperInchargeEntity[0].EntityName) {
                        vm.$router.push("/houseKeepingStatus");
                        vm.$store.state.bus.$emit('setParentAndSubmenuListCalendarIcons', 'HouseKeepingStatus');
                    }


                    else {
                        vm.$router.push("/ReservationList");
                        vm.$store.state.bus.$emit('setParentAndSubmenuListCalendarIcons', 'Reservations');
                    }
                }
            }

 

        },

        computed: {

        },

        mounted() {
            let vm = this;
            // vm.landingPage();
            vm.$store.state.bus.$on('entityNames', function (payload) {
                console.log("entityNames", payload);
                vm.entityNamesdata = payload;
                vm.landingpage();


                // if (payload.length > 1) {
                //     let reservationEntity = payload.filter(x => x.EntityName == "Reservations");
                //     let houseKeeperEntity = payload.filter(x =>  x.EntityName == "HouseKeeper");
                //     // || x.EntityName == "HouseKeeper"
                //     if(reservationEntity[0] && reservationEntity[0].EntityName && houseKeeperEntity[0] && houseKeeperEntity[0].EntityName){
                //         vm.$router.push("/houseKeepingStatus");
                //     }
                //     else if(houseKeeperEntity[0] && houseKeeperEntity[0].EntityName){
                //         vm.$router.push("/houseKeepingStatus");
                //     }
                //     else{
                //         vm.$router.push("/ReservationList");
                //     }
                // }

            });
            // vm.$store.state.bus.$emit('setParentAndSubmenuListCalendarIcons', vm.parentModuleName);
            // console.log("vm.parentModuleName",vm.parentModuleName);

        },


    };
</script>