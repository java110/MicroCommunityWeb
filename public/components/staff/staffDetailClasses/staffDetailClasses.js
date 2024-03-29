/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailClassesInfo: {
                staffId: '',
                days: [],
                curDate: ''
            }
        },
        _initMethod: function () {
            let _date = new Date(new Date());
            $that.staffDetailClassesInfo.curDate = _date.getFullYear() + "-" + (_date.getMonth() + 1);
            vc.initDateMonth('queryClassDate', function (_value) {
                $that.staffDetailClassesInfo.curDate = _value;
            });
        },
        _initEvent: function () {
            vc.on('staffDetailClasses', 'switch', function (_data) {
                $that.staffDetailClassesInfo.staffId = _data.staffId;
                $that._listStaffScheduleClassess()
            });
        },
        methods: {
            _listStaffScheduleClassess: function (_page, _rows) {
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        staffId: $that.staffDetailClassesInfo.staffId,
                        curDate: $that.staffDetailClassesInfo.curDate
                    }
                };
                //发送get请求
                vc.http.apiGet('/scheduleClasses.staffMonthScheduleClasses',
                    param,
                    function (json, res) {
                        let _scheduleClassesPageInfo = JSON.parse(json);
                        if (_scheduleClassesPageInfo.data && _scheduleClassesPageInfo.data.length > 0) {
                            $that.staffDetailClassesInfo.days = _scheduleClassesPageInfo.data[0].days;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryScheduleClasses: function () {
                vc.component._listStaffScheduleClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetScheduleClasses: function () {
                vc.component._listStaffScheduleClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);