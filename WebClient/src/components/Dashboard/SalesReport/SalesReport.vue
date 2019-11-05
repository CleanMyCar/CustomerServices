<template src="./SalesReport.template.html"></template>


<script type="text/javascript">
import moment from "moment-timezone";
import Vue from "vue";

import accounting from "accounting";

export default {
  name: "SalesReport",
  props: [
    "propertyIds",
    "unitTypeIds",
    "sourceIds",
    "reservationStatusIds",
    "startDate",
    "endDate",
    "dateType"
  ],
  data() {
    return {
      salesReportList: [],
      groupBy: "Day Consumed",
      groupByList: [
        {
          groupById: 1,
          groupByLabel: "Year Consumed"
        },
        {
          groupById: 2,
          groupByLabel: "Month Consumed"
        },
        {
          groupById: 3,
          groupByLabel: "Week Consumed"
        },
        {
          groupById: 4,
          groupByLabel: "Day Consumed"
        },
        {
          groupById: 5,
          groupByLabel: "Booked Year"
        },
        {
          groupById: 6,
          groupByLabel: "Booked Month"
        },
        {
          groupById: 7,
          groupByLabel: "Booked Week"
        },
        {
          groupById: 8,
          groupByLabel: "Booked Day"
        },
        {
          groupById: 9,
          groupByLabel: "Bedrooms"
        },
        {
          groupById: 10,
          groupByLabel: "Property"
        },
        {
          groupById: 11,
          groupByLabel: "Source"
        },
        {
          groupById: 12,
          groupByLabel: "Status"
        },
        {
          groupById: 13,
          groupByLabel: "Unit"
        },
        {
          groupById: 13,
          groupByLabel: "Unit Type"
        }
      ],
      headerColumnList: {
        GroupByName: {
          Label: "GroupByName",
          IsChecked: true,
          ColumnName: "Day Consumed",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        ResCount: {
          Label: "ResCount",
          IsChecked: true,
          ColumnName: "Res",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        Nights: {
          Label: "Nights",
          IsChecked: true,
          ColumnName: "Nights",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        TotalStaycharges: {
          Label: "TotalStaycharges",
          IsChecked: true,
          ColumnName: "Stay",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },

        TotalCleaningFees: {
          Label: "TotalCleaningFees",
          IsChecked: true,
          ColumnName: "Cleaning",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },

        TotalOtherCharges: {
          Label: "TotalOtherCharges",
          IsChecked: true,
          ColumnName: "Other",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },

        TotalTaxes: {
          Label: "TotalTaxes",
          IsChecked: true,
          ColumnName: "Taxes",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        Totalcharges: {
          Label: "Totalcharges",
          IsChecked: true,
          ColumnName: "Total",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        Occ: {
          Label: "Occ",
          IsChecked: true,
          ColumnName: "Occ %",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        CancOcc: {
          Label: "CancOcc",
          IsChecked: true,
          ColumnName: "Cancel %",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        AvgLOS: {
          Label: "AvgLOS",
          IsChecked: true,
          ColumnName: "Avg LOS",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        ADR: {
          Label: "ADR",
          IsChecked: true,
          ColumnName: "ADR",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        RevPAR: {
          Label: "RevPAR",
          IsChecked: true,
          ColumnName: "RevPAR",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        }
      },
      options: {
        scrollbars: true,
        interactiveScrollbars: true,
        probeType: 3,
        mouseWheel: true,
        mouseWheelSpeed: 1
      },
      variable: false,
      pullDownTextObj: {
        trigger: "Loading...",
        begin: "Loading...",
        complete: "There are no items",
        error: "There is server error",
        refresh: "Loading..."
      },
      loading: false,
      items: [],
      totalLength: null,
      occupancy: null,
      stayNights: null,
      avgDailyRate: null,
      revenue: null,
      lblTxt: "",
      valTxt: "",
      PageNumber: 1,
      ItemsPerPage: 20
    };
  },
  components: {},
  methods: {
    Get_SalesReport() {
      let vm = this;
      // vm.salesReportList.splice(0);
      let propertyId = vm.propertyIds.join();
      let unitTypeId = vm.unitTypeIds.join();
      let sourceID = vm.sourceIds.join();
      let statusId = vm.reservationStatusIds.join();
      vm.loading = true;
      let type = 1;
      if (vm.dateType == "folioDate") {
        type = 1;
      } else if (vm.dateType == "bookedOn") {
        type = 2;
      } else if (vm.dateType == "arrivedOn") {
        type = 3;
      }
      vm.$store.dispatch("dataRequestHandler", {
        key: "Get_SalesReport",
        params: {
          startDate: moment(vm.startDate).format("YYYY-MM-DD"),
          endDate: moment(vm.endDate).format("YYYY-MM-DD"),
          PropertyId: propertyId ? propertyId : null,
          unitTypeId: unitTypeId ? unitTypeId : null,
          resSourceID: sourceID ? sourceID : null,
          statusId: statusId ? statusId : null,
          groupBy: vm.groupBy,
          PageNo: vm.PageNumber,
          ItemsPerPage: vm.ItemsPerPage
        },
        callback: function(err, response) {
          if (err) {
            console.log("error in Get_SalesReport", err);
            return;
          }
          if (response) {
            vm.loading = false;
            vm.$store.dispatch("toastr", {
              type: "success",
              message: "Sales Reports rendered successfully",
              header: ""
            });
            if (vm.PageNumber == 1) {
              vm.salesReportList.splice(
                0,
                vm.salesReportList.length,
                ...response[1]
              );
            } else if (vm.PageNumber > 1) {
              vm.salesReportList.splice(
                vm.salesReportList.length,
                0,
                ...response[1]
              );
            }

            vm.occupancy = response[0][0].OccupancyPercentage;
            vm.stayNights = response[0][0].StayNights;
            vm.avgDailyRate = response[0][0].ADR;
            vm.revenue = response[0][0].TotalRevenue;
            vm.totalLength = response[2][0].TotalCount;
          }
        }
      });
    },
    getcurrencysymbol(amount) {
      if (amount >= 1000000000) {
        return "G";
      } else if (amount >= 1000000) {
        return "M";
      } else if (amount >= 1000) {
        return "K";
      } else {
        return null;
      }
    },
    formatMoney(amount) {
      return accounting.formatMoney(amount, {
        symbol: "",
        format: {
          pos: "%s %v",
          neg: "%s (%v)",
          zero: "%s  %v"
        },
        thousand: ",",
        precision: 0,
        decimal: "."
      });
      // return this.$store.state.getFormattedAmount("", amount);
    },
    formatCurrency(amount) {
      return this.$store.state.getFormattedAmount("$", amount);
    },
    changeFirstColName() {
      let vm = this;
      vm.salesReportList.splice(0);
      vm.headerColumnList["GroupByName"].ColumnName = vm.groupBy;
      vm.Get_SalesReport(vm.reportType);

      vm.$store.state.bus.$emit("groupByName", vm.groupBy);
    },
    updateValues(values) {
      this.dateRange.startDate = moment(values.startDate).format("DD MMM YYYY");
      this.dateRange.endDate = moment(values.endDate).format("DD MMM YYYY");
      console.log("event: update", values);
      this.startDate = values.startDate;
      this.endDate = values.endDate;
      this.dateType = values.dateType;
      // alert(this.dateType);
    },
    selectColumn(column, event) {
      let vm = this;
      let isAnyColumnUnchecked = false;
      Object.keys(vm.headerColumnList).forEach(function(key) {
        if (
          !vm.headerColumnList[key]["IsChecked"] ||
          !event.currentTarget.checked
        ) {
          isAnyColumnUnchecked = true;
        }
      });
    },
    getMoreData($stateChange) {
      if (this.salesReportList.length >= this.totalLength) {
        $stateChange("complete");
      } else {
        setTimeout(() => {
          $stateChange("loaded");
        }, 1500);
        this.loading = false;
        this.PageNumber++;
        this.Get_SalesReport();
      }
    },
    refreshData($pullStateChange) {
      setTimeout(() => {
        this.salesReportList.splice(0);
        for (let i = 0; i < 50; i++) {
          this.salesReportList.push({
            text: i,
            id: i
          });
        }
        $pullStateChange("complete");
      }, 1500);
    },
    lblT() {
      let vm = this;
      let cw = this.$refs.reportSummaryCard.clientWidth;
      let cal = (cw / 100) * 30;

      let obj = {
        "font-size": cal + "%"
      };
      vm.lblTxt = obj;

      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@", cw);
    },
    valT() {
      let vm = this;
      let cw = this.$refs.reportSummaryCard.clientWidth;
      let cal = (cw / 100) * 80;

      let obj = {
        "font-size": cal + "%"
      };
      vm.valTxt = obj;

      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@", cw);
    },
    ascSort(sortBy, sortOrder) {
      let vm = this;
      vm.salesReportList.splice(0);
      vm.PageNumber = 1;
      if (sortOrder == "" || sortOrder == "asc") {
        sortOrder = "desc";
        vm.headerColumnList[sortBy].SortOder = "desc";
        vm.headerColumnList[sortBy].isSortAscOrDesc = "desc";
      } else if (sortOrder == "desc") {
        vm.headerColumnList[sortBy].SortOder = "asc";
        vm.headerColumnList[sortBy].isSortAscOrDesc = "asc";
      } else {
        vm.headerColumnList[sortBy].SortOder = null;
        vm.headerColumnList[sortBy].isSortAscOrDesc = "";
      }
      console.log("sortBy", sortBy, "=", vm.headerColumnList[sortBy].SortOder);

      // for (var i in vm.headerColumnList) {
      //   vm.headerColumnList[i].isAscOrDesc = null;
      //   if (vm.headerColumnList[i].ColumnName !== "Actions") {
      //     var obj = vm.headerColumnList[i];
      //     console.log("obj", obj);
      //     for (var j in obj.sortLabels) {
      //       vm.headerColumnList[i].isSortAscOrDesc = "";
      //       if (sortBy.toString() === obj.sortLabels[j].ColumnName) {
      //         console.log("obj.ColumnName", obj.sortLabels[j].ColumnName);
      //         vm.headerColumnList[i].sortLabels[j].isSortLoading = true;
      //         vm.headerColumnList[i].sortLabels[j].isActive = sortBy.toString();
      //         vm.headerColumnList[i].isAscOrDesc = sortOrder.toString();
      //         if (sortOrder.toString() === "desc") {
      //           console.log("sortOrderToSend === 'desc'");
      //           vm.headerColumnList[i].sortLabels[j].SortOder = "asc";
      //           vm.headerColumnList[i].sortLabels[j].isSortAscOrDesc = "desc";
      //         }
      //         if (sortOrder.toString() === "asc") {
      //           console.log("sortOrderToSend === 'asc'");
      //           vm.headerColumnList[i].sortLabels[j].SortOder = "desc";
      //           vm.headerColumnList[i].sortLabels[j].isSortAscOrDesc = "asc";
      //         }
      //       }
      //     }
      //   }
      // }
      vm.Get_SalesReport();
    }
  },

  computed: {},
  mounted() {
    let vm = this;
    console.log("payment reports");
    vm.Get_SalesReport();
    setTimeout(() => {
      this.lblT();
      window.addEventListener("resize", this.lblT);
      this.valT();
      window.addEventListener("resize", this.valT);
    }, 1000);
  },
  watch: {},
  created() {
    let vm = this;
    vm.$store.state.bus.$on("salesApplyFilter", function(selected) {
      if (selected == true) {
        vm.PageNumber = 1;
        vm.salesReportList.splice(0);
        vm.Get_SalesReport();
      }
    });
    vm.$store.state.bus.$on("salesColumnChooser", function(headerColumnList) {
      if (headerColumnList) {
        vm.headerColumnList = headerColumnList;
      }
    });
  }
};
</script>
<style lang="postcss">
.infiniteBody {
  position: absolute;
  top: 20px;
  bottom: 20px;
  left: 100px;
  right: 20px;
}
/* .ag-header-cell-text {
  color: #95a6af;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 500;
}
.scrollable-menu {
  height: auto;
  max-height: 400px;
  overflow-x: hidden;
} */
</style>