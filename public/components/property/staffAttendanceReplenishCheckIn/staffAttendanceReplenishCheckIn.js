(function(vc) {
    vc.extends({
        data: {
            staffAttendanceReplenishCheckInInfo: {
                details: [],
                remark: '',
                detailId: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('staffAttendanceReplenishCheckIn', 'openModel', function(_param) {
                $('#staffAttendanceReplenishCheckInModel').modal('show');
                $that.staffAttendanceReplenishCheckInInfo.details = _param;
            });
        },
        methods: {

            _doReplenishCheckIn: function() {
                let _data = {
                    detailId: $that.staffAttendanceReplenishCheckInInfo.detailId,
                    remark: $that.staffAttendanceReplenishCheckInInfo.remark
                }

                vc.http.apiPost(
                    '/attendanceClasses.attendanceReplenishCheckIn',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#staffAttendanceReplenishCheckInModel').modal('hide');
                            vc.emit('staffAttendanceManage', 'listMonthAttendance', {});
                            vc.toast("添加成功");
                            return;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            }

        }

    });
})(window.vc);