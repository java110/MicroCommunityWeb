(function (vc) {
    vc.extends({
        data: {
            scheduleClassesDayInfo: {
                scheduleCycle:1,
                days:[]
            }
        },
        _initMethod: function () {
           
        },
        _initEvent: function () {
           
            vc.on("scheduleClassesDayInfo", "notify", function (_param) {
                $that.scheduleClassesDayInfo.days = _param.days;
                $that.scheduleClassesDayInfo.scheduleCycle = _param.scheduleCycle;

                if(_param.days && _param.days.length>0){
                    return ;
                }

                $that._changeInspectionPeriod();
            });
        },
        methods: {

            _changeInspectionPeriod:function(){
                let _days = $that.scheduleClassesDayInfo.days;
                _days.splice(0,_days.length);
                for(let cycleIndex = 0; cycleIndex  < $that.scheduleClassesDayInfo.scheduleCycle; cycleIndex++){
                    _days.push({
                        day:cycleIndex+1,
                        workday:'2002',
                        workdayName:'休息',
                        times:[]
                    })
                }

                vc.emit('addScheduleClasses','notifyScheduleCycle',$that.scheduleClassesDayInfo.scheduleCycle);
                vc.emit('editScheduleClasses','notifyScheduleCycle',$that.scheduleClassesDayInfo.scheduleCycle);

            },
            _changeWorkdayInfo:function(item){
                vc.emit('editScheduleClassesDay', 'notify',item);
            }
            
        }
    });
})(window.vc);