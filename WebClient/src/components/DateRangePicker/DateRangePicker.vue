<template>
  <div style="position: relative; display: inline-block;">
    <div class="reportrange-text" @click="togglePicker" style="padding: 6px 15px;">
      <slot name="input">
        <i class="glyphicon glyphicon-calendar far fa-calendar-alt"></i>
        <span style="font-size: 14px; font-weight: 400; color: #495057;">{{startText}} - {{endText}}</span>
        <b class="caret"></b>
      </slot>
    </div>
    <transition name="slide-fade" mode="out-in">
      <div
        class="daterangepicker dropdown-menu ltr"
        :class="pickerStyles()"
        v-if="open"
        v-on-clickaway="clickAway"
      >
        <div class="calendar left">
          <!-- <div class="daterangepicker_input hidden-xs">
                        <input class="input-mini form-control" type="text" name="daterangepicker_start"
                               :value="startText"/>
                        <i class="far fa-calendar-alt glyphicon glyphicon-calendar"></i>
          </div>-->
          <div class="calendar-table">
            <calendar
              :monthDate="monthDate"
              :locale="locale"
              :start="start"
              :end="end"
              @nextMonth="nextMonth"
              @prevMonth="prevMonth"
              @dateClick="dateClick"
              @hoverDate="hoverDate"
            ></calendar>
          </div>
        </div>

        <div class="calendar right hidden-xs">
          <!-- <div class="daterangepicker_input">
                        <input class="input-mini form-control" type="text" name="daterangepicker_end"
                               :value="endText"/>
                        <i class="far fa-calendar-alt glyphicon glyphicon-calendar"></i>
          </div>-->
          <div class="calendar-table">
            <calendar
              :monthDate="nextMonthDate"
              :locale="locale"
              :start="start"
              :end="end"
              @nextMonth="nextMonth"
              @prevMonth="prevMonth"
              @dateClick="dateClick"
              @hoverDate="hoverDate"
            ></calendar>
          </div>
        </div>

        <calendar-ranges
          :canSelect="in_selection"
          @clickCancel="open=false"
          @clickRange="clickRange"
          @clickApply="clickedApply"
          :ranges="ranges"
          class="hidden-xs"
        ></calendar-ranges>
      </div>
    </transition>
  </div>
</template>
<style>
@import "./DateRangePicker.css";
</style>
<script>
import moment from "moment";
import Calendar from "./Calendar.vue";
import CalendarRanges from "./CalendarRanges";
import { nextMonth, prevMonth } from "./util";
import { mixin as clickaway } from "vue-clickaway";

export default {
  name: "date-range-picker",
  components: { Calendar, CalendarRanges },
  mixins: [clickaway],
  props: {
    localeData: {
      type: Object,
      default() {
        return {};
      }
    },
    startDate: {
      default() {
        return new Date();
      }
    },
    endDate: {
      default() {
        return new Date();
      }
    },
    ranges: {
      type: Object,
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
    let default_locale = {
      direction: "ltr",
      format: moment.localeData().longDateFormat("L"),
      separator: " - ",
      applyLabel: "Apply",
      cancelLabel: "Cancel",
      weekLabel: "W",
      customRangeLabel: "Custom Range",
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: moment.localeData().firstDayOfWeek()
    };

    // let data = { locale: _locale }
    let data = { locale: { ...default_locale, ...this.localeData } };

    data.monthDate = new Date(this.startDate);
    data.start = new Date(this.startDate);
    data.end = new Date(this.endDate);
    data.in_selection = false;
    data.open = false;

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
    nextMonth() {
      this.monthDate = nextMonth(this.monthDate);
    },
    prevMonth() {
      this.monthDate = prevMonth(this.monthDate);
    },
    dateClick(value) {
      if (this.in_selection) {
        this.in_selection = false;
        this.end = new Date(value);
        if (this.end < this.start) {
          this.in_selection = true;
          this.start = new Date(value);
        } else {
          this.open = false;
        }
        this.$emit("availability");
        this.$emit("update", { startDate: this.start, endDate: this.end });
      } else {
        this.in_selection = true;
        this.start = new Date(value);
        this.end = new Date(value);
        this.$emit("update", { startDate: this.start, endDate: this.end });
      }
    },
    hoverDate(value) {
      let dt = new Date(value);
      if (this.in_selection && dt > this.start) {
        this.end = dt;
        this.$emit("update", { startDate: this.start, endDate: this.end });
      }
    },
    togglePicker() {
      this.open = !this.open;
    },
    pickerStyles() {
      return {
        "show-calendar": this.open,
        opensright: this.opens === "right",
        opensleft: this.opens === "left",
        openscenter: this.opens === "center"
      };
    },
    clickedApply() {
      this.open = false;
      this.$emit("update", { startDate: this.start, endDate: this.end });
    },
    clickAway() {
      if (this.open) {
        this.open = false;
      }
    },
    clickRange(value) {
      this.start = new Date(value[0]);
      this.end = new Date(value[1]);
      this.monthDate = new Date(value[0]);
      this.open = false;
      this.clickedApply();
    },
    setCustomDates() {
      if (this.startDate == null) {
        this.start = null;
      } else {
        this.start = new Date(this.startDate);
      }

      if (this.endDate == null) {
        this.end = null;
      } else {
        this.end = new Date(this.endDate);
      }
    }
  },
  computed: {
    nextMonthDate() {
      return nextMonth(this.monthDate);
    },
    startText() {
      return moment(this.start).format("DD MMM YYYY"); //toLocaleDateString();
    },
    endText() {
      return moment(this.end).format("DD MMM YYYY"); //.toLocaleDateString();
    }
  },
  watch: {
    startDate(value) {
      this.start = new Date(value);
    },
    endDate(value) {
      this.end = new Date(value);
    }
  },
  mounted() {
    // this.setCustomDates()
  }
};
</script>

<style>
.range_inputs {
  margin-bottom: 10px;
}

.reportrange-text {
  background: #fff;
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  width: 100%;
}

.daterangepicker.show-calendar {
  display: inline-flex;
}

.daterangepicker .ranges {
  width: 160px;
}

.ranges {
  width: 130px;
}

.show-calendar {
  display: block;
  width: auto;
}

div.daterangepicker.opensleft {
  top: 35px;
  right: 10px;
  left: auto;
}

div.daterangepicker.openscenter {
  top: 35px;
  right: auto;
  left: 50%;
  transform: translate(-50%, 0);
}

div.daterangepicker.opensright {
  top: 35px;
  left: 10px;
  right: auto;
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
</style>
