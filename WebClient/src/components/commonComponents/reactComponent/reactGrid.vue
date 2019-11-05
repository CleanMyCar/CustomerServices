<template src="./reactGrid.template.html"></template>
<script type="text/javascript">
    import moment from "moment-timezone"
    import reactGrid from "./reactGridAndList_Reservations.js"
    import unassignResGrid from "./unassignedResInChart.js"
    export default {
        name: "reactGridComponent",
        props: [],
        data() {
            return {
                entitlements: {},
                reactGridInstance: null,
                filterSearchPropertyText: null,
                propertyList: [],
                selectedFilterColumn: null,
                filterObj: {
                    Properties: [],
                    startDate: null,
                    endDate: null,
                    propertyId: "-99",
                    unitTypeId: "-99"
                },
                unitTypeList: [],
                currResObj: {},
                showResGrid: "#",
                isModalVisible: false,
                reactUnassignedGridInstance: null,
                popupResObj: null,
                isLoading: true,
                isPartialLoading: false,
                clouseOutGrid: false,
                rateGrid: false,
                restrictionsGrid: false
            };
        },
        methods: {
            
    GetUserEntitlementsAndDefaultProperty() {
      let vm = this;
      vm.$store.dispatch("dataRequestHandler", {
        key: "GetUserEntitlementsAndDefaultProperty",
        params: {
          ModuleAction: "GetUserEntitlementsAndDefaultProperty"
        },
        callback: function(err, response) {
          if (err) {
            return;
          }
          if (response) {
            console.log(
              "response in GetUserEntitlementsAndDefaultProperty",
              response
            );
            // vm.UserProperties = response.properties;
            vm.entitlements = response.userEntitlementList;
            
          }
        }
      });
    },
            navigateToReservation(resObj) {
                console.log(resObj);
                //this.$router.push("/newReservation/" + resObj.ReservationId);                                
                this.currResObj = resObj;
                this.$set(this.currResObj, "update", !this.currResObj.update);
            },
            showFilterByType(filterCol) {
                let vm = this;
                setTimeout(function () {
                    vm.selectedFilterColumn = filterCol;
                    if (filterCol == "property") {
                        if (vm.filterObj.Properties.length == 0) {
                            vm.getPropertiesBySearchText();
                        }
                        $("#propertyDropDown").show();
                    }
                });
            },
            getPropertiesBySearchText(searchText) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler",
                    {
                        key: "GetPropertiesBySearchText",
                        params: {
                            searchText: searchText
                        },
                        callback: function (err, response) {
                            if (err) {
                                return;
                            }
                            if (response) {
                                vm.propertyList.splice(0, vm.propertyList.length, ...response.propertyList);
                                //vm.filterObj.propertyId = vm.propertyList[0]["PropertyId"];
                                //vm.getTapeChartData();
                            }
                        }
                    });
            },
            getUnitTypesListBySearchText(searchText) {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler",
                    {
                        key: "GetUnitTypesListBySearchText",
                        params: {
                            searchText: searchText,
                            PropertyId: vm.filterObj.propertyId == -99 ? "" : vm.filterObj.propertyId
                        },
                        callback: function (err, response) {
                            if (err) {
                                return;
                            }
                            if (response) {
                                console.log("response", response);
                                vm.unitTypeList.splice(0, vm.unitTypeList.length, ...response.unitTypeList);
                                vm.filterObj.unitTypeId = "-99";
                            }
                        }
                    });
            },
            addPropertyToFilter(propertyObj) {
                let vm = this;
                vm.filterObj.Properties.push(propertyObj);
                vm.filterSearchPropertyText = null;
                var index = vm.propertyList.indexOf(propertyObj);

                if (index > -1) {
                    vm.propertyList.splice(index, 1);
                }
                vm.selectedFilterColumn = null;
            },
            removePropertyFromFilter(propertyObj) {
                let vm = this;
                var index = vm.filterObj.Properties.indexOf(propertyObj);
                if (index > -1) {
                    vm.filterObj.Properties.splice(index, 1);
                }
                vm.propertyList.push(propertyObj);
            },
            applyFilter() {
                let vm = this;
                vm.getTapeChartData();
            },
            getTapeChartData() {
                let vm = this;
                // if (vm.filterObj.propertyId == null || vm.filterObj.propertyId == "-99") {
                //     vm.$store.dispatch("toastr", {
                //         type: "warning",
                //         header: "Tapechart",
                //         message: "Please select property"
                //     });
                //     return;
                // }

                vm.isLoading = true;
                let startDate = vm.filterObj.startDate ? moment(vm.filterObj.startDate).format("YYYY-MM-DD") : moment().add(-7, 'days').format("YYYY-MM-DD"),
                    endDate = vm.filterObj.endDate ? moment(vm.filterObj.endDate).format("YYYY-MM-DD") : moment(startDate).add(90, 'days').format("YYYY-MM-DD");

                if (!vm.filterObj.startDate)
                    vm.filterObj.startDate = startDate;
                if (!vm.filterObj.endDate)
                    vm.filterObj.endDate = endDate;

                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetTapeChartData_New",
                    params: {
                        startDate: startDate,
                        endDate: endDate,
                        propertyId: vm.filterObj.propertyId,
                        unitId: null,
                        unitTypeId: vm.filterObj.unitTypeId
                    },
                    callback: function (err, response) {

                        vm.isLoading = false;

                        if (err) {
                            console.log("err in GetCalendarViewData", err);
                            return
                        }
                        if (response) {
                            if (response.errorMessage) {
                                vm.$store.dispatch("toastr", {
                                    type: "error",
                                    header: "CalendarView",
                                    message: response.errorMessage
                                });
                                return;
                            }
                            vm.$store.dispatch("toastr", {
                                type: "success",
                                header: "CalendarView",
                                message: "CalendarView data retreived successfully"
                            });
                            vm.reactGridInstance.init({
                                _data: response.reservations,
                                _dateHeaders: response.dates,
                                _ratesCount: response.ratesCount,
                                _units: response.units,
                                _properties: response.properties,
                                _clientWeekends: response.clientWeekends,
                                _events: {
                                    navigateToReservation: vm.navigateToReservation,
                                    showUnAssignReservations: vm.showUnAssignReservations,
                                    showLoading: vm.showLoading
                                },
                                _filterObj: vm.filterObj
                            });
                        }

                    }
                })
            },
            updateFilterStartDate(key, dateObj, objectPassedToParent) {
                objectPassedToParent.startDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
            },
            updateFilterEndDate(key, dateObj, objectPassedToParent) {
                objectPassedToParent.endDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
            },
            onChangeReservationStatus(resStatusId) {

            },
            panelCallback() {
                this.getTapeChartData();
                if (this.popupResObj) {
                    this.showUnAssignReservations(this.popupResObj);
                }
            },
            toggleResRateGrid() {
                this.showResGrid = this.showResGrid == "#" ? "$" : "#";
                this.reactGridInstance.update({ showResGrid: this.showResGrid == "#" ? true : false });
            },
            showUnAssignReservations(currResObj) {
                console.log(currResObj);
                let vm = this;
                vm.popupResObj = currResObj;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetTapeChartUnassignedReservations",
                    params: {
                        startDate: currResObj.StartDate ? moment(currResObj.StartDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
                        endDate: currResObj.EndDate ? moment(currResObj.EndDate).add(-1, 'days').format("YYYY-MM-DD") : moment().add(90, 'days').format("YYYY-MM-DD"),
                        propertyId: currResObj.PropertyId,
                        unitId: currResObj.UnitId,
                        unitTypeId: currResObj.UnitTypeId
                    },
                    callback: function (err, response) {
                        if (err) {
                            console.log("err in GetCalendarViewData", err);
                            return
                        }
                        if (response) {
                            if (response.errorMessage) {
                                vm.$store.dispatch("toastr", {
                                    type: "error",
                                    header: "CalendarView",
                                    message: response.errorMessage
                                });
                                return;
                            }

                            vm.reactUnassignedGridInstance.init({
                                _data: response.reservations,
                                _dateHeaders: response.dates,
                                _ratesCount: response.ratesCount,
                                _units: response.units,
                                _properties: response.properties,
                                _events: {
                                    navigateToReservation: vm.navigateToReservation,
                                    showUnAssignReservations: vm.showUnAssignReservations
                                }
                            });

                            vm.isModalVisible = true;
                        }

                    }
                })
            },
            close() {
                this.isModalVisible = false;
                this.popupResObj = null
            },
            yesButtonCallback() {

            },
            noCallback() {

            },
            dynamicSort(property) {
                var sortOrder = 1;
                if (property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a, b) {
                    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                    return result * sortOrder;
                }
            },
            showLoading() {
                this.isPartialLoading = !this.isPartialLoading;
            },
            showClouseOutBtn() {
                this.clouseOutGrid = true;
                this.rateGrid = false;
                this.restrictionsGrid = false;
            },
            showRateBtn() {
                this.clouseOutGrid = false;
                this.rateGrid = true;
                this.restrictionsGrid = false;
            },
            showrestrictionsBtn() {
                this.clouseOutGrid = false;
                this.rateGrid = false;
                this.restrictionsGrid = true;
            },
            hidesummaryPanel() {
                this.clouseOutGrid = false;
                this.rateGrid = false;
                this.restrictionsGrid = false;
                // this.getTapeChartData();
                // this.$store.state.bus.$emit('reset');

            }
        },
        computed: {
            fncIsEditInvPanel() {
                let vm = this;
                if (
                    vm.$store.state.userEntitlementList.hasOwnProperty(
                        "fncEditInvPanel"
                    )
                ) {
                    return vm.$store.state.userEntitlementList.hasOwnProperty(
                        "fncEditInvPanel"
                    )
                        ? vm.$store.state.userEntitlementList.fncEditInvPanel
                        : null;
                }
            },
        },
        mounted() {
            this.$store.dispatch("GetUserEntitlementsAndDefaultProperty");
            this.GetUserEntitlementsAndDefaultProperty();
            this.reactGridInstance = new reactGrid(this.$refs.reactGridElem);
            this.reactUnassignedGridInstance = new unassignResGrid(this.$refs.unAssigneResList);
            this.getPropertiesBySearchText();
            this.getUnitTypesListBySearchText();
            this.getTapeChartData();
        },
        watch: {
            filterSearchPropertyText(searchText) {
                if (searchText)
                    this.getPropertiesBySearchText(searchText);
            },

            'filterObj.propertyId'(value) {
                this.getUnitTypesListBySearchText();
            }

        },
        destroyed() {
            this.reactGridInstance.destroy();
            this.reactGridInstance = null;

            this.reactUnassignedGridInstance.destroy();
            this.reactUnassignedGridInstance = null;
        }
    };

</script>


<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        background: #FFFFFF;
        box-shadow: 2px 2px 20px 1px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
    }

    .modal-header,
    .modal-footer {
        padding: 15px;
        display: flex;
    }

    .modal-header {
        border-bottom: 1px solid #eeeeee;
        color: #4AAE9B;
        justify-content: space-between;
    }

    .modal-footer {
        border-top: 1px solid #eeeeee;
        justify-content: flex-end;
    }

    .modal-body {
        position: relative;
        padding: 20px 10px;
    }

    .btn-close {
        border: none;
        font-size: 20px;
        padding: 20px;
        cursor: pointer;
        font-weight: bold;
        color: #4AAE9B;
        background: transparent;
    }

    .btn-green {
        color: white;
        background: #4AAE9B;
        border: 1px solid #4AAE9B;
        border-radius: 2px;
    }
</style>