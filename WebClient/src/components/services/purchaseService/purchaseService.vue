<template src="./purchaseService.template.html"></template>

<script>
    import Vue from "vue";
    import moment from "moment"
    import VeeValidate from "vee-validate";
    Vue.use(VeeValidate);

    export default {
        name: "purchaseService",
        props: [],
        data() {
            return {
                serviceDetail: null,
                myServiceProducts: [],
                serviceType: null,
                vehicleInfo: {
                    IsPersonal: true,
                    VehicleId: null,
                    Frequency: null,
                    TimeSlot: null,
                    AddressId: null,
                    Quantity: 1,
                    ServiceDate: moment.utc().add(1, 'days'),
                    WeeklyDay: null
                },
                newVehicleDetails: null,
                fourWheelerTypes: [],
                vehicleTypes: [],
                newVehicleImage: null,
                subscriptionTypes: [],
                vehicleAddress: null,
                searchAddressText: null,
                defaultCarImage: "../../../src/content/images/car.png",
                defaultBikeImage: "../../../src/content/images/bike.png",
                addressList: [],
                showAddressList: false,
                selectedVehicle: null,
                openedVehicleAddPopup: false,
                serviceSaved: false,
                userAddressList: [],
                isAddressPopup: false,
                selectedPersonAddress: null,
                isDialogOpen: false,
                popupMessage: null,
                headerTitle: null,
                minDate: moment.utc(),
                subscriptionMinDate: moment.utc().add(1, 'days'),
                rechargeVisible: false,
                timeslots: [],
                route: null
            };
        },

        methods: {
            getMyProducts() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetMyServiceProducts",
                    params: {
                        serviceId: vm.$route.params.serviceId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.myServiceProducts.splice(0, vm.myServiceProducts.length, ...response);

                        if (vm.myServiceProducts && vm.myServiceProducts.length == 1) {
                            vm.chooseVehicle(vm.myServiceProducts[0])
                        }
                    }
                });
            },
            fetchData: function () {
                // console.log(this.$route.params.serviceId);
                // console.log(this.$route.params.serviceType);
                let vm = this;
                vm.serviceType = vm.$route.params.serviceType; //1 - subscribe, 2 - Purchase Once                
                vm.getMyProducts();
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetServiceDetail",
                    params: {
                        serviceId: vm.$route.params.serviceId
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }

                        vm.serviceDetail = response.serviceDetail;
                        vm.vehicleTypes = response.vehicleTypes;
                        vm.fourWheelerTypes = response.fourWheelerTypes;
                        vm.subscriptionTypes = response.subscribeTypes

                        if (response.timeslots) {
                            let sysTime = moment().add(1, 'days').format("YYYY-MM-DD HH:mm");
                            for (let timeObj of response.timeslots) {
                                let endTime = moment.utc(timeObj.EndTime).format("HH:mm");
                                let endDateTime = moment().add(1, 'days').add(endTime.substring(0, 2), 'hours')
                                // let endTime = moment.utc(endDateTime).format("YYYY-MM-DD HH:mm");
                                // console.log(moment(endDateTime, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm"))
                                // console.log(moment(sysTime, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm"))
                                if (moment(endDateTime, "YYYY-MM-DD HH:mm").diff(moment(sysTime, "YYYY-MM-DD HH:mm"), 'hours') >= 2) {
                                    timeObj.available = true;
                                }
                                else {
                                    timeObj.available = false;
                                }
                            }
                        }

                        vm.timeslots = response.timeslots
                        if (vm.serviceDetail.VehicleCategoryType == "3") {
                            vm.$store.dispatch("dataRequestHandler", {
                                key: 'GetUserAddressIds',
                                params: {},
                                callback: function (err, response) {
                                    if (response.length > 0) {
                                        vm.userAddressList.splice(0, vm.userAddressList.length, ...response);
                                        let defaultAddress = response.filter((addr) => {
                                            return addr.IsDefault;
                                        })
                                        vm.selectedPersonAddress = defaultAddress[0]
                                    }
                                }
                            });
                        }

                    }
                });


            },
            changeSelection(flag, event) {
                this.vehicleInfo.IsPersonal = flag;
                // $(".personalVehicle").not(event.currentTarget).prop('checked', false);
                this.selectedVehicle = null;
                this.vehicleInfo.VehicleId = null
            },
            addNewVehicleInfo() {
                //this.newVehicleDetails = {
                //    AddressId: null,
                //    VehicleNumber: null,
                //    VehicleMake: null,
                //    VehicleModel: null,
                //    ParkingLot: null,
                //    VehicleTypeId: "1",
                //    FourWheelerTypeId: null
                //}
                //$("#newVehicleDetailsPopup").modal("show");
                this.openedVehicleAddPopup = true;
                this.vehicleAddress = {
                    VehicleId: -1
                }
            },
            changeVehicleType(vehicleType, event) {

            },
            addNewVehicle() {
                let vm = this;
                vm.$validator.validateAll().then(result => {
                    if (result) {
                        vm.$store.dispatch("dataRequestHandler", {
                            key: "SaveVehicleDetails",
                            params: Object.assign(vm.newVehicleDetails, { IsPersonal: vm.vehicleInfo.IsPersonal }),
                            callback: function (err, response) {
                                if (err) {
                                    return;
                                }
                                vm.getMyProducts();
                                $("#newVehicleDetailsPopup").modal("hide");
                            }
                        });
                    }
                });

            },
            cancel() {
                $("#newVehicleDetailsPopup").modal("hide");
            },
            chooseVehicle(product, event) {
                let vm = this;
                if ((event && event.currentTarget.checked) || (product.VehicleId && product.VehicleId > -1)) {
                    vm.vehicleInfo.VehicleId = product.VehicleId;
                    vm.selectedVehicle = product;
                    vm.$store.dispatch("dataRequestHandler", {
                        key: "GetVechicleAddress",
                        params: { VehicleId: product.VehicleId },
                        callback: function (err, response) {
                            if (err) {
                                return;
                            }
                            vm.vehicleAddress = response;
                        }
                    });
                }
                else {
                    this.vehicleInfo.VehicleId = null;
                    vm.vehicleAddress = null,
                        vm.selectedVehicle = null
                }
            },
            confirmServiceOrder(statusId) {
                let vm = this;
                vm.$validator.validateAll().then(result => {
                    if (result) {
                        vm.$store.dispatch("dataRequestHandler", {
                            key: "RequestVehicleService",
                            params: {
                                VehicleId: vm.vehicleInfo.VehicleId,
                                ServiceType: vm.serviceType,
                                ServiceId: vm.$route.params.serviceId,
                                Frequency: vm.vehicleInfo.Frequency,
                                Promocode: vm.vehicleInfo.Promocode,
                                ServiceDate: vm.vehicleInfo.ServiceDate,
                                TimeSlot: vm.vehicleInfo.TimeSlot,
                                WeeklyDay: vm.vehicleInfo.WeeklyDay,
                                Quantity: vm.vehicleInfo.Quantity,
                                StatusId: statusId,
                                OtherAddressId: vm.selectedPersonAddress && vm.selectedPersonAddress.AddressId
                            },
                            callback: function (err, response) {
                                if (err) {
                                    return;
                                }
                                if (response.RequestId) {
                                    if (statusId == 0) {
                                        vm.vehicleInfo.RequestId = response.RequestId
                                        vm.serviceSaved = true;
                                        return;
                                    }
                                    if (vm.serviceType == 2) {
                                        vm.$router.push("/myOrders");
                                    }
                                    if (vm.serviceType == 1) {
                                        vm.$router.push("/mysubscriptions");
                                    }
                                }
                                else if (response.ErrorMessage) {
                                    $("#insufftoastrMessagePopup").modal("show")
                                    vm.headerTitle = "Alert !!";
                                    vm.popupMessage = response.ErrorMessage;
                                    vm.isDialogOpen = !vm.isDialogOpen;

                                    if (response.ErrorCode == -99) {
                                        vm.rechargeVisible = true;
                                    }
                                    else {
                                        vm.rechargeVisible = false;
                                    }
                                }
                            }
                        });
                    }
                });
            },
            navigateToBack() {
                this.$router.push("/");
            },
            updateServiceDate(key, dateObj, objectPassedToParent) {
                let selectedDateObj = dateObj.format("DD MMM YYYY HH:mm")
                if (!selectedDateObj) {
                    return;
                }
                this.vehicleInfo.ServiceDate = dateObj ? dateObj.format("DD MMM YYYY") : null;

                console.log(moment.utc(selectedDateObj).diff(moment.utc(), 'hours'))
                if(moment.utc(selectedDateObj).diff(moment.utc(), 'hours') < 0){                
                    selectedDateObj = moment.utc(selectedDateObj).add(new Date().getHours(), 'hours').add(new Date().getMinutes(), 'minutes')
                }
                let sysTime = moment(selectedDateObj).format("YYYY-MM-DD HH:mm");

                for (let timeObj of this.timeslots) {
                    let endTime = moment.utc(timeObj.EndTime).format("HH:mm");
                    let endDateTime = moment.utc(dateObj).add(endTime.substring(0, 2), 'hours')
                    // let endTime = moment.utc(endDateTime).format("YYYY-MM-DD HH:mm");
                    // console.log(moment(endDateTime, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm"))
                    // console.log(moment(sysTime, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm"))
                    if (moment(endDateTime, "YYYY-MM-DD HH:mm").diff(moment(sysTime, "YYYY-MM-DD HH:mm"), 'hours') >= 2) {
                        timeObj.available = true;
                    }
                    else {
                        timeObj.available = false;
                    }
                }
            },
            getAddressBySearchText(text) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetAddressBySearch",
                    params: {
                        searchText: text
                    },
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        vm.addressList.splice(0, vm.addressList.length, ...response);
                        vm.showAddressList = true;
                    }
                });
            },
            selectAddress(addressObj) {
                this.newVehicleDetails.AddressId = addressObj.AddressId;
                this.searchAddressText = addressObj.AddressLine1 + " " + addressObj.AddressLine2 + ", " + addressObj.Landmark + " " + addressObj.CityName + ", " + addressObj.StateName
                this.showAddressList = false;
            },
            filesChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                let vm = this;
                let reader = new FileReader();
                reader.onload = e => {
                    vm.newVehicleDetails.VehicleImage = e.target.result;
                }
                reader.readAsDataURL(files[0]);
            },
            editVehicleAddress() {
                this.openedVehicleAddPopup = true;
            },
            closeVehicleAddPopup() {
                this.openedVehicleAddPopup = false;
            },
            updateVehicleAddress(selectedVehicle) {
                this.chooseVehicle(selectedVehicle)
                this.openedVehicleAddPopup = false;
                this.getMyProducts();
            },
            updateQuantity(value) {
                this.vehicleInfo.Quantity = value;
            },
            choosePersonAddress() {
                this.isAddressPopup = true;
            },
            updateSelectedAddress(address) {
                this.selectedPersonAddress = address;
                this.isAddressPopup = false;
            },
            closeSelectAddressPopup() {
                this.isAddressPopup = false;
            },
            navigateToMyProfile() {
                this.$router.push("/userprofile")
            },
            closeToastrPopup() {
                this.isDialogOpen = !this.isDialogOpen;
                $("#insufftoastrMessagePopup").modal("hide")
            },
            selectSubscribeType(product) {
                this.vehicleInfo.Frequency = product.SubscribeId;
                if (product.SubscribeId != 2) {
                    this.vehicleInfo.WeeklyDay = null;
                }
            },
            selectWeeklyday(day) {
                this.vehicleInfo.WeeklyDay = day;
            },
            navigateToRecharge() {
                $("#insufftoastrMessagePopup").modal("hide")
                this.$router.push("/recharge/-1")
            },
            getFormatedTime(time) {
                return moment.utc(time).format("HH:mm")
            },
            selectTimeSlot(timeslotObj) {
                this.vehicleInfo.TimeSlot = timeslotObj.TimeSlotId
            }
        },
        computed: {
            servicePrice() {
                let vm = this;
                if (this.selectedVehicle) {
                    if (vm.selectedVehicle.FourWheelerTypeId && this.selectedVehicle.VehicleTypeId == 2) {
                        let vehiclePriceInfo = this.fourWheelerTypes.filter((vehicle) => {
                            return vehicle.Id == vm.selectedVehicle.FourWheelerTypeId;
                        })
                        if (vehiclePriceInfo && vehiclePriceInfo.length > 0) {
                            return vm.serviceType == 2 ? vehiclePriceInfo[0].Price : vehiclePriceInfo[0].SubscriptionPrice;
                        }
                    }
                    else {
                        return vm.serviceType == 2 ? vm.serviceDetail.Price : vm.serviceDetail.SubscriptionPrice;
                    }
                }
                else if (this.serviceDetail.VehicleCategoryType == 3 && this.vehicleInfo.Quantity) {

                    return (vm.serviceType == 2 ? this.serviceDetail.Price : vm.serviceDetail.SubscriptionPrice) * this.vehicleInfo.Quantity
                }
                return 0;
            },
            discountPrice() {
                if (Number(this.vehicleInfo.TimeSlot) >= 5 && this.serviceDetail.Discount && this.serviceType == 1)
                    return this.servicePrice - ((this.servicePrice / 100) * this.serviceDetail.Discount)

                return null
            }
        },

        mounted() {
            let vm = this;
            console.log("mounted")
            vm.fetchData();
            this.route = this.$route.name;
        },
        watch: {
            $route: "fetchData",
            searchAddressText(value) {
                if (value && value.trim().length > 2 && value.trim().length < 10) {
                    this.getAddressBySearchText(value);
                }
                else {
                    this.addressList.splice(0, this.addressList.length)
                }
            }
        }
    };
</script>
<style>
    .vechiles {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* IMAGE STYLES */
    .vechiles+img {
        cursor: pointer;
    }

    /* CHECKED STYLES */
    .vechiles:checked+img {
        outline: 2px solid blue;
    }
</style>