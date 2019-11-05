<template src="./PaymentsReport.template.html"></template>


<script type="text/javascript">
import moment from "moment-timezone";
import Vue from "vue";

import accounting from "accounting";

export default {
  name: "PaymentsReport",
  props: [
    "propertyIds",
    "unitTypeIds",
    "sourceIds",
    "paymentStatusIds",
    "methods",
    "startDate",
    "endDate",
    "dateType"
  ],
  data() {
    return {
      paymentsReportList: [],
      headerColumnList: {
        GuestFullName: {
          Label: "GuestFullName",
          IsChecked: true,
          ColumnName: "Guest Name",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        ConfirmationNumber: {
          Label: "ConfirmationNumber",
          IsChecked: true,
          ColumnName: "Confirmation #",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        ResStatusName: {
          Label: "ResStatusName",
          IsChecked: true,
          ColumnName: "Res Status",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        arrivalDate: {
          Label: "arrivalDate",
          IsChecked: true,
          ColumnName: "Arrival Date",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },

        departureDate: {
          Label: "departureDate",
          IsChecked: true,
          ColumnName: "Departure Date",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },

        BookedDate: {
          Label: "BookedDate",
          IsChecked: false,
          ColumnName: "Booked Date",
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
        Balance: {
          Label: "Balance",
          IsChecked: true,
          ColumnName: "Balance",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        PropertyNickname: {
          Label: "PropertyNickname",
          IsChecked: true,
          ColumnName: "Property - unit",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        PropertyName: {
          Label: "PropertyName",
          IsChecked: false,
          ColumnName: "Property",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        UnitName: {
          Label: "UnitName",
          IsChecked: false,
          ColumnName: "Unit",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        UnitTypeName: {
          Label: "UnitTypeName",
          IsChecked: false,
          ColumnName: "Unit Type",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        PaymentStatusName: {
          Label: "PaymentStatusName",
          IsChecked: true,
          ColumnName: "Payment Status",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        PaymentDate: {
          Label: "PaymentDate",
          IsChecked: true,
          ColumnName: "Payment Date",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        Amount: {
          Label: "Amount",
          IsChecked: true,
          ColumnName: "Amount",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        FeeCollected: {
          Label: "FeeCollected",
          IsChecked: false,
          ColumnName: "Fee(s)",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        NetAmount: {
          Label: "NetAmount",
          IsChecked: false,
          ColumnName: "Net",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        MethodName: {
          Label: "MethodName",
          IsChecked: true,
          ColumnName: "Method",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null,
          isSortAscOrDesc: ""
        },
        PayeeName: {
          Label: "PayeeName",
          IsChecked: true,
          ColumnName: "Payee Name",
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
      PageNumber: 1,
      loading: false,
      items: [],
      totalLength: null,
      ItemsPerPage: 20,
      lblTxt: "",
      valTxt: "",
      paymentAnalytics: {},
      PageNumber: 1,
      ItemsPerPage: 20,
      totalLength: null
    };
  },
  components: {},
  methods: {
    ascSort(sortBy, sortOrder) {
      let vm = this;
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
      vm.GetPaymentdetails_report();
    },
    GetPaymentdetails_report() {
      let vm = this;
      let propertyId = vm.propertyIds.join();
      let unitTypeId = vm.unitTypeIds.join();
      let sourceID = vm.sourceIds.join();
      let ledgeraccountId = vm.methods.join();
      let paymentStatus = vm.paymentStatusIds.join();
      vm.loading = true;
      let type = 1
      if(vm.dateType == "paymentDate"){
        type = 1
      }
      else if(vm.dateType == "stayDate"){
        type = 2
      }
      vm.$store.dispatch("dataRequestHandler", {
        key: "GetPaymentdetails_report",
        params: {
          startDate: moment(vm.startDate).format("YYYY-MM-DD"),
          endDate: moment(vm.endDate).format("YYYY-MM-DD"),
          PropertyId: propertyId ? propertyId : null,
          unitTypeId: unitTypeId ? unitTypeId : null,
          resSourceID: sourceID ? sourceID : null,
          ledgeraccountId: ledgeraccountId ? ledgeraccountId : null,
          paymentStatus: paymentStatus ? paymentStatus : null,
          groupBy: vm.groupBy,
          PageNo: vm.PageNumber,
          ItemsPerPage: vm.ItemsPerPage,
          dateType: type
        },
        callback: function(err, response) {
          if (err) {
            console.log("error in GetPaymentdetails_report", err);
            return;
          }
          if (response) {
            vm.loading = false;
            vm.$store.dispatch("toastr", {
              type: "success",
              message: "Payment Reports rendered successfully",
              header: ""
            });
            if (vm.PageNumber == 1) {
              vm.paymentsReportList.splice(
                0,
                vm.paymentsReportList.length,
                ...response[0]
              );
            } else if (vm.PageNumber > 1) {
              vm.paymentsReportList.splice(
                vm.paymentsReportList.length,
                0,
                ...response[0]
              );
            }
            vm.paymentAnalytics = response[1][0];
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
      if (this.paymentsReportList.length >= this.totalLength) {
        $stateChange("complete");
      } else {
        setTimeout(() => {
          $stateChange("loaded");
        }, 1000);
        this.loading = false;
        this.PageNumber++;
        this.GetPaymentdetails_report();
      }
    },
    refreshData($pullStateChange) {
      setTimeout(() => {
        this.paymentsReportList.splice(0);
        for (let i = 0; i < 50; i++) {
          this.paymentsReportList.push({
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
    }
  },

  computed: {},
  mounted() {
    let vm = this;
    console.log("payment reports");
    vm.GetPaymentdetails_report();
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
    vm.$store.state.bus.$on("paymentsApplyFilter", function(selected) {
      if (selected == true) {
        vm.PageNumber = 1;
        vm.paymentsReportList.splice(0);
        vm.GetPaymentdetails_report();
      }
    });
    vm.$store.state.bus.$on("paymentsColumnChooser", function(
      headerColumnList
    ) {
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