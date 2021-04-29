/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            attendanceClassesManageInfo: {
                attendanceClassess: [],
                total: 0,
                records: 1,
                moreCondition: false,
                classesId: '',
                conditions: {
                    classesName: '',
                    classesId: '',
                    clockType: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listAttendanceClassess(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('attendanceClassesManage', 'listAttendanceClasses', function (_param) {
                vc.component._listAttendanceClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAttendanceClassess(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAttendanceClassess: function (_page, _rows) {

                vc.component.attendanceClassesManageInfo.conditions.page = _page;
                vc.component.attendanceClassesManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.attendanceClassesManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('attendanceClasses.listAttendanceClassess',
                    param,
                    function (json, res) {
                        var _attendanceClassesManageInfo = JSON.parse(json);
                        vc.component.attendanceClassesManageInfo.total = _attendanceClassesManageInfo.total;
                        vc.component.attendanceClassesManageInfo.records = _attendanceClassesManageInfo.records;
                        vc.component.attendanceClassesManageInfo.attendanceClassess = _attendanceClassesManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.attendanceClassesManageInfo.records,
                            dataCount: vc.component.attendanceClassesManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAttendanceClassesModal: function () {
                vc.emit('addAttendanceClasses', 'openAddAttendanceClassesModal', {});
            },
            _openEditAttendanceClassesModel: function (_attendanceClasses) {
                vc.emit('editAttendanceClasses', 'openEditAttendanceClassesModal', _attendanceClasses);
            },
            _openDeleteAttendanceClassesModel: function (_attendanceClasses) {
                vc.emit('deleteAttendanceClasses', 'openDeleteAttendanceClassesModal', _attendanceClasses);
            },
            _queryAttendanceClassesMethod: function () {
                vc.component._listAttendanceClassess(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.attendanceClassesManageInfo.moreCondition) {
                    vc.component.attendanceClassesManageInfo.moreCondition = false;
                } else {
                    vc.component.attendanceClassesManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
