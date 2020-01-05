<template src="./datePicker.template.html"></template>
<script type="text/javascript">
    import moment from 'moment-timezone'

    export default {
        name: "datePickerComponent",
        props: ["keyString", "value", "onUpdate", "format", "sourceFormat", "pickerType", "isDisabled", "isRequired", "errorMessage", "showErrorMessage", "objectPassedToParent", "disablePreviousDates", "disableFutureDates", "defaultValue", "minimumDate", "maximumDate"],
        data() {
            return {
                control: null,
                isChanging: false
            };
        },
        methods: {
            updateValue(momentDateTime) {
                this.onUpdate(this.keyString, momentDateTime, this.objectPassedToParent);
            },
            isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
        },
        computed: {
            // format(){
            //     return 'HH:MM';
            // }
        },
        mounted() {
            let options = {
                format: this.format,
                useCurrent: false,
                showClear: true,
                showClose: false,
                showTodayButton: true,
                icons: {
                    time: 'fa fa-clock-o',
                    date: 'fa fa-calendar',
                    up: 'fa fa-chevron-up',
                    down: 'fa fa-chevron-down',
                    previous: 'fa fa-chevron-left',
                    next: 'fa fa-chevron-right',
                    today: 'fa fa-dot-circle-o',
                    clear: 'fa fa-trash',
                    close: 'far fa-times'
                },
                minDate: this.minimumDate && moment(this.minimumDate)._isValid ? this.minimumDate : moment(),
                // maxDate: this.maximumDate,
                inline: false,
                ignoreReadonly: true,
                allowInputToggle: true,
                widgetPositioning: {
                    horizontal: 'right',
                    vertical: 'bottom'
                }
            };

            $(this.$el).datetimepicker(options);
            this.control = $(this.$el).data("DateTimePicker");
            this.control.hide();

            //set date if available
            if (this.value && this.value != "") {
                //console.log(moment(this.value));
                if (this.pickerType == 'date') {
                    this.control.date(this.sourceFormat ? moment(this.value, this.sourceFormat).format(this.format) : moment(this.value).format(this.format));
                    if (this.maximumDate){
                        $(this.$el).data("DateTimePicker").maxDate(moment(this.maximumDate).format("Do MMM, YYYY"));
                    }
                    
                    if (this.minimumDate){
                        $(this.$el).data("DateTimePicker").minDate(moment(this.minimumDate).format("Do MMM, YYYY"));
                    }
                       
                }
                else {
                    let someDate = new Date();
                    let savedTime = this.value.split(":");
                    someDate.setHours(savedTime[0]);
                    someDate.setMinutes(savedTime[1]);
                    this.control.date(moment(someDate));
                }

            }
            if (this.pickerType == 'date') {
                    this.control.date(this.sourceFormat ? moment(this.value, this.sourceFormat).format(this.format) : moment(this.value).format(this.format));
                    if (this.maximumDate){
                        $(this.$el).data("DateTimePicker").maxDate(moment(this.maximumDate).format("DD MMM YYYY"));
                    }
                    
                    if (this.minimumDate){
                        $(this.$el).data("DateTimePicker").minDate(moment(this.minimumDate).format("DD MMM YYYY"));
                    }
                       
                }
            else if (this.defaultValue == 'today') {
                if (this.pickerType == 'date')
                    this.control.date(this.sourceFormat ? moment().format(this.format) : moment().format(this.format));
            }

            $(this.$el).on("dp.show", function () {
                //console.log("showed");
            });
            let me = this;
            $(this.$el).on("dp.change", function () {
                if (!me.isChanging) {
                    me.isChanging = true;
                    me.$nextTick(function () {
                        me.isChanging = false;
                        if (me.updateValue) {

                            me.updateValue(me.control.date());
                        }
                    });
                }
            });

            // if (me.disablePreviousDates)
            //     $(me.$el).data("DateTimePicker").minDate(new Date());

            // if(me.disableFutureDates)
            //     $(me.$el).data("DateTimePicker").maxDate(new Date());

            $(function () {
                $(this.$el).datetimepicker();

                // $('#checkOutDate').datetimepicker({
                //     useCurrent: false //Important! See issue #1075
                // });
                $(".newFolio:visible:last .input-group").focusin(function () {
                    //console.log("Input Clicked *******$$$$$$$$$$**********");
                    $(this).parent().parent().addClass("expandIt");
                    $(".folioBody").scrollTop(+150);
                });
                $(".newFolio:visible:last .input-group").focusout(function () {
                    // console.log("Input Clicked *******$$$$$$$$$$**********");
                    $(this).parent().parent().removeClass("expandIt");

                });
                // $(".checkInDate").on("dp.change", function (e) {
                //     console.log(e.date);
                //     $('.checkOutDate').data("DateTimePicker").minDate(e.date);
                // });
                // $(".checkOutDate").on("dp.change", function (e) {
                //     $('.checkInDate').data("DateTimePicker").maxDate(e.date);
                // });
            });
            //     $(function () {

            //         $('.datetimepicker').datetimepicker({  minDate:new Date()});
            //   });
        },
        watch: {
            // format(newFormat) {
            //     console.log(newFormat);
            //     this.control.format(newFormat)
            // },
            value(newValue) {
                //set date if changed
                if(moment() instanceof moment){
                    this.control.date(newValue);
                }
                else{
                    this.control.date(newValue ? (this.sourceFormat ? moment(newValue, this.sourceFormat).format(this.format) : moment(newValue).format(this.format)) : null);
                }
                
                // if (this.maximumDate)
                //     $(this.$el).data("DateTimePicker").maxDate(this.maximumDate);
                // if (this.minimumDate)
                //     $(this.$el).data("DateTimePicker").minDate(this.minimumDate);


                //console.log(newValue);
            },
            maximumDate(maxDate) {
                if (maxDate)
                    $(this.$el).data("DateTimePicker").maxDate(moment(maxDate).format("Do MMM, YYYY"));
            },
            minimumDate(minDate) {
                if (minDate)
                    $(this.$el).data("DateTimePicker").minDate(moment(minDate).format("Do MMM, YYYY"));
            }
            // isDisabled: {
            //     handler: function (check) {
            //         console.log(check);
            //     },
            //     deep: true
            // }
        },
        destroyed() {
            //this.control.destroy();
            //console.log("date destroyed: ", this.control)
        }
    };

</script>