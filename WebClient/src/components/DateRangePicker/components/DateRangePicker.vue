<template>
  <div class="vue-daterange-picker">
    <div class="form-control reportrange-text btn btn-sm btn-default" @click="togglePicker(null, true)">
      <slot name="input" :startDate="start" :endDate="end" :ranges="ranges">
        <i class="glyphicon glyphicon-calendar fa fa-calendar-alt" style="font-size:14px"></i>&nbsp;
        <span v-if="dateType == 'paymentDate'">Payment Date : </span>
        <span v-if="dateType == 'stayDate'">Stay Date : </span>
        <span v-if="dateType == 'folioDate'">Revenue Folio Date : </span>
        <span v-if="dateType == 'bookedOn'">Date Reserved : </span>
        <span v-if="dateType == 'arrivedOn'">Date of Arrival : </span>

        <span>{{rangeText}}</span>
        <b class="caret"></b>
      </slot>
    </div>
    <transition name="slide-fade" mode="out-in">
      <div class="daterangepicker dropdown-menu ltr" :class="pickerStyles" v-if="open" v-on-clickaway="clickAway" style="padding-top: 0px;">
        <div class="form-group" style=" margin-left: 285px;margin-bottom: 0;">
          <label style="position: relative;top: 39px;left: -44px;">Filter By:</label>
          <select style=" width: 135px;" class="form-control" v-model="dateType" @change="selectDateType()">
            <option v-if="reportType == 'Payments'" :value="'stayDate'">Stay Date</option>
            <option v-if="reportType == 'Payments'" :value="'paymentDate'">Payment Date</option>
            <option v-if="reportType == 'Sales'" :value="'bookedOn'">Date Reserved</option>
            <option v-if="reportType == 'Sales'" :value="'arrivedOn'">Date of Arrival</option>
            <option v-if="reportType == 'Sales'" :value="'folioDate'">Revenue Folio Date</option>
          </select>
        </div>
        <div class="calendars row no-gutters">
          <slot name="ranges" v-if="ranges !== false">
            <calendar-ranges class="col-12 col-md-auto" @clickRange="clickRange" :ranges="ranges" :selected="{ startDate: start, endDate: end }"></calendar-ranges>
          </slot>

          <div class="drp-calendar col left" :class="{single: singleDatePicker}">
            <div class="daterangepicker_input d-none d-sm-block" v-if="false">
              <input class="input-mini form-control" type="text" name="daterangepicker_start" :value="startText" />
              <i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
            </div>
            <div class="calendar-table">
              <calendar :monthDate="monthDate" :locale-data="locale" :start="start" :end="end" :minDate="min" :maxDate="max" :show-dropdowns="showDropdowns"
                @change-month="changeLeftMonth" :date-format="dateFormat" @dateClick="dateClick" @hoverDate="hoverDate" :showWeekNumbers="showWeekNumbers"></calendar>
            </div>
            <calendar-time v-if="timePicker" @update="onUpdateStartTime" :miniute-increment="timePickerIncrement" :hour24="timePicker24Hour"
              :second-picker="timePickerSeconds" :current-time="start" />
          </div>

          <div class="drp-calendar col right" v-if="!singleDatePicker">
            <div class="daterangepicker_input" v-if="false">
              <input class="input-mini form-control" type="text" name="daterangepicker_end" :value="endText" />
              <i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
            </div>
            <div class="calendar-table">
              <calendar :monthDate="nextMonthDate" :locale-data="locale" :start="start" :end="end" :minDate="min" :maxDate="max" :show-dropdowns="showDropdowns"
                @change-month="changeRightMonth" :date-format="dateFormat" @dateClick="dateClick" @hoverDate="hoverDate" :showWeekNumbers="showWeekNumbers"></calendar>
            </div>
            <calendar-time v-if="timePicker" @update="onUpdateEndTime" :miniute-increment="timePickerIncrement" :hour24="timePicker24Hour"
              :second-picker="timePickerSeconds" :current-time="end" />
          </div>
        </div>

        <div class="drp-buttons" v-if="!autoApply">
          <span class="drp-selected">{{rangeText}}</span>
          <button class="cancelBtn btn btn-sm btn-default" type="button" @click="clickAway">{{locale.cancelLabel}}</button>
          <button class="applyBtn btn btn-sm btn-success" :disabled="in_selection" type="button" @click="clickedApply">{{locale.applyLabel}}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import moment from "moment";
  import Calendar from "./Calendar.vue";
  import CalendarTime from "./CalendarTime";
  import CalendarRanges from "./CalendarRanges";
  import {
    localeData,
    nextMonth,
    prevMonth,
    validateDateRange,
    yearMonth
  } from "./util";
  import { mixin as clickaway } from "vue-clickaway";

  export default {
    name: "date-range-picker",
    inheritAttrs: false,
    components: { Calendar, CalendarTime, CalendarRanges },
    mixins: [clickaway],
    model: {
      prop: "dateRange",
      event: "update"
    },
    props: {
      open: {
        type: Boolean,
        default: false
      },
      reportType: {
        type: String,
        default() {
          return "Sales";
        }
      },
      minDate: {
        type: [String, Date],
        default() {
          return null;
        }
      },
      maxDate: {
        type: [String, Date],
        default() {
          return null;
        }
      },
      showWeekNumbers: {
        type: Boolean,
        default: false
      },
      linkedCalendars: {
        type: Boolean,
        default: true
      },
      singleDatePicker: {
        type: Boolean,
        default: false
      },
      showDropdowns: {
        type: Boolean,
        default: false
      },
      timePicker: {
        type: Boolean,
        default: false
      },
      timePickerIncrement: {
        type: Number,
        default: 5
      },
      timePicker24Hour: {
        type: Boolean,
        default: true
      },
      timePickerSeconds: {
        type: Boolean,
        default: false
      },
      autoApply: {
        type: Boolean,
        default: false
      },
      localeData: {
        type: Object,
        default() {
          return {};
        }
      },
      dateRange: {
        // for v-model
        default: null
      },
      ranges: {
        type: [Object, Boolean],
        default() {
          return {
            Today: [moment(), moment()],
            Yesterday: [
              moment().subtract(1, "days"),
              moment().subtract(1, "days")
            ],
            "This month": [moment().startOf("month"), moment().endOf("month")],
            "This year": [moment().startOf("year"), moment().endOf("year")],
            "Last week": [
              moment()
                .subtract(1, "week")
                .startOf("week"),
              moment()
                .subtract(1, "week")
                .endOf("week")
            ],
            "Last month": [
              moment()
                .subtract(1, "month")
                .startOf("month"),
              moment()
                .subtract(1, "month")
                .endOf("month")
            ]
          };
        }
      },
      opens: {
        type: String,
        default: "center"
      }
    },
    data() {
      let data = { locale: localeData(this.localeData) };

      let startDate = this.dateRange.startDate || null;
      let endDate = this.dateRange.endDate || null;

      data.monthDate = startDate ? new Date(startDate) : new Date();
      data.nextMonthDate = nextMonth(data.monthDate);
      data.start = startDate ? new Date(startDate) : null;
      if (this.singleDatePicker) {
        // ignore endDate for singleDatePicker
        data.end = data.start;
      } else {
        data.end = endDate ? new Date(endDate) : null;
      }
      data.in_selection = false;
      // data.open = false;

      data.dateType = "folioDate";

      // update day names order to firstDay
      if (data.locale.firstDay !== 0) {
        let iterator = data.locale.firstDay;
        while (iterator > 0) {
          data.locale.daysOfWeek.push(data.locale.daysOfWeek.shift());
          iterator--;
        }
      }
      return data;
    },
    methods: {
      dateFormat(classes, date) {
        let dt = new Date(date);
        dt.setHours(0, 0, 0, 0);
        let start = new Date(this.start);
        start.setHours(0, 0, 0, 0);
        let end = new Date(this.end);
        end.setHours(0, 0, 0, 0);

        classes["in-range"] = dt >= start && dt <= end;
        // classes['in-range'] = true
        // active: dt.setHours(0, 0, 0, 0) == new Date(this.start).setHours(0, 0, 0, 0) || dt.setHours(0, 0, 0, 0) == new Date(this.end).setHours(0, 0, 0, 0),
        //
        // 'start-date': dt.getTime() === start.getTime(),
        // 'end-date': dt.getTime() === end.getTime(),
        // disabled: (this.minDate && moment(dt).startOf("day").isBefore(moment(this.minDate).startOf("day")))
        //   || (this.maxDate && moment(dt).startOf("day").isAfter(moment(this.maxDate).startOf("day"))),

        return classes;
      },
      changeLeftMonth(value) {
        let newDate = new Date(value.year, value.month, 1);
        this.monthDate = newDate;
        if (
          this.linkedCalendars ||
          yearMonth(this.monthDate) >= yearMonth(this.nextMonthDate)
        ) {
          this.nextMonthDate = validateDateRange(
            nextMonth(newDate),
            this.minDate,
            this.maxDate
          );
          if (yearMonth(this.monthDate) === yearMonth(this.nextMonthDate)) {
            this.monthDate = validateDateRange(
              prevMonth(this.monthDate),
              this.minDate,
              this.maxDate
            );
          }
        }
      },
      changeRightMonth(value) {
        let newDate = new Date(value.year, value.month, 1);
        this.nextMonthDate = newDate;
        if (
          this.linkedCalendars ||
          yearMonth(this.nextMonthDate) <= yearMonth(this.monthDate)
        ) {
          this.monthDate = validateDateRange(
            prevMonth(newDate),
            this.minDate,
            this.maxDate
          );
          if (yearMonth(this.monthDate) === yearMonth(this.nextMonthDate)) {
            this.nextMonthDate = validateDateRange(
              nextMonth(this.nextMonthDate),
              this.minDate,
              this.maxDate
            );
          }
        }
      },
      normalizeDatetime(value, oldValue) {
        let newDate = new Date(value);
        if (this.timePicker && oldValue) {
          newDate.setHours(oldValue.getHours());
          newDate.setMinutes(oldValue.getMinutes());
          newDate.setSeconds(oldValue.getSeconds());
          newDate.setMilliseconds(oldValue.getMilliseconds());
        }

        return newDate;
      },
      dateClick(value) {
        if (this.in_selection) {
          this.in_selection = false;
          this.end = this.normalizeDatetime(value, this.end);

          if (this.end < this.start) {
            this.in_selection = true;
            this.start = this.normalizeDatetime(value, this.start);
          }
          if (!this.in_selection && this.autoApply) {
            this.clickedApply();
          }
        } else {
          this.start = this.normalizeDatetime(value, this.start);
          this.end = this.normalizeDatetime(value, this.end);
          if (!this.singleDatePicker) {
            this.in_selection = true;
          } else if (this.autoApply) {
            this.clickedApply();
          }
        }
      },
      hoverDate(value) {
        let dt = this.normalizeDatetime(value, this.end);
        if (this.in_selection && dt >= this.start) this.end = dt;
      },
      togglePicker(value, event) {
        if (typeof value === "boolean") {
          this.open = value;
        } else {
          this.open = !this.open;
        }

        if (event === true) this.$emit("toggle", this.open, this.togglePicker);
      },
      selectDateType() {
        this.$emit("update", {
          startDate: this.start,
          endDate: this.end,
          dateType: this.dateType
        });
      },
      clickedApply() {
        // this.open = false
        this.nextMonthDate = nextMonth(this.monthDate);
        this.togglePicker(false, true);
        this.$emit("update", {
          startDate: this.start,
          endDate: this.end,
          dateType: this.dateType
        });
      },
      clickAway() {
        if (this.open) {
          // reset start and end
          let startDate = this.dateRange.startDate;
          let endDate = this.dateRange.endDate;
          this.start = startDate ? new Date(startDate) : null;
          this.end = endDate ? new Date(endDate) : null;
          // this.open = false
          this.togglePicker(false, true);
        }
      },
      clickRange(value) {
        this.start = new Date(value[0]);
        this.end = new Date(value[1]);
        this.monthDate = new Date(value[0]);
        if (this.autoApply) this.clickedApply();
      },
      onUpdateStartTime(value) {
        let start = new Date(this.start);
        start.setHours(value.hours);
        start.setMinutes(value.minutes);
        start.setSeconds(value.seconds);

        this.start = start;
      },
      onUpdateEndTime(value) {
        let end = new Date(this.end);
        end.setHours(value.hours);
        end.setMinutes(value.minutes);
        end.setSeconds(value.seconds);

        this.end = end;
      }
    },
    computed: {
      startText() {
        // return this.start.toLocaleDateString()+
        if (this.start === null) return "";
        return moment(this.start).format(this.locale.format);
      },
      endText() {
        if (this.end === null) return "";
        // return new Date(this.end).toLocaleDateString()
        return moment(new Date(this.end)).format(this.locale.format);
      },
      rangeText() {
        let range = this.startText;
        if (!this.singleDatePicker) {
          range += this.locale.separator + this.endText;
        }
        return range;
      },
      min() {
        return this.minDate ? new Date(this.minDate) : null;
      },
      max() {
        return this.maxDate ? new Date(this.maxDate) : null;
      },
      pickerStyles() {
        return {
          "show-calendar": this.open,
          "show-ranges": !!this.ranges,
          "show-weeknumbers": this.showWeekNumbers,
          single: this.singleDatePicker,
          opensright: this.opens === "right",
          opensleft: this.opens === "left",
          openscenter: this.opens === "center",
          linked: this.linkedCalendars
        };
      },
      isClear() {
        return !this.dateRange.startDate || !this.dateRange.endDate;
      }
    },
    created() {
      this.$store.state.bus.$on("reportType", function (reportType) {
        this.reportType = reportType;
      });
      this.$store.state.bus.$on("dateControll", function (openValue) {
        this.open = openValue;
        // this.togglePicker(false, true);
        this.$emit("toggle", this.open, this.togglePicker);
        // console.log("this.open",this.open);
      });
    },
    watch: {
      reportType() {
        if (this.reportType == "Sales") {
          this.dateType = "folioDate";
        }
        if (this.reportType == "Payments") {
          this.dateType = "paymentDate";
        }
      },
      minDate() {
        let dt = validateDateRange(
          this.monthDate,
          this.minDate || new Date(),
          this.maxDate
        );
        this.changeLeftMonth({ year: dt.getFullYear(), month: dt.getMonth() });
      },
      maxDate() {
        let dt = validateDateRange(
          this.nextMonthDate,
          this.minDate,
          this.maxDate || new Date()
        );
        this.changeRightMonth({ year: dt.getFullYear(), month: dt.getMonth() });
      },
      "dateRange.startDate"(value) {
        this.start = !!value && !this.isClear ? new Date(value) : null;
        this.monthDate = new Date(this.start);
        this.nextMonthDate = nextMonth(this.monthDate);
        if (this.isClear) {
          this.start = null;
          this.end = null;
        } else {
          this.start = new Date(this.dateRange.startDate);
          this.end = new Date(this.dateRange.endDate);
        }
      },
      "dateRange.endDate"(value) {
        this.end = !!value && !this.isClear ? new Date(value) : null;
        if (this.isClear) {
          this.start = null;
          this.end = null;
        } else {
          this.start = new Date(this.dateRange.startDate);
          this.end = new Date(this.dateRange.endDate);
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "./DateRangePicker.css";
</style>

<style lang="scss" scoped>
$week-width: 682px - 628px;

.reportrange-text {
  background: #fff;
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  width: 100%;
}

.daterangepicker {
  flex-direction: column;
  display: flex;
  width: auto;

  @media screen and (max-width: 768px) {
    &.show-ranges {
      .drp-calendar.left {
        border-left: 0px;
      }

      .ranges {
        border-bottom: 1px solid #ddd;

        ::v-deep ul {
          display: flex;
          flex-wrap: wrap;
          width: auto;
        }
      }
    }
  }

  @media screen and (min-width: 540px) {
    min-width: 486px;
    &.show-weeknumbers {
      min-width: 490px + $week-width;
    }
  }

  @media screen and (min-width: 768px) {
    &.show-ranges {
      min-width: 628px;

      &.show-weeknumbers {
        min-width: 628px + $week-width;
      }
    }
  }

  &.single {
    @media screen and (max-width: 340px) {
      min-width: 250px;

      &.show-weeknumbers {
        min-width: 250px + $week-width;
      }
    }

    @media screen and (min-width: 339px) {
      min-width: auto;
      &.show-ranges {
        min-width: 328px;

        &.show-weeknumbers {
          min-width: 328px + $week-width;
        }

        .drp-calendar.left {
          border-left: 1px solid #ddd;
        }

        .ranges {
          width: auto;
          max-width: none;
          flex-basis: auto;
          border-bottom: 0;

          ::v-deep ul {
            display: block;
            width: 100%;
          }
        }
      }
    }
  }

  &.show-calendar {
    display: block;
  }
}

.daterangepicker {
  &.opensleft {
    top: 35px;
    right: 10px;
    left: auto;
  }

  &.openscenter {
    top: 35px;
    right: auto;
    left: 50%;
    transform: translate(-50%, 0);
  }

  &.opensright {
    top: 35px;
    left: 10px;
    right: auto;
  }
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.2s ease;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for <2.1.8 */
 {
  transform: translateX(10px);
  opacity: 0;
}

.vue-daterange-picker {
  position: relative;
  display: inline-block;
}
</style>
