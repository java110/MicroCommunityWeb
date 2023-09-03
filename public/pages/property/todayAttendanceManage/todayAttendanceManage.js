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
                    date: '',
                    staffName: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listTodayAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._initDate();
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
            _initDate: function () {
                $(".queryDate").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.queryDate').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".queryDate").val();
                        vc.component.todayAttendanceManageInfo.conditions.date = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control queryDate')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listTodayAttendances: function (_page, _rows) {
                vc.component.todayAttendanceManageInfo.conditions.page = _page;
                vc.component.todayAttendanceManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.todayAttendanceManageInfo.conditions
                };
                param.params.classesName = param.params.classesName.trim();
                param.params.departmentName = param.params.departmentName.trim();
                param.params.staffName = param.params.staffName.trim();
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
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAttendanceDetailModel: function (_attendance) {
                vc.emit('todayAttendanceDetail', 'openTodayAttendanceDetail', _attendance);
            },
            //查询
            _queryTodayAttendanceMethod: function () {
                vc.component._listTodayAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetTodayAttendanceMethod: function () {
                vc.component.todayAttendanceManageInfo.conditions.classesName = "";
                vc.component.todayAttendanceManageInfo.conditions.departmentName = "";
                vc.component.todayAttendanceManageInfo.conditions.date = "";
                vc.component.todayAttendanceManageInfo.conditions.staffName = "";
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