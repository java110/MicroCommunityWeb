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
            vc.component._listMonthAttendances(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._initDate();
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
                        vc.component.monthAttendanceManageInfo.conditions.date = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control queryDate')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listMonthAttendances: function (_page, _rows) {
                vc.component.monthAttendanceManageInfo.conditions.page = _page;
                vc.component.monthAttendanceManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.monthAttendanceManageInfo.conditions
                };
                param.params.classesName = param.params.classesName.trim();
                param.params.departmentName = param.params.departmentName.trim();
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
                    }, function (errInfo, error) {
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
            }
        }
    });
})(window.vc);
