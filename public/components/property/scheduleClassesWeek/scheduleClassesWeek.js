(function (vc) {
    vc.extends({
        data: {
            scheduleClassesWeekInfo: {
                scheduleCycle: 1,
                days: []
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {

            vc.on("scheduleClassesWeekInfo", "notify", function (_param) {
                $that.scheduleClassesWeekInfo.days = _param.days;
                $that.scheduleClassesWeekInfo.scheduleCycle = parseInt(_param.scheduleCycle);

                if (_param.days && _param.days.length > 0) {
                    return;
                }
                $that._changeInspectionPeriodWeek();
            });
        },
        methods: {

            _changeInspectionPeriodWeek: function () {
                let _days = $that.scheduleClassesWeekInfo.days;
                _days.splice(0, _days.length);
                for (let weekIndex = 0; weekIndex < $that.scheduleClassesWeekInfo.scheduleCycle; weekIndex++) {
                    for (let cycleIndex = 0; cycleIndex < 7; cycleIndex++) {
                        _days.push({
                            weekFlag: weekIndex+1,
                            day: cycleIndex + 1,
                            workday: '1001',
                            workdayName: '正常上下班',
                            times: [{
                                id: vc.uuid(),
                                startTime: '08:30',
                                endTime: '18:00'
                            }]
                        })
                    }
                }
                vc.emit('addScheduleClasses', 'notifyScheduleCycle', $that.scheduleClassesWeekInfo.scheduleCycle);
            },
            _changeWorkdayWeekInfo: function (item) {
                vc.emit('editScheduleClassesDay', 'notify', item);
            }

        }
    });
})(window.vc);