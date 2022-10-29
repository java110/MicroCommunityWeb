(function (vc) {
    vc.extends({
        data: {
            addScheduleClassesInfo: {
                name:'',
                scheduleType:'',
                scheduleCycle:'1',
                days:[]
            }
        },
        _initMethod: function () {
            
        },
        _initEvent: function () {

            vc.on('addScheduleClasses','notifyScheduleCycle',function(_cycle){
                $that.addScheduleClassesInfo.scheduleCycle = _cycle
            })
            
        },
        methods: {
            _changeScheduleType: function () {

                if($that.addScheduleClassesInfo.scheduleType == '1001'){
                    vc.emit("scheduleClassesDayInfo", "notify",{
                        scheduleCycle:$that.addScheduleClassesInfo.scheduleCycle,
                        days:$that.addScheduleClassesInfo.days
                    })
                }

                if($that.addScheduleClassesInfo.scheduleType == '2002'){
                    vc.emit("scheduleClassesDayInfo", "notify",{
                        scheduleCycle:$that.addScheduleClassesInfo.scheduleCycle,
                        days:$that.addScheduleClassesInfo.days
                    })
                }

                if($that.addScheduleClassesInfo.scheduleType == '3003'){
                    vc.emit("scheduleClassesMonthInfo", "notify",{
                        scheduleCycle:$that.addScheduleClassesInfo.scheduleCycle,
                        days:$that.addScheduleClassesInfo.days
                    })
                }
              
            },
            saveScheduleClassesInfo: function () {
                //不提交数据将数据 回调给侦听处理
                vc.http.apiPost(
                    '/scheduleClasses.saveScheduleClasses',
                    JSON.stringify(vc.component.addScheduleClassesInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('成功');
                            vc.goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
        }
    });
})(window.vc);