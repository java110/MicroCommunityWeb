/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            todayAttendanceManageInfo: {
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
            vc.component._listTodayAttendances(DEFAULT_PAGE, DEFAULT_ROWS);

            vc.initDate('queryDate',function(value){
                $that.todayAttendanceManageInfo.conditions.date = value;
            });
        },
        _initEvent: function () {

            vc.on('todayAttendanceManage', 'listTodayAttendance', function (_param) {
                vc.component._listTodayAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listTodayAttendances(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listTodayAttendances: function (_page, _rows) {

                vc.component.todayAttendanceManageInfo.conditions.page = _page;
                vc.component.todayAttendanceManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.todayAttendanceManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/attendanceClass/queryAttendanceClassesTask',
                    param,
                    function (json, res) {
                        var _todayAttendanceManageInfo = JSON.parse(json);
                        vc.component.todayAttendanceManageInfo.total = _todayAttendanceManageInfo.total;
                        vc.component.todayAttendanceManageInfo.records = _todayAttendanceManageInfo.records;
                        vc.component.todayAttendanceManageInfo.attendances = _todayAttendanceManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.todayAttendanceManageInfo.records,
                            dataCount: vc.component.todayAttendanceManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAttendanceDetailModel: function (_attendance) {
                vc.emit('todayAttendanceDetail', 'openTodayAttendanceDetail', _attendance);
            },
            _queryTodayAttendanceMethod: function () {
                vc.component._listTodayAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.todayAttendanceManageInfo.moreCondition) {
                    vc.component.todayAttendanceManageInfo.moreCondition = false;
                } else {
                    vc.component.todayAttendanceManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
