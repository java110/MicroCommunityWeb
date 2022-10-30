(function (vc) {
    vc.extends({
        data: {
            staffScheduleClassesInfo: {
                staffId:'',
                scheduleId:'',
                name:'',
                scheduleType:'',
                scheduleCycle:'1',
                days:[]
            }
        },
        _initMethod: function () {
            $that.staffScheduleClassesInfo.staffId = vc.getParam('staffId');
            if(!$that.staffScheduleClassesInfo.staffId){
                return ;
            }
            $that._loadStaffScheduleClasses();
            
        },
        _initEvent: function () {
            
        },
        methods: {
            _changeScheduleType: function () {

                if($that.staffScheduleClassesInfo.scheduleType == '1001'){
                    vc.emit("scheduleClassesDayInfo", "notify",{
                        scheduleCycle:$that.staffScheduleClassesInfo.scheduleCycle,
                        days:$that.staffScheduleClassesInfo.days
                    })
                }

                if($that.staffScheduleClassesInfo.scheduleType == '2002'){
                    vc.emit("scheduleClassesWeekInfo", "notify",{
                        scheduleCycle:$that.staffScheduleClassesInfo.scheduleCycle,
                        days:$that.staffScheduleClassesInfo.days
                    })
                }

                if($that.staffScheduleClassesInfo.scheduleType == '3003'){
                    vc.emit("scheduleClassesMonthInfo", "notify",{
                        scheduleCycle:$that.staffScheduleClassesInfo.scheduleCycle,
                        days:$that.staffScheduleClassesInfo.days
                    })
                }
            },
            _loadStaffScheduleClasses: function () {
                let param = {
                    params: {
                        staffId: $that.staffDetailInfo.staffId,
                        page:1,
                        row:1
                    }
                };
                //发送get请求
                vc.http.apiGet('/scheduleClasses.listScheduleClassesStaff',
                    param,
                    function (json) {
                        let _staffDetailInfo = JSON.parse(json);
                        if(!_staffDetailInfo.data || _staffDetailInfo.data.length  < 1){
                            return;
                        }
                        $that.staffScheduleClassesInfo.scheduleId = _staffDetailInfo.data[0].scheduleId;
                        $that._listScheduleClassess();
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _listScheduleClassess: function () {
                let param = {
                    params: {
                        page:1,
                        row:1,
                        scheduleId:$that.staffScheduleClassesInfo.scheduleId
                    }
                };
                //发送get请求
                vc.http.apiGet('/scheduleClasses.listScheduleClasses',
                    param,
                    function (json, res) {
                        let _scheduleClassesInfo = JSON.parse(json);
                       vc.copyObject(_scheduleClassesInfo.data[0],$that.staffScheduleClassesInfo);
                       $that._listScheduleClassesDays();
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
                        scheduleId:$that.staffScheduleClassesInfo.scheduleId
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

                        $that.staffScheduleClassesInfo.days  = _scheduleClassesInfo.data;

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