(function (vc) {
    vc.extends({
        data: {
            editScheduleClassesDayInfo: {
                workday: '',
                workdayName: '',
                times: [],
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editScheduleClassesDay', 'notify', function (_param) {
                $that.editScheduleClassesDayInfo = _param;
                if(!_param.times || _param.times.length == 0){
                    $that.editScheduleClassesDayInfo.times.push(
                        {
                            id:vc.uuid(),
                            startTime:'',
                            endTime:''
                        }
                    )
                }
                $('#editScheduleClassesDayModel').modal('show');

                setTimeout(function(){
                    $that._initEditScheduleClassesDayDate();
                },1000);
            });
        },
        methods: {

            _changeScheduleClassesDayState:function(){

                if($that.editScheduleClassesDayInfo.workday == '2002'){
                    $that.editScheduleClassesDayInfo.times.splice(0,$that.editScheduleClassesDayInfo.times.length);
                    $that.editScheduleClassesDayInfo.workdayName = '休息';
                    return ;
                }
                $that.editScheduleClassesDayInfo.workdayName = '正常上下班';

                setTimeout(function(){
                    $that._initEditScheduleClassesDayDate();
                },1000);
            },

            _initEditScheduleClassesDayDate:function(){
                console.log(123123)
                $that.editScheduleClassesDayInfo.times.forEach(time => {
                    vc.initHourMinute('startTime'+time.id,function(_value){
                        if(!_value){
                            return;
                        }
                        time.startTime = _value;
                    });
                    vc.initHourMinute('endTime'+time.id,function(_value){
                        if(!_value){
                            return;
                        }
                        time.endTime = _value;
                    })
                });
            },
            _summitEditScheduleClassesDay:function(){
                $that.$for
            }
            
        }
    });
})(window.vc);
