(function (vc) {
    vc.extends({
        data: {
            scheduleClassesMonthInfo: {
                scheduleCycle:1,
                days:[]
            }
        },
        _initMethod: function () {
           
        },
        _initEvent: function () {
           
            vc.on("scheduleClassesMonthInfo", "notify", function (_param) {
                $that.scheduleClassesMonthInfo.days = _param.days;
                $that.scheduleClassesMonthInfo.scheduleCycle = _param.scheduleCycle;


                if(_param.days && _param.days.length>0){
                    return ;
                }
                $that._changeInspectionPeriodMonth();
            });
        },
        methods: {

            _changeInspectionPeriodMonth:function(){
                let _days = $that.scheduleClassesMonthInfo.days;
                _days.splice(0,_days.length);
                for(let cycleIndex = 0; cycleIndex  < 31; cycleIndex++){
                    _days.push({
                        day:cycleIndex+1,
                        workday:'2002',
                        workdayName:'休息',
                        times:[]
                    })
                }
            },
            _changeWorkdayMonthInfo:function(item){
                vc.emit('editScheduleClassesDay', 'notify',item);
            }
            
        }
    });
})(window.vc);