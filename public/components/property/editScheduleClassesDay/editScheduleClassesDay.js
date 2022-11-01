(function (vc) {
    vc.extends({
        data: {
            editScheduleClassesDayInfo: {
                workday: '',
                workdayName: '',
                times: [],
                classess: [],
            }
        },
        _initMethod: function () {
            
        },
        _initEvent: function () {
            vc.on('editScheduleClassesDay', 'notify', function (_param) {
                $that.editScheduleClassesDayInfo = _param;
                $that._listClassess();
                $('#editScheduleClassesDayModel').modal('show');

               
            });
        },
        methods: {

            _changeScheduleClassesDayState:function(){
                $that.editScheduleClassesDayInfo.times.splice(0,$that.editScheduleClassesDayInfo.times.length);
                if($that.editScheduleClassesDayInfo.workday == '2002'){
                    $that.editScheduleClassesDayInfo.workdayName = '休息';
                    return ;
                }
                let _classes  = $that.editScheduleClassesDayInfo.classess;
                _classes.forEach(item => {
                    if($that.editScheduleClassesDayInfo.workday == item.classesId){
                        $that.editScheduleClassesDayInfo.workdayName = item.name;
                        item.times.forEach(time=>{
                            $that.editScheduleClassesDayInfo.times.push(time);
                        })
                    }
                });
            },
            _summitEditScheduleClassesDay:function(){
           
            },
            _listClassess: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100
                    }
                };

                //发送get请求
                vc.http.apiGet('/classes.listClasses',
                    param,
                    function (json, res) {
                        let _classesManageInfo = JSON.parse(json);
                        vc.component.editScheduleClassesDayInfo.classess = _classesManageInfo.data;
                        $that.$forceUpdate();
                        
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            
        }
    });
})(window.vc);
