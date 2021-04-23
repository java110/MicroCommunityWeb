/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            attendanceLogManageInfo: {
                attendances: [],
                total: 0,
                records: 1,
                moreCondition: false,
                classesId: '',
                conditions: {
                    classesName: '',
                    departmentName: '',
                    date: vc.dateFormat(new Date())
                }
            }
        },
        _initMethod: function () {
            vc.component._listAttendanceLogs(DEFAULT_PAGE, DEFAULT_ROWS);

            vc.initDate('queryDate',function(value){
                $that.attendanceLogManageInfo.conditions.date = value;
            });
        },
        _initEvent: function () {

            vc.on('attendanceLogManage', 'listAttendanceLog', function (_param) {
                vc.component._listAttendanceLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAttendanceLogs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAttendanceLogs: function (_page, _rows) {

                vc.component.attendanceLogManageInfo.conditions.page = _page;
                vc.component.attendanceLogManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.attendanceLogManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/attendanceClass/queryAttendanceLog',
                    param,
                    function (json, res) {
                        var _attendanceLogManageInfo = JSON.parse(json);
                        vc.component.attendanceLogManageInfo.total = _attendanceLogManageInfo.total;
                        vc.component.attendanceLogManageInfo.records = _attendanceLogManageInfo.records;
                        vc.component.attendanceLogManageInfo.attendances = _attendanceLogManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.attendanceLogManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
          
            _queryAttendanceLogMethod: function () {
                vc.component._listAttendanceLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.attendanceLogManageInfo.moreCondition) {
                    vc.component.attendanceLogManageInfo.moreCondition = false;
                } else {
                    vc.component.attendanceLogManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
