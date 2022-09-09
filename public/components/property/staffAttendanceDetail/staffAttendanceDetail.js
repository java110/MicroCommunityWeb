(function(vc) {
    vc.extends({
        data: {
            staffAttendanceDetailInfo: {
                details: []
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('staffAttendanceDetail', 'openModel', function(_param) {
                $('#staffAttendanceDetailModel').modal('show');
                $that.staffAttendanceDetailInfo.details = [];
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
                        vc.component.staffAttendanceDetailInfo.details = _attendanceLogManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }

    });
})(window.vc);