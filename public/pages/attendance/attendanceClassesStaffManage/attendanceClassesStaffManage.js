/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            attendanceClassesStaffManageInfo: {
                attendanceClassesStaffs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                csId: '',
                attendanceClassess: [],
                conditions: {
                    classesId: '',
                    staffId: '',
                    staffNameLike: '',
                }
            }
        },
        _initMethod: function() {
            $that._loadAttendanceClass();
        },
        _initEvent: function() {

            vc.on('attendanceClassesStaffManage', 'listAttendanceClassesStaff', function(_param) {
                vc.component._listAttendanceClassesStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listAttendanceClassesStaffs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAttendanceClassesStaffs: function(_page, _rows) {
                vc.component.attendanceClassesStaffManageInfo.conditions.page = _page;
                vc.component.attendanceClassesStaffManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.attendanceClassesStaffManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/attendanceClasses.listAttendanceClassesStaff',
                    param,
                    function(json, res) {
                        var _attendanceClassesStaffManageInfo = JSON.parse(json);
                        vc.component.attendanceClassesStaffManageInfo.total = _attendanceClassesStaffManageInfo.total;
                        vc.component.attendanceClassesStaffManageInfo.records = _attendanceClassesStaffManageInfo.records;
                        vc.component.attendanceClassesStaffManageInfo.attendanceClassesStaffs = _attendanceClassesStaffManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.attendanceClassesStaffManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAttendanceClassesStaffModal: function() {
                vc.jumpToPage('/#/pages/attendance/addAttendanceClassesStaff?classesId=' + $that.attendanceClassesStaffManageInfo.conditions.classesId);
            },
            _openDeleteAttendanceClassesStaffModel: function(_attendanceClassesStaff) {
                vc.emit('deleteAttendanceClassesStaff', 'openDeleteAttendanceClassesStaffModal', _attendanceClassesStaff);
            },
            _queryAttendanceClassesStaffMethod: function() {
                vc.component._listAttendanceClassesStaffs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.attendanceClassesStaffManageInfo.moreCondition) {
                    vc.component.attendanceClassesStaffManageInfo.moreCondition = false;
                } else {
                    vc.component.attendanceClassesStaffManageInfo.moreCondition = true;
                }
            },
            swatchClass: function(_attendanceClass) {
                $that.attendanceClassesStaffManageInfo.conditions.classesId = _attendanceClass.classesId;
                $that._listAttendanceClassesStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _loadAttendanceClass: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                    }
                };
                //发送get请求
                vc.http.apiGet('/attendanceClasses.listAttendanceClassess',
                    param,
                    function(json, res) {
                        let _attendanceClassesManageInfo = JSON.parse(json);
                        $that.attendanceClassesStaffManageInfo.attendanceClassess = _attendanceClassesManageInfo.data;
                        if (_attendanceClassesManageInfo.data && _attendanceClassesManageInfo.data.length > 0) {
                            $that.swatchClass(_attendanceClassesManageInfo.data[0]);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            showImg: function(e) {
                if (!e) {
                    e = '/img/noPhoto.jpg';
                }
                vc.emit('viewImage', 'showImage', { url: e });
            },
            openStaffDetail: function(_staff) {
                vc.jumpToPage('/#/pages/staff/staffDetail?staffId=' + _staff.staffId)
            }


        }
    });
})(window.vc);