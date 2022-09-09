/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffAttendanceManageInfo: {
                staffs: [],
                attendances: [],
                classesId: '',
                orgId: '',
                orgName: '',
                curDate: '',
                curYear: '',
                curMonth: '',
                curStaffId: '',
                maxDay: '',
            }
        },
        _initMethod: function() {
            vc.component._loadStaffs();
            $that.initStaffDate();
        },
        _initEvent: function() {
            vc.on('staffAttendanceManage', 'listMonthAttendance', function(_param) {
                vc.component._listMonthAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listMonthAttendances(_currentPage, DEFAULT_ROWS);
            });
            vc.on('staffAttendanceManage', 'switchOrg', function(_org) {
                $that.staffAttendanceManageInfo.orgId = _org.orgId;
                $that.staffAttendanceManageInfo.orgName = _org.allOrgName;
                $that._loadStaffs();
            });
        },
        methods: {
            _loadStaffs: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        orgId: $that.staffAttendanceManageInfo.orgId,
                    }
                }
                vc.http.apiGet('/query.staff.infos',
                    param,
                    function(json) {
                        let _staffInfo = JSON.parse(json);
                        // 员工列表 和 岗位列表匹配
                        let staffList = _staffInfo.staffs;
                        $that.staffAttendanceManageInfo.staffs = staffList;

                        if (staffList && staffList.length > 0) {
                            $that.staffAttendanceManageInfo.curStaffId = staffList[0].userId;
                            $that._loadStaffAttendances();
                        }

                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            initStaffDate: function() {
                let _date = new Date(new Date());
                $that.staffAttendanceManageInfo.curMonth = _date.getMonth() + 1
                $that.staffAttendanceManageInfo.curYear = _date.getFullYear();
                $that.staffAttendanceManageInfo.curDate = _date.getFullYear() + "-" + (_date.getMonth() + 1);
                $that.staffAttendanceManageInfo.maxDay = new Date(_date.getFullYear(), _date.getMonth() + 1, 0).getDate();

                vc.initDateMonth('queryDate', function(_value) {
                    $that.staffAttendanceManageInfo.curDate = _value;
                    let _values = _value.split('-');
                    $that.staffAttendanceManageInfo.curYear = _values[0];

                    $that.staffAttendanceManageInfo.curMonth = _values[1];
                    $that._loadStaffAttendances();
                })
            },
            _getAttendanceState: function(_day) {
                let _attendance = $that._getDayAttendance(_day);
                if (!_attendance) {
                    return "<span style='color:rgb(220, 53, 69)'>未考勤</span>";
                }


                return "<span style='color:rgb(18, 150, 219)'>" + _attendance.stateName + "</span>";
            },
            _getAttendanceDetail: function(_day) {
                let _attendance = $that._getDayAttendance(_day);
                if (!_attendance) {
                    return [];
                }

                return _attendance.attendanceClassesTaskDetails;
            },
            _getDayAttendance: function(_day) {
                let _attendance = null;

                if (!$that.staffAttendanceManageInfo.attendances) {
                    return _attendance;
                }

                $that.staffAttendanceManageInfo.attendances.forEach(item => {
                    if (item.taskDay == _day) {
                        _attendance = item;
                    }
                });

                return _attendance;
            },
            _getBgColor: function(_curDay) {

                return "#fff"
            },

            _staffAttendanceChangeOrg: function() {
                vc.emit('chooseOrgTree', 'openOrgModal', {});
            },
            swatchStaff: function(_staff) {
                $that.staffAttendanceManageInfo.curStaffId = _staff.userId;
                $that._loadStaffAttendances();
            },
            _loadStaffAttendances: function() {
                if (!$that.staffAttendanceManageInfo.curStaffId) {
                    return;
                }
                if (!$that.staffAttendanceManageInfo.curDate) {
                    return;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 1000,
                        date: $that.staffAttendanceManageInfo.curDate,
                        staffId: $that.staffAttendanceManageInfo.curStaffId
                    }
                };
                //发送get请求
                vc.http.apiGet('/attendanceClass/queryAttendanceClassesTask',
                    param,
                    function(json, res) {
                        var _todayAttendanceManageInfo = JSON.parse(json);
                        vc.component.staffAttendanceManageInfo.attendances = _todayAttendanceManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _checkInLog: function(_day) {
                vc.emit('staffAttendanceDetail', 'openModel', {
                    staffId: $that.staffAttendanceManageInfo.curStaffId,
                    date: $that.staffAttendanceManageInfo.curYear + "-" + $that.staffAttendanceManageInfo.curMonth + '-' + _day
                })
            }
        }
    });
})(window.vc);