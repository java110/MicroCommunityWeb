(function (vc) {
    vc.extends({
        data: {
            editScheduleClassesInfo: {
                scheduleId:'',
                name:'',
                scheduleType:'',
                scheduleCycle:'1',
                days:[]
            }
        },
        _initMethod: function () {
            $that.editScheduleClassesInfo.scheduleId = vc.getParam('scheduleId');
            $that._listScheduleClassess();
            $that._listScheduleClassesDays();
            
        },
        _initEvent: function () {

            vc.on('editScheduleClasses','notifyScheduleCycle',function(_cycle){
                $that.editScheduleClassesInfo.scheduleCycle = _cycle
            })
            
        },
        methods: {
            _changeScheduleType: function () {
                $that.editScheduleClassesInfo.days = [];
                if($that.editScheduleClassesInfo.scheduleType == '1001'){
                    vc.emit("scheduleClassesDayInfo", "notify",{
                        scheduleCycle:$that.editScheduleClassesInfo.scheduleCycle,
                        days:$that.editScheduleClassesInfo.days
                    })
                }

                if($that.editScheduleClassesInfo.scheduleType == '2002'){
                    vc.emit("scheduleClassesWeekInfo", "notify",{
                        scheduleCycle:$that.editScheduleClassesInfo.scheduleCycle,
                        days:$that.editScheduleClassesInfo.days
                    })
                }

                if($that.editScheduleClassesInfo.scheduleType == '3003'){
                    vc.emit("scheduleClassesMonthInfo", "notify",{
                        scheduleCycle:$that.editScheduleClassesInfo.scheduleCycle,
                        days:$that.editScheduleClassesInfo.days
                    })
                }
              
            },
            _editScheduleClassesInfo: function () {
                //不提交数据将数据 回调给侦听处理
                vc.http.apiPost(
                    '/scheduleClasses.updateScheduleClasses',
                    JSON.stringify(vc.component.editScheduleClassesInfo), {
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
            _listScheduleClassess: function () {
                let param = {
                    params: {
                        page:1,
                        row:1,
                        scheduleId:$that.editScheduleClassesInfo.scheduleId
                    }
                };
                //发送get请求
                vc.http.apiGet('/scheduleClasses.listScheduleClasses',
                    param,
                    function (json, res) {
                        let _scheduleClassesInfo = JSON.parse(json);
                       vc.copyObject(_scheduleClassesInfo.data[0],$that.editScheduleClassesInfo);
                       $that._changeScheduleType();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listScheduleClassesDays: function () {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        scheduleId:$that.editScheduleClassesInfo.scheduleId
                    }
                };
                //发送get请求
                vc.http.apiGet('/scheduleClasses.listScheduleClassesDay',
                    param,
                    function (json, res) {
                        let _scheduleClassesInfo = JSON.parse(json);

                        _scheduleClassesInfo.data.forEach(item => {
                            if(item.workday == '1001'){
                                item.workdayName = '正常上下班';
                            }else{
                                item.workdayName = '休息';
                            }
                        });

                        $that.editScheduleClassesInfo.days  = _scheduleClassesInfo.data;

                        $that._changeScheduleType();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);