<template src="./tapeChart.template.html"></template>
<script>
import moment from "moment";
export default {
  name: "taxDetailComponent",
  props: [],
  data() {
    return {
      appliedFilterObj: {
        startDate: null,
        endDate: null,
        properties: [],
        unitTypes: [],
        sources: [],
        propertyId: null,
        unitId: null
      },
      selectedFilterObj: {
        startDate: null,
        endDate: null,
        properties: [],
        unitTypes: [],
        sources: []
      },
      loading: false,
      isGreyOut: false,
      resHeaderColumnList: {
        // PropertyName: {
        //     Label: "Property Name", IsChecked: true, ColumnName: "PropertyName", class: "filterLoad", isAscOrDesc: null,
        // },
        // UnitName: {
        //     Label: "Unit Type Name", IsChecked: true, ColumnName: "UnitTypeName", class: "filterLoad", isAscOrDesc: null,
        // },
        // UnitTypeName: {
        //     Label: "Unit Type Name", IsChecked: true, ColumnName: "UnitTypeName", class: "filterLoad", isAscOrDesc: null,
        // },
        StartDate: {
          Label: "Date",
          IsChecked: true,
          ColumnName: "StartDate",
          class: "filterLoad",
          isAscOrDesc: null
        },
        // Enddate: {
        //     Label: "Check Out", IsChecked: true, ColumnName: "Enddate", class: "filterLoad", isAscOrDesc: null,
        // },
        ConfirmationNumber: {
          Label: "Confirmation Number",
          IsChecked: true,
          ColumnName: "ConfirmationNumber",
          class: "filterLoad",
          isAscOrDesc: null
        },
        GuestName: {
          Label: "Guest Name",
          IsChecked: true,
          ColumnName: "GuestName",
          class: "filterLoad",
          isAscOrDesc: null
        },
        ReservationStatus: {
          Label: "Status",
          IsChecked: true,
          ColumnName: "ReservationStatus",
          class: "filterLoad",
          isAscOrDesc: null
        }
        // IsAssignedRoom:{
        //     Label: "Unassigned", IsChecked: true, ColumnName: "IsAssigned", class: "filterLoad", isAscOrDesc: null,
        // }
      },
      ratesHeaderColumnList: {
        DateEffective: {
          Label: "Date",
          IsChecked: true,
          ColumnName: "DateEffective",
          class: "",
          isAscOrDesc: null
        },
        Amount: {
          Label: "Base Rate",
          IsChecked: true,
          ColumnName: "Amount",
          class: "",
          isAscOrDesc: null
        },
        AdditionalAdult: {
          Label: "Additional Adult",
          IsChecked: true,
          ColumnName: "AdditionalAdult",
          class: "",
          isAscOrDesc: null
        },
        AdditionalChild: {
          Label: "Additional Child",
          IsChecked: true,
          ColumnName: "AdditionalChild",
          class: "",
          isAscOrDesc: null
        },
        MinStayValue: {
          Label: "Min Stay",
          IsChecked: true,
          ColumnName: "MinStayValue",
          class: "minStay",
          isAscOrDesc: null
        },
        NoCheckin: {
          Label: "No Checkin",
          IsChecked: true,
          ColumnName: "NoCheckin",
          class: "",
          isAscOrDesc: null
        },
        NoCheckout: {
          Label: "No CheckOut",
          IsChecked: true,
          ColumnName: "NoCheckout",
          class: "",
          isAscOrDesc: null
        }
      },
      linearProgress: false,
      reservationList: [],
      reservationSummaryInfo: null,
      toggleFilterPanel: false,
      metaPropertyList: [],
      metaUnitTypeList: [],
      metaSourceList: [],
      filterSearchPropertyText: null,
      filterSearchUnitTypeText: null,
      filterSearchSourceTypeText: null,
      selectedFilterColumn: null,
      tapeChartData: null,
      layoutType: "1",
      resGrid: true,
      rateGrid: false,
      unitList: [],
      propertyList: [],
      opens: "center"
    };
  },
  methods: {
    updateValues(values) {
      let vm = this;
      vm.appliedFilterObj.startDate = values.startDate
        .toISOString()
        .slice(0, 10);
      vm.appliedFilterObj.endDate = values.endDate.toISOString().slice(0, 10);
    },
    applyFilter() {
      let vm = this;
      vm.toggleFilterPanel = false;
      // vm.appliedFilterObj.startDate = vm.selectedFilterObj.startDate;
      // vm.appliedFilterObj.endDate = vm.selectedFilterObj.endDate;

      // vm.appliedFilterObj.properties.splice(0, vm.appliedFilterObj.properties.length, ...vm.selectedFilterObj.properties);
      // vm.appliedFilterObj.unitTypes.splice(0, vm.appliedFilterObj.unitTypes.length, ...vm.selectedFilterObj.unitTypes);
      // vm.appliedFilterObj.sources.splice(0, vm.appliedFilterObj.sources.length, ...vm.selectedFilterObj.sources);

      vm.getTapeChartData();
    },
    showFilterByType(filterCol) {
      if (this.selectedFilterColumn == filterCol)
        this.selectedFilterColumn = null;
      else this.selectedFilterColumn = filterCol;

      if (filterCol == "property") this.getPropertiesBySearchText();
      if (filterCol == "unitType") this.getUnitTypesListBySearchText();
      if (filterCol == "source") this.getSourceListBySearchText();
      if (filterCol == "tag") this.getClientTags();
    },
    getPropertiesBySearchText(searchText) {
      let vm = this;
      vm.$store.dispatch("dataRequestHandler", {
        key: "GetPropertiesBySearchText",
        params: {
          searchText: searchText
        },
        callback: function(err, response) {
          if (err) {
            return;
          }
          if (response) {
            vm.metaPropertyList.splice(
              0,
              vm.metaPropertyList.length,
              ...response.propertyList
            );
          }
        }
      });
    },
    getUnitTypesListBySearchText(searchText) {
      let vm = this;
      vm.$store.dispatch("dataRequestHandler", {
        key: "GetUnitTypesListBySearchText",
        params: {
          searchText: searchText
        },
        callback: function(err, response) {
          if (err) {
            return;
          }
          if (response) {
            vm.metaUnitTypeList.splice(
              0,
              vm.metaUnitTypeList.length,
              ...response.unitTypeList
            );
          }
        }
      });
    },
    getSourceListBySearchText(searchText) {
      let vm = this;
      vm.$store.dispatch("dataRequestHandler", {
        key: "GetSourceListBySearchText",
        params: {
          searchText: searchText
        },
        callback: function(err, response) {
          if (err) {
            return;
          }
          if (response) {
            vm.metaSourceList.splice(
              0,
              vm.metaSourceList.length,
              ...response.sourceList
            );
          }
        }
      });
    },
    closeFilter() {
      this.toggleFilterPanel = false;
    },
    showResBtn() {
      this.resGrid = true;
      this.rateGrid = false;
    },
    showRateBtn() {
      this.resGrid = false;
      this.rateGrid = true;
    },
    deleteSelectedPropertyFromFilter(index, propObj) {
      this.removePropertyFromFilter(propObj);
      this.appliedFilterObj.properties.splice(index, 1);
      this.applyFilter();
    },
    deleteSelectedUnitFromFilter(index, unitTypeObj) {
      this.removeUnitTypeFromFilter(unitTypeObj);
      this.appliedFilterObj.unitTypes.splice(index, 1);
      this.applyFilter();
    },
    deleteSelectedSourceFromFilter(index, sourceObj) {
      this.removeSourceFromFilter(sourceObj);
      this.appliedFilterObj.sources.splice(index, 1);
      this.applyFilter();
    },
    deleteSelectedTagFromFilter(index, tagObj) {
      this.removeTagFromFilter(tagObj);
      this.appliedFilterObj.tags.splice(index, 1);
      this.applyFilter();
    },
    updateStartDate(key, dateObj) {
      let scope = this;
      scope.appliedFilterObj.startDate = dateObj
        ? dateObj.format("DD MMM YYYY")
        : null;
    },
    updateEndDate(key, dateObj) {
      let scope = this;
      scope.appliedFilterObj.endDate = dateObj
        ? dateObj.format("DD MMM YYYY")
        : null;
    },
    addPropertyToFilter(propertyObj) {
      this.selectedFilterObj.properties.push(propertyObj);
      this.filterSearchPropertyText = null;
      this.selectedFilterColumn = null;
    },
    removePropertyFromFilter(propertyObj) {
      if (propertyObj) {
        let index = this.selectedFilterObj.properties.findIndex(
          currProperty => {
            return currProperty.PropertyId === propertyObj.PropertyId;
          }
        );
        if (index > -1) {
          this.selectedFilterObj.properties.splice(index, 1);
        }
      }
    },
    addUnitTypeToFilter(unitTypeObj) {
      this.selectedFilterObj.unitTypes.push(unitTypeObj);
      this.filterSearchUnitTypeText = null;
      this.selectedFilterColumn = null;
    },
    removeUnitTypeFromFilter(unitTypeObj) {
      if (unitTypeObj) {
        let index = this.selectedFilterObj.unitTypes.findIndex(currUnitType => {
          return currUnitType.UnitTypeId === unitTypeObj.UnitTypeId;
        });
        if (index > -1) {
          this.selectedFilterObj.unitTypes.splice(index, 1);
        }
      }
    },
    addSourceToFilter(sourceObj) {
      this.selectedFilterObj.sources.push(sourceObj);
      this.filterSearchSourceTypeText = null;
      this.selectedFilterColumn = null;
    },
    removeSourceFromFilter(sourceObj) {
      if (sourceObj) {
        let index = this.selectedFilterObj.sources.findIndex(currSource => {
          return currSource.sourceID === sourceObj.sourceID;
        });
        if (index > -1) {
          this.selectedFilterObj.sources.splice(index, 1);
        }
      }
    },
    getTapeChartData() {
      let vm = this;

      vm.$store.dispatch("dataRequestHandler", {
        key: "GetTapeChartData",
        params: vm.appliedFilterObj,
        callback: function(err, response) {
          if (err) {
            console.log("err in GetTapeChartData", err);
            return;
          }
          if (response) {
            vm.tapeChartData = response;
          }
        }
      });
    },
    closeSummaryPannel() {},
    formatDate(date) {
      return moment(date).format("DD MMM, YYYY");
    },
    deleteDateFromFilter(date) {
      this.appliedFilterObj[date] = null;
      this.getTapeChartData();
    },
    getPropertyUnits() {
      let scope = this;
      this.$store.dispatch("dataRequestHandler", {
        key: "GetUnitAndUnassignedUnitList",
        params: {
          PropertyId: scope.appliedFilterObj.propertyId,
          StatusId: 1
        },
        callback: function(err, response) {
          if (response) {
            scope.unitList.splice(
              0,
              scope.unitList.length,
              ...response.unitList
            );
          } else {
            console.log(err);
          }
        }
      });
    },
    getPropertyMetaData: function() {
      let scope = this;
      this.$store.dispatch("dataRequestHandler", {
        key: "GetPropertyMetaData",
        params: {
          ModuleAction: "GetPropertyMetaData"
        },
        callback: function(err, response) {
          if (response) {
            console.log("response GetPropertyMetaData", response);
            scope.propertyList.splice(
              0,
              scope.propertyList.length,
              ...response.recordsets[1]
            );
          } else {
            console.log(err);
          }
        }
      });
    },
    applyFilters() {
      this.getTapeChartData();
    },
    redirectToReservation(instance) {
      this.$router.push("/newReservation/" + instance.Reservationid);
      //this.$store.state.bus.$emit("RefreshParentMenu");
      let parentModuleName = "Reservations";
      this.$store.state.bus.$emit("IsCalendarIcons", parentModuleName);
    }
  },

  computed: {},

  mounted() {
    //this.getTapeChartData();
    this.getPropertyMetaData();
  },
  watch: {
    layoutType: function(value) {
      console.log(value);
    }
  }
};
</script>