(function(vc) {
    vc.extends({
        data: {
            staffAttendanceManageInfo: {
                details: []
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('staffAttendanceManage', 'openModel', function(_param) {
                $('#staffAttendanceManageModel').modal('show');
                $that.staffAttendanceManageInfo.feeDetailDiscounts = [];
                vc.component._loadStaffAttendanceDetailInfo(_param);
            });
        },
        methods: {
            _loadStaffAttendanceDetailInfo: function(_param) {
                var param = {
                    params: {
                        page: 1,
                        row: 30,
                        communityId: vc.getCurrentCommunity().communityId,
                        staffId: _param.staffId,
                        date: _param.date,
                    }
                };
                //发送get请求
                vc.http.apiGet('/attendanceClass/queryAttendanceLog',
                    param,
                    function(json, res) {
                        let _attendanceLogManageInfo = JSON.parse(json);
                        vc.component.staffAttendanceManageInfo.details = _attendanceLogManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }

    });
})(window.vc);