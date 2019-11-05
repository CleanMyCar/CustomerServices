<template src="./trailComponent.template.html"></template>
<script>
    import moment from "moment-timezone";
    export default {
        name: "testListComponent",
        props: ['default', 'sidebar'],
        data() {
            return {
                filterObj: {
                    PropertyId: -99,
                    UnitTypeId: -99,
                    ViewListId: -1,
                    SortBy: null,
                    SortOrder: null,
                    resSourceId: -99,
                    TagsList: [],
                    SearchText: [],
                    Properties: [],
                    UnitTypes: [],
                    Sources: [],
                    Units: [],
                    StatusList: [],
                    Columns: [],
                    PageNumber: 1,
                    ItemsPerPage: 20
                },
                reservationList: []
            }
        },
        methods: {
            getReservationsList: function () {
                let vm = this;
                console.log("today", vm.today)
                console.log("vm.filterobj", vm.filterObj)
                console.log("in reservations list view:", vm.filterObj.PropertyId, vm.filterObj.UnitTypeId, vm.filterObj.ViewListId);

                vm.loading = true;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetReservationsList",
                    params: vm.filterObj,
                    callback: function (err, response) {
                        if (err) {
                            console.log("err in GetReservationsList", err);
                            return
                        }

                        if (response) {
                            vm.reservationList.splice(0, vm.reservationList.length, ...response.reservationList);
                        }
                    }
                })
            },
            formatStartYear(date) {
                // console.log("date===>"+date);
                let scope = this;
                let diff = moment(date).diff(
                    scope.today,
                    "months"
                );
                if (Math.abs(diff) >= 6) {
                    return moment(date, "YYYY-MM-DD").format("YYYY");
                }
                else {
                    return null;
                }
            },
            formatStartDate(date) {
                return moment(date, "YYYY-MM-DD").format("MMM DD");
            },
            formatEndDate(date) {
                return moment(date, "YYYY-MM-DD").format("MMM DD");
            },
            formatDateBooked(date) {
                let vm = this;
                let diff = moment(date).diff(vm.today, 'months');
                // let dateToReturn;
                console.log("diff", Math.abs(diff));
                if (Math.abs(diff) >= 6) {
                    console.log("here");
                    return moment(date, "YYYY-MM-DD").format("DD MMM YYYY");
                }
                else {
                    return moment(date, "YYYY-MM-DD").format("DD MMM");
                }

            },
            formatMoney(amount) {
                return this.$store.state.getFormattedAmount("$", amount);
            },
        },
        mounted() {
            this.getReservationsList();
        }
    }
</script>

<style type="text/css">
    /*
 * Defhttps: ; //codepen.io/vasansr/pen/PZOJXr?editors=0100#0
ine the widths: play around with these 
 * to get a best fit.
 */

    /*
 * Basic styles, good for a large display. Everything fits in
 * one row, no wrapping. All text based cells grow equally.
 */

    .table-row {
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        -webkit-flex-direction: row;
        flex-wrap: no-wrap;
        -webkit-flex-wrap: no-wrap;
        width: 100%;
        padding-left: 15px;
        padding-right: 15px;
    }

    .wrapper {
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        -webkit-flex-direction: row;
    }

    .column {
        flex-grow: 0;
        -webkit-flex-grow: 0;
        flex-shrink: 0;
        -webkit-flex-shrink: 0;
        vertical-align: top;
    }

    .index {
        width: 25px;
    }

    .title {
        width: 220px;
    }

    .module {
        width: 110px;
    }

    .reporter {
        width: 85px;
    }

    .status {
        width: 95px;
    }

    .owner {
        width: 75px;
    }

    .severity {
        width: 80px;
    }

    .watch,
    .add-comment {
        width: 18px;
    }

    .date {
        width: 110px;
    }

    .index {
        text-align: center;
    }

    .title {
        font-weight: bold;
        color: #337ab5;
    }

    .comment {
        width: 120px;
    }

    .title,
    .comment {
        flex-grow: 1;
        -webkit-flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 4px;
    }

    .date {
        width: 110px;
        text-align: right;
        padding-right: 4px;
    }

    /* growable wrappers */

    .title-comment,
    .title-comment-module-reporter,
    .attributes {
        flex-grow: 1;
        -webkit-flex-grow: 1;
    }

    /*
 * Media queries: optimize for different screen widths.
 */

    /*
 * Media breaks.
 */

    @media all and (max-width: 1236px) {
        .title-comment {
            flex-direction: column;
            -webkit-flex-direction: column;
            width: 220px;
        }
        .title-comment div {
            flex-grow: 0;
            -webkit-flex-grow: 0;
        }
        .title-comment>div {
            width: 100%;
        }
        .module-reporter,
        .status-owner {
            flex-direction: column;
            -webkit-flex-direction: column;
        }
        .module-reporter div,
        .status-owner div {
            flex-grow: 0;
            -webkit-flex-grow: 0;
        }
    }

    @media all and (max-width: 956px) {
        .module-reporter {
            flex-direction: row;
            -webkit-flex-direction: row;
        }
        .title-comment-module-reporter {
            flex-direction: column;
            -webkit-flex-direction: column;
            width: 220px;
        }
        .title-comment-module-reporter div {
            flex-grow: 0;
            -webkit-flex-grow: 0;
        }
        .title-comment-module-reporter>div {
            width: 100%;
        }
        .status-owner-severity {
            flex-direction: column;
            -webkit-flex-direction: column;
        }
        .status-owner-severity div {
            flex-grow: 0;
            -webkit-flex-grow: 0;
        }
        .icons {
            flex-direction: column;
            -webkit-flex-direction: column;
        }
        .icons div {
            flex-grow: 0;
            -webkit-flex-grow: 0;
        }
        .dates {
            flex-direction: column;
            -webkit-flex-direction: column;
        }
        .dates div {
            flex-grow: 0;
            -webkit-flex-grow: 0;
        }
    }

    @media all and (max-width: 528px) {
        .table-row {
            padding-left: 4px;
            padding-right: 4px;
        }
        .attributes {
            flex-direction: column;
            -webkit-flex-direction: column;
            width: 220px;
        }
        .attributes div {
            flex-grow: 0;
            -webkit-flex-grow: 0;
        }
        .attributes>div {
            width: 100%;
        }
        .module-reporter,
        .status-owner {
            flex-direction: row;
            -webkit-flex-direction: row;
        }
    }

    /*
 * General good-look styles
 */

    .table-row {
        border-bottom: 1px solid #e0e0e0;
        border-collapse: collapse;
        padding-top: 2px;
    }

    .table-row.header {
        background-color: #ffeedb;
        font-weight: bold;
        padding-top: 6px;
        padding-bottom: 6px;
    }

    .glyphicon {
        color: #dddddd;
    }

    .header .glyphicon {
        color: #333;
    }

    .glyphicon-eye-open.active {
        color: blue;
    }

    .glyphicon-comment.active {
        color: #3ebb0d;
    }

    .glyphicon:hover {
        color: #666;
        cursor: pointer;
        text-decoration: underline;
    }

    .reporter {
        color: #999999;
    }

    .comment {
        font-style: italic;
    }

    .severity.high {
        color: red;
    }

    .severity.medium {
        color: blue;
    }

    .severity.low {
        color: green;
    }
</style>