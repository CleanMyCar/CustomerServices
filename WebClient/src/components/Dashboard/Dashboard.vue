<template src="./Dashboard.template.html"></template>


<script type="text/javascript">
import moment from "moment-timezone";
import Vue from "vue";

import accounting from "accounting";

export default {
  name: "Dashboard",
  props: [],
  data() {
    return {
      startDate: moment().startOf('year').format("DD MMM YYYY"),
      // startDate: moment('1 Jan, 2019').format("DD MMM YYYY"),
      //   .subtract("months", 1)
        

      //   moment('Nov 1, `2019').toDate(),
      endDate: moment().format("DD MMM YYYY"),
      propertyList: [],
      filteredProperties: [],
      unitTypeList: [],
      sourceList: [],
      statusList: [],
      PropertyId: [],
      unitTypeId: [],
      sourceID: [],
      statusId: [1, 3, 5, 6, 7],
      ledgeraccountlist: [],
      ledgeraccountId: [],
      paymentStatusList: [],
      paymentStatus: [],
      reportType: "Sales",
      lblTxt: "",
      valTxt: "",
      groupBy: "Day Consumed",
      showClearFilter: false,
      paymentAnalytics: {},
      dateType: "paymentDate",
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
      headerColumnList: {},
      salesHeaderColumnList: {
        GroupByName: {
          Label: "GroupByName",
          IsChecked: true,
          ColumnName: "Group By Name",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        ResCount: {
          Label: "Res",
          IsChecked: true,
          ColumnName: "Res",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        Nights: {
          Label: "Nights",
          IsChecked: true,
          ColumnName: "Nights",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        TotalStaycharges: {
          Label: "Stay",
          IsChecked: true,
          ColumnName: "Stay",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },

        TotalCleaningFees: {
          Label: "Cleaning",
          IsChecked: true,
          ColumnName: "Cleaning",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },

        TotalOtherCharges: {
          Label: "Other",
          IsChecked: true,
          ColumnName: "Other",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },

        TotalTaxes: {
          Label: "Taxes",
          IsChecked: true,
          ColumnName: "Taxes",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        Totalcharges: {
          Label: "Total",
          IsChecked: true,
          ColumnName: "Total",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        Occ: {
          Label: "Occ %",
          IsChecked: true,
          ColumnName: "Occ %",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        CancOcc: {
          Label: "Cancel %",
          IsChecked: true,
          ColumnName: "Cancel %",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        AvgLOS: {
          Label: "Avg LOS",
          IsChecked: true,
          ColumnName: "Avg LOS",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        ADR: {
          Label: "ADR",
          IsChecked: true,
          ColumnName: "ADR",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        RevPAR: {
          Label: "RevPAR",
          IsChecked: true,
          ColumnName: "RevPAR",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        }
      },
      paymentsHeaderColumnList: {
        GuestFullName: {
          Label: "GuestFullName",
          IsChecked: true,
          ColumnName: "Guest Name",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        ConfirmationNumber: {
          Label: "ConfirmationNumber",
          IsChecked: true,
          ColumnName: "Confirmation #",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        ResStatusName: {
          Label: "ResStatusName",
          IsChecked: true,
          ColumnName: "Res Status",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        arrivalDate: {
          Label: "arrivalDate",
          IsChecked: true,
          ColumnName: "Arrival Date",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },

        departureDate: {
          Label: "departureDate",
          IsChecked: true,
          ColumnName: "Departure Date",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },

        BookedDate: {
          Label: "BookedDate",
          IsChecked: false,
          ColumnName: "Booked Date",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },

        Totalcharges: {
          Label: "Totalcharges",
          IsChecked: true,
          ColumnName: "Total",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        Balance: {
          Label: "Balance",
          IsChecked: true,
          ColumnName: "Balance",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        PropertyNickname: {
          Label: "PropertyNickname",
          IsChecked: true,
          ColumnName: "Property - unit",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        PropertyName: {
          Label: "PropertyName",
          IsChecked: false,
          ColumnName: "Property",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        UnitName: {
          Label: "UnitName",
          IsChecked: false,
          ColumnName: "Unit",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        UnitTypeName: {
          Label: "UnitTypeName",
          IsChecked: false,
          ColumnName: "Unit Type",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        PaymentStatusName: {
          Label: "PaymentStatusName",
          IsChecked: true,
          ColumnName: "Payment Status",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        PaymentDate: {
          Label: "PaymentDate",
          IsChecked: true,
          ColumnName: "Payment Date",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        Amount: {
          Label: "Amount",
          IsChecked: true,
          ColumnName: "Amount",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        FeeCollected: {
          Label: "FeeCollected",
          IsChecked: false,
          ColumnName: "Fee(s)",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        NetAmount: {
          Label: "NetAmount",
          IsChecked: false,
          ColumnName: "Net",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        MethodName: {
          Label: "MethodName",
          IsChecked: true,
          ColumnName: "Method",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        },
        PayeeName: {
          Label: "PayeeName",
          IsChecked: true,
          ColumnName: "Payee Name",
          SortOder: "",
          isSortLoading: false,
          isAscOrDesc: null
        }
      },
      paymentReportList: [],
      salesReportList: [],
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
      totalLength: null,
      ItemsPerPage: 20,
      opens: "left",
      minDate: null,
      maxDate: moment().format("DD MMM YYYY"),
      dateRange: {
        startDate: moment().startOf('year').format("DD MMM YYYY"),
        endDate: moment().format("DD MMM YYYY")
      },
      show_ranges: true,
      singleDatePicker: false,
      timePicker: true,
      timePicker24Hour: true,
      showDropdowns: true,
      autoApply: false,
      showWeekNumbers: true,
      linkedCalendars: true,
      occupancy: null,
      stayNights: null,
      avgDailyRate: null,
      revenue: null,
      salesRowData: [],
      dateControll: null
    };
  },
  components: {},
  methods: {
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
    changeGridView(reportType) {
      let vm = this;
      vm.reportType = reportType;
      if (reportType == "Sales") {
        vm.headerColumnList = vm.salesHeaderColumnList;
      } else if (reportType == "Payments") {
        vm.headerColumnList = vm.paymentsHeaderColumnList;
      }
      vm.$store.state.bus.$emit("reportType", vm.reportType);
      vm.clearFilter();
    },
    changeFirstColName() {
      let vm = this;
      // vm.Get_SalesReport(vm.reportType);
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
    checkOpen(open,togglePicker) {
      console.log("event: open", open,togglePicker);
      this.dateControll = open;
    },
    checkDateControl(){
      let vm = this;
      if(this.dateControll == true){
        vm.$store.state.bus.$emit("dateControll", false);
      }
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
            console.log("...response.propertyList", response.propertyList);

            vm.propertyList.splice(
              0,
              vm.propertyList.length,
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
          searchText: searchText,
          PropertyId: vm.PropertyId
        },
        callback: function(err, response) {
          if (err) {
            return;
          }
          if (response) {
            console.log("response", response);
            vm.unitTypeList.splice(
              0,
              vm.unitTypeList.length,
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
            vm.sourceList.splice(
              0,
              vm.sourceList.length,
              ...response.sourceList
            );
          }
        }
      });
    },
    getStatusBySearchText(searchText) {
      let vm = this;
      vm.$store.dispatch("dataRequestHandler", {
        key: "GetResevationStatusListBySearchText",
        params: {
          searchText: searchText
        },
        callback: function(err, response) {
          if (err) {
            return;
          }
          if (response) {
            vm.statusList.splice(
              0,
              vm.statusList.length,
              ...response.statusList
            );
          }
        }
      });
    },
    GetPaymentdetails_report(reportType) {
      let vm = this;
      vm.reportType = reportType;
      let propertyId = vm.PropertyId.join();
      let unitTypeId = vm.unitTypeId.join();
      let sourceID = vm.sourceID.join();
      let statusId = vm.statusId.join();
      let ledgeraccountId = vm.ledgeraccountId.join();
      let paymentStatus = vm.paymentStatus.join();
      vm.loading = true;
      vm.$store.dispatch("dataRequestHandler", {
        key: "GetPaymentdetails_report",
        params: {
          startDate: moment(vm.startDate).format("YYYY-MM-DD"),
          endDate: moment(vm.endDate).format("YYYY-MM-DD"),
          PropertyId: propertyId ? propertyId : null,
          unitTypeId: unitTypeId ? unitTypeId : null,
          resSourceID: sourceID ? sourceID : null,
          statusId: statusId ? statusId : null,
          ledgeraccountId: ledgeraccountId ? ledgeraccountId : null,
          paymentStatus: paymentStatus ? paymentStatus : null,
          groupBy: vm.groupBy
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
            vm.paymentReportList.splice(
              0,
              vm.paymentReportList.length,
              ...response[0]
            );
            vm.paymentAnalytics = response[1][0];
          }
        }
      });
    },
    Get_SalesReport(reportType) {
      let vm = this;
      vm.reportType = reportType;
      let propertyId = vm.PropertyId.join();
      let unitTypeId = vm.unitTypeId.join();
      let sourceID = vm.sourceID.join();
      let statusId = vm.statusId.join();
      vm.loading = true;
      vm.$store.dispatch("dataRequestHandler", {
        key: "Get_SalesReport",
        params: {
          startDate: moment(vm.startDate).format("YYYY-MM-DD"),
          endDate: moment(vm.endDate).format("YYYY-MM-DD"),
          PropertyId: propertyId ? propertyId : null,
          unitTypeId: unitTypeId ? unitTypeId : null,
          resSourceID: sourceID ? sourceID : null,
          statusId: statusId ? statusId : null,
          groupBy: vm.groupBy
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
            vm.salesRowData.splice(0, vm.salesRowData.length, ...response[1]);
            vm.occupancy = response[0][0].OccupancyPercentage;
            vm.stayNights = response[0][0].StayNights;
            vm.avgDailyRate = response[0][0].ADR;
            vm.revenue = response[0][0].TotalRevenue;
            vm.totalLength = response[1].length;
          }
        }
      });
    },
    getFilteredData(reportType) {
      let vm = this;
      if (reportType == "Sales") {
        // vm.Get_SalesReport(reportType);
        if (
          vm.PropertyId.length > 0 ||
          vm.unitTypeId.length > 0 ||
          vm.sourceID.length > 0
        ) {
          vm.showClearFilter = true;
        } else {
          vm.showClearFilter = false;
        }
        vm.$store.state.bus.$emit("salesApplyFilter", true);
      } else if (reportType == "Payments") {
        if (
          vm.PropertyId.length > 0 ||
          vm.unitTypeId.length > 0 ||
          vm.sourceID.length > 0 ||
          vm.ledgeraccountId.length > 0 ||
          vm.paymentStatus.length > 0
        ) {
          vm.showClearFilter = true;
        } else {
          vm.showClearFilter = false;
        }
        vm.$store.state.bus.$emit("paymentsApplyFilter", true);
        // vm.GetPaymentdetails_report(reportType);
      }
    },
    clearFilter() {
      let vm = this;
      vm.startDate = moment()
        .subtract("months", 1)
        .format("DD MMM YYYY");
      vm.endDate = moment().format("DD MMM YYYY");
      this.dateRange.startDate = moment().startOf('year').format("DD MMM YYYY"),
      this.dateRange.endDate = moment().format("DD MMM YYYY");
      vm.PropertyId.splice(0);
      vm.unitTypeId.splice(0);
      vm.sourceID.splice(0);
      vm.statusId = [1, 3, 5, 6, 7];
      vm.ledgeraccountId.splice(0);
      vm.paymentStatus.splice(0);
      vm.showClearFilter = false;

      // vm.groupBy = "Day Consumed"
      var items = document.getElementsByName("checkclass");
      for (var i = 0; i < items.length; i++) {
        if (items[i].type == "checkbox") items[i].checked = false;
      }
      console.log("vm.PropertyId", vm.PropertyId);
      if (vm.reportType == "Payments") {
        vm.$store.state.bus.$emit("paymentsApplyFilter", true);
        // vm.GetPaymentdetails_report(vm.reportType);
      } else if (vm.reportType == "Sales") {
        // vm.Get_SalesReport(vm.reportType);
        vm.$store.state.bus.$emit("salesApplyFilter", true);
      }
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
      if (vm.reportType == "Sales") {
        vm.$store.state.bus.$emit(
          "salesColumnChooser",
          vm.salesHeaderColumnList
        );
      }
      if (vm.reportType == "Payments") {
        vm.$store.state.bus.$emit(
          "paymentsColumnChooser",
          vm.paymentsHeaderColumnList
        );
      }
    },
    getMoreData($stateChange) {
      if (this.paymentReportList.length >= this.totalLength) {
        $stateChange("complete");
      } else {
        setTimeout(() => {
          $stateChange("loaded");
        }, 1500);
        this.loading = false;
        this.PageNumber++;
        // this.GetPaymentdetails_report(vm.reportType);
      }
    },
    refreshData($pullStateChange) {
      setTimeout(() => {
        this.paymentReportList.splice(0);
        for (let i = 0; i < 50; i++) {
          this.paymentReportList.push({
            text: i,
            id: i
          });
        }
        $pullStateChange("complete");
      }, 1500);
    },
    exportToExcelOrPdf(param) {
      let vm = this;
      // creating a dynamic form to send values to backend route. More DOM elements can be added here //
      var form = document.createElement("form");
      var filename = document.createElement("input");
      var modulename = document.createElement("input");
      var startDate = document.createElement("input");
      var endDate = document.createElement("input");
      var PropertyId = document.createElement("input");
      var unitTypeId = document.createElement("input");
      var resSourceID = document.createElement("input");
      var statusId = document.createElement("input");
      var paymentStatus = document.createElement("input");
      var ledgeraccountId = document.createElement("input");
      var groupBy = document.createElement("input");
      var token = document.createElement("input");
      var Source = document.createElement("input");
      var SourceId = document.createElement("input");
      var format = document.createElement("input");

      form.method = "POST";
      form.action = this.$store.state.reportHttpUrl + "/exportToExcel";
      filename.value = vm.reportType + "Reports";

      filename.name = "filename";
      filename.hidden = true;
      form.appendChild(filename);

      form.appendChild;

      modulename.value = vm.reportType + "Reports";
      modulename.name = "modulename";
      modulename.hidden = true;

      startDate.value = moment(vm.startDate).format("YYYY-MM-DD");
      startDate.name = "startDate";
      startDate.hidden = true;

      endDate.value = moment(vm.endDate).format("YYYY-MM-DD");
      endDate.name = "endDate";
      endDate.hidden = true;

      PropertyId.value = vm.PropertyId.join();
      PropertyId.name = "PropertyId";
      PropertyId.hidden = true;

      unitTypeId.value = vm.unitTypeId.join();
      unitTypeId.name = "unitTypeId";
      unitTypeId.hidden = true;

      resSourceID.value = vm.sourceID.join();
      resSourceID.name = "resSourceID";
      resSourceID.hidden = true;

      statusId.value = vm.statusId.join();
      statusId.name = "statusId";
      statusId.hidden = true;

      paymentStatus.value = vm.paymentStatus.join();
      paymentStatus.name = "paymentStatus";
      paymentStatus.hidden = true;

      ledgeraccountId.value = vm.ledgeraccountId.join();
      ledgeraccountId.name = "ledgeraccountId";
      ledgeraccountId.hidden = true;

      groupBy.value = vm.groupBy;
      groupBy.name = "groupBy";
      groupBy.hidden = true;

      token.value = window.localStorage.getItem("rttoken");
      token.name = "token";
      token.hidden = true;

      Source.value = "Web";
      Source.name = "Source";
      Source.hidden = true;

      SourceId.value = window.location.hostname;
      SourceId.name = "SourceId";
      SourceId.hidden = true;

      format.value = param.toString();
      format.name = "format";
      format.hidden = true;

      form.appendChild(modulename);
      form.appendChild(startDate);
      form.appendChild(endDate);
      form.appendChild(PropertyId);
      form.appendChild(unitTypeId);
      form.appendChild(resSourceID);
      form.appendChild(statusId);
      form.appendChild(paymentStatus);
      form.appendChild(ledgeraccountId);
      form.appendChild(groupBy);
      form.appendChild(SourceId);
      form.appendChild(Source);
      form.appendChild(token);
      form.appendChild(format);
      // document.body.appendChild(systemParams);

      document.body.appendChild(form);
      form.submit();
      vm.$store.dispatch("toastr", {
        type: "info",
        header: "Information!",
        message: "Exporting Data To" + " " + param
      });
    },
    selectProperty(property, e) {
      let vm = this;

      if (e.target.checked) {
        vm.PropertyId.push(property.PropertyId);
      } else {
        let propertyIndex = vm.PropertyId.indexOf(property.PropertyId);
        console.log(propertyIndex);
        if (propertyIndex >= 0) {
          vm.PropertyId.splice(propertyIndex, 1);
        }
      }
      console.log("vm.PropertyId", vm.PropertyId);
    },
    selectUnitType(unitType, e) {
      let vm = this;

      if (e.target.checked) {
        vm.unitTypeId.push(unitType.UnitTypeId);
      } else {
        let unitTypeIndex = vm.unitTypeId.indexOf(unitType.UnitTypeId);
        console.log(unitTypeIndex);
        if (unitTypeIndex >= 0) {
          vm.unitTypeId.splice(unitTypeIndex, 1);
        }
      }
    },
    selectSource(source, e) {
      let vm = this;

      if (e.target.checked) {
        vm.sourceID.push(source.sourceID);
      } else {
        let sourceIndex = vm.sourceID.indexOf(source.sourceID);
        console.log(sourceIndex);
        if (sourceIndex >= 0) {
          vm.sourceID.splice(sourceIndex, 1);
        }
      }
    },
    selectStatus(status, e) {
      let vm = this;

      if (e.target.checked) {
        vm.statusId.push(status.StatusId);
      } else {
        let statusIndex = vm.statusId.indexOf(status.StatusId);
        console.log(statusIndex);
        if (statusIndex >= 0) {
          vm.statusId.splice(statusIndex, 1);
        }
      }
    },
    selectledgeraccount(ledgeraccount, e) {
      let vm = this;

      if (e.target.checked) {
        vm.ledgeraccountId.push(ledgeraccount.ledgerAccountName);
      } else {
        let ledgeraccountIndex = vm.ledgeraccountId.indexOf(
          ledgeraccount.ledgerAccountName
        );
        console.log(ledgeraccountIndex);
        if (ledgeraccountIndex >= 0) {
          vm.ledgeraccountId.splice(ledgeraccountIndex, 1);
        }
      }
    },
    selectPaymentStatus(paymentStatus, e) {
      let vm = this;

      if (e.target.checked) {
        vm.paymentStatus.push(paymentStatus);
      } else {
        let paymentStatusIndex = vm.paymentStatus.indexOf(paymentStatus);
        console.log(paymentStatusIndex);
        if (paymentStatusIndex >= 0) {
          vm.paymentStatus.splice(paymentStatusIndex, 1);
        }
      }
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
    GetLedgeraccountlist() {
      let vm = this;
      vm.$store.dispatch("dataRequestHandler", {
        key: "GetLedgeraccountlist",
        params: {},
        callback: function(err, response) {
          if (err) {
            return;
          }
          if (response) {
            vm.ledgeraccountlist.splice(
              0,
              vm.ledgeraccountlist.length,
              ...response[0]
            );
          }
        }
      });
    },
    GetPaymentstatusList() {
      let vm = this;
      vm.$store.dispatch("dataRequestHandler", {
        key: "GetPaymentstatusList",
        params: {},
        callback: function(err, response) {
          if (err) {
            return;
          }
          if (response) {
            vm.paymentStatusList.splice(
              0,
              vm.paymentStatusList.length,
              ...response[0]
            );
          }
        }
      });
    }
  },
  created() {
    let vm = this;
    vm.$store.state.bus.$on("groupByName", function(groupByName) {
      if (groupByName) {
        vm.groupBy = groupByName;
      }
    });
  },
  computed: {},
  mounted() {
    let vm = this;
    console.log("payment reports");
    // vm.GetPaymentdetails_report(vm.reportType);
    vm.getPropertiesBySearchText();
    vm.getUnitTypesListBySearchText();
    vm.getSourceListBySearchText();
    vm.getStatusBySearchText();
    // vm.Get_SalesReport(vm.reportType);
    vm.GetLedgeraccountlist();
    vm.GetPaymentstatusList();
    vm.headerColumnList = vm.salesHeaderColumnList;
    // setTimeout(() => {
    //   this.lblT();
    //   window.addEventListener("resize", this.lblT);
    //   this.valT();
    //   window.addEventListener("resize", this.valT);
    // }, 1000);
  },
  watch: {}
};
</script>
<style lang="postcss">
/* .infiniteBody {
  position: absolute;
  top: 20px;
  bottom: 20px;
  left: 100px;
  right: 20px;
} */
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