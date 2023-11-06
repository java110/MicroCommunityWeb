/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            monthAttendanceManageInfo: {
                attendances: [],
                attendanceClassess: [],
                total: 0,
                records: 1,
                moreCondition: false,
                classesId: '',
                curDays: 30,
                conditions: {
                    classesId: '',
                    departmentName: '',
                    taskYear: '',
                    taskMonth: '',
                    date: ''
                }
            }
        },
        _initMethod: function () {
            //vc.component._listMonthAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listAttendanceClassess();
            $that._changeCurrentDay();
            vc.initDateMonth('queryDate', function (_value) {
                let _values = _value.split('-');
                $that.monthAttendanceManageInfo.conditions.taskYear = _values[0];
                $that.monthAttendanceManageInfo.conditions.taskMonth = _values[1];
                $that.monthAttendanceManageInfo.conditions.date = _value;
                $that._changeCurrentDay();
            })
        },
        _initEvent: function () {
            vc.on('monthAttendanceManage', 'listMonthAttendance', function (_param) {
                vc.component._listMonthAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMonthAttendances(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMonthAttendances: function (_page, _rows) {
                vc.component.monthAttendanceManageInfo.conditions.page = _page;
                vc.component.monthAttendanceManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.monthAttendanceManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/attendanceClass/getMonthAttendance',
                    param,
                    function (json, res) {
                        var _monthAttendanceManageInfo = JSON.parse(json);
                        vc.component.monthAttendanceManageInfo.total = _monthAttendanceManageInfo.total;
                        vc.component.monthAttendanceManageInfo.records = _monthAttendanceManageInfo.records;
                        vc.component.monthAttendanceManageInfo.attendances = _monthAttendanceManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.monthAttendanceManageInfo.records,
                            dataCount: vc.component.monthAttendanceManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryMonthAttendanceMethod: function () {
                vc.component._listMonthAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMonthAttendanceMethod: function () {
                vc.component.monthAttendanceManageInfo.conditions.classesName = "";
                vc.component.monthAttendanceManageInfo.conditions.departmentName = "";
                vc.component.monthAttendanceManageInfo.conditions.date = vc.dateFormat(new Date());
                vc.component._listMonthAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.monthAttendanceManageInfo.moreCondition) {
                    vc.component.monthAttendanceManageInfo.moreCondition = false;
                } else {
                    vc.component.monthAttendanceManageInfo.moreCondition = true;
                }
            },
            _changeCurrentDay: function () {
                let _taskYear = $that.monthAttendanceManageInfo.conditions.taskYear;
                let _taskMonth = $that.monthAttendanceManageInfo.conditions.taskMonth;
                if (!_taskMonth || !_taskYear) {
                    let _date = new Date();
                    $that.monthAttendanceManageInfo.conditions.taskYear = _date.getFullYear();
                    $that.monthAttendanceManageInfo.conditions.taskMonth = _date.getMonth() + 1;
                    $that.monthAttendanceManageInfo.conditions.date = _date.getFullYear() + "-" + (_date.getMonth() + 1);
                    _taskYear = $that.monthAttendanceManageInfo.conditions.taskYear;
                    _taskMonth = $that.monthAttendanceManageInfo.conditions.taskMonth;
                }
                $that.monthAttendanceManageInfo.curDays = vc.daysInMonth(_taskYear, parseInt(_taskMonth) - 1);
            },
            _computeTableDivWidth: function () {
                let mainWidth = document.getElementsByTagName('body')[0].clientWidth - document.getElementById('menu-nav').offsetWidth;
                //let treeWidth = document.getElementsByClassName('room-floor-unit-tree')[0].offsetWidth;
                mainWidth = mainWidth - 20 - 15 - 20;
                //document.getElementsByClassName('hc-table-div')[0].style.width=mainWidth+'px';
                return mainWidth + 'px';
            },
            _listAttendanceClassess: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                };
                //发送get请求
                vc.http.apiGet('/attendanceClasses.listAttendanceClassess',
                    param,
                    function (json, res) {
                        let _attendanceClassesManageInfo = JSON.parse(json);
                        $that.monthAttendanceManageInfo.attendanceClassess = _attendanceClassesManageInfo.data;
                        if (_attendanceClassesManageInfo.data && _attendanceClassesManageInfo.data.length > 0) {
                            $that.monthAttendanceManageInfo.conditions.classesId = _attendanceClassesManageInfo.data[0].classesId;
                            $that._listMonthAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getDayDetail: function (detail, day) {
                let _date = new Date();
                let _taskYear = $that.monthAttendanceManageInfo.conditions.taskYear;
                let _taskMonth = $that.monthAttendanceManageInfo.conditions.taskMonth;
                if (_taskYear == _date.getFullYear() && _taskMonth == (_date.getMonth() + 1) && day > _date.getDate()) {
                    return "未到时间";
                }
                if (!detail.hasOwnProperty(day)) {
                    return "无需考勤";
                }
                let _details = detail[day];
                if (!_details) {
                    return "无需考勤";
                }
                let _value = "";
                _details.forEach(element => {
                    if (element.specCd == '1001') {
                        _value += ('<div>上班：')
                    } else {
                        _value += "<div>下班："
                    }
                    if (element.state != '10000') {
                        _value += (vc.timeFormat(element.checkTime) + '(' + element.stateName + ')</div>')
                    } else {
                        _value += (' - (' + element.stateName + ')</div>')
                    }
                });
                return _value;
            },
            _exportExcel: function () {
                //vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportPayFeeDetail&' + vc.objToGetParam($that.reportPayFeeDetailInfo.conditions));
                vc.component.monthAttendanceManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.monthAttendanceManageInfo.conditions.pagePath = 'monthAttendance';
                let param = {
                    params: vc.component.monthAttendanceManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            }
        }
    });
})(window.vc);