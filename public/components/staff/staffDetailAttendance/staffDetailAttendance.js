/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailAttendanceInfo: {
                staffId: '',
                attendances: [],
                curDate: '',
                maxDay: '',
                curYear: '',
                curMonth: ''
            }
        },
        _initMethod: function () {
            let _date = new Date(new Date());
            $that.staffDetailAttendanceInfo.curMonth = _date.getMonth() + 1
            $that.staffDetailAttendanceInfo.curYear = _date.getFullYear();
            $that.staffDetailAttendanceInfo.curDate = _date.getFullYear() + "-" + (_date.getMonth() + 1);
            $that.staffDetailAttendanceInfo.maxDay = new Date(_date.getFullYear(), _date.getMonth() + 1, 0).getDate();
            vc.initDateMonth('queryAttendanceDate', function (_value) {
                $that.staffDetailAttendanceInfo.curDate = _value;
                let _values = _value.split('-');
                $that.staffDetailAttendanceInfo.curYear = _values[0];
                $that.staffDetailAttendanceInfo.curMonth = _values[1];
            });
        },
        _initEvent: function () {
            vc.on('staffDetailAttendance', 'switch', function (_data) {
                $that.staffDetailAttendanceInfo.staffId = _data.staffId;
                $that._loadStaffAttendances()
            });
        },
        methods: {
            _getAttendanceState: function (_day) {
                let _attendance = $that._getDayAttendance(_day);
                if (!_attendance) {
                    return "<span style='color:rgb(220, 53, 69)'>未考勤</span>";
                }
                return "<span style='color:rgb(18, 150, 219)'>" + _attendance.stateName + "</span>";
            },
            _getAttendanceDetail: function (_day) {
                let _attendance = $that._getDayAttendance(_day);
                if (!_attendance) {
                    let _date = new Date();
                    let _taskYear = $that.staffDetailAttendanceInfo.curYear
                    let _taskMonth = $that.staffDetailAttendanceInfo.curMonth;
                    if (_taskYear == _date.getFullYear() && parseInt(_taskMonth) == (_date.getMonth() + 1) && _day > _date.getDate()) {
                        return [{
                            rest: '未到时间',
                        }];
                    }
                    return [{
                        rest: '无需考勤',
                    }];
                }
                return _attendance.attendanceClassesTaskDetails;
            },
            _getDayAttendance: function (_day) {
                let _attendance = null;
                if (!$that.staffDetailAttendanceInfo.attendances) {
                    return _attendance;
                }
                $that.staffDetailAttendanceInfo.attendances.forEach(item => {
                    if (item.taskDay == _day) {
                        _attendance = item;
                    }
                });
                return _attendance;
            },
            _getBgColor: function (_curDay) {
                return "#fff"
            },
            _loadStaffAttendances: function () {
                if (!$that.staffDetailAttendanceInfo.staffId) {
                    return;
                }
                if (!$that.staffDetailAttendanceInfo.curDate) {
                    return;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 1000,
                        date: $that.staffDetailAttendanceInfo.curDate,
                        staffId: $that.staffDetailAttendanceInfo.staffId
                    }
                };
                //发送get请求
                vc.http.apiGet('/attendanceClass/queryAttendanceClassesTask',
                    param,
                    function (json, res) {
                        var _todayAttendanceManageInfo = JSON.parse(json);
                        vc.component.staffDetailAttendanceInfo.attendances = _todayAttendanceManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _checkInLog: function (_day) {
                let _curMonth = $that.staffDetailAttendanceInfo.curMonth;
                if (_curMonth < 10) {
                    _curMonth = "0" + _curMonth;
                }
                if (_day < 10) {
                    _day = "0" + _day;
                }
                vc.emit('staffAttendanceDetail', 'openModel', {
                    staffId: $that.staffDetailAttendanceInfo.staffId,
                    date: $that.staffDetailAttendanceInfo.curYear + "-" + _curMonth + '-' + _day
                });
            },
        }
    });
})(window.vc);