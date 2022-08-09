/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 30;
    vc.extends({
        data: {
            staffFeeManageInfo: {
                staffFees: [],
                staffFeeTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                name: '',
                conditions: {
                    communityId: vc.getCurrentCommunity().communityId,
                    startTime: '',
                    endTime: '',
                    userCode: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            vc.component._liststaffFees(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._liststaffFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function () {
                $(".start_time").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    // minView: "month",
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".end_time").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    // minView: "month",
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.start_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".start_time").val();
                        vc.component.staffFeeManageInfo.conditions.startTime = value;
                        let start = Date.parse(new Date(vc.component.staffFeeManageInfo.conditions.startTime))
                        let end = Date.parse(new Date(vc.component.staffFeeManageInfo.conditions.endTime))
                        if (end != 0 && start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间")
                            vc.component.staffFeeManageInfo.conditions.startTime = '';
                        }
                    });
                $('.end_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".end_time").val();
                        vc.component.staffFeeManageInfo.conditions.endTime = value;
                        let start = Date.parse(new Date(vc.component.staffFeeManageInfo.conditions.startTime))
                        let end = Date.parse(new Date(vc.component.staffFeeManageInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            vc.component.staffFeeManageInfo.conditions.endTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control  start_time')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control  end_time")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _liststaffFees: function (_page, _rows) {
                vc.component.staffFeeManageInfo.conditions.page = _page;
                vc.component.staffFeeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.staffFeeManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/api.getStaffFee',
                    param,
                    function (json, res) {
                        var _staffFeeManageInfo = JSON.parse(json);
                        console.log("123321")
                        console.log(_staffFeeManageInfo)
                        vc.component.staffFeeManageInfo.total = _staffFeeManageInfo.total;
                        vc.component.staffFeeManageInfo.records = parseInt(_staffFeeManageInfo.total / _rows + 1);
                        vc.component.staffFeeManageInfo.staffFees = _staffFeeManageInfo.staffFees;
                        vc.emit('pagination', 'init', {
                            total: vc.component.staffFeeManageInfo.records,
                            dataCount: vc.component.staffFeeManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _querystaffFeeMethod: function () {
                vc.component._liststaffFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetstaffFeeMethod: function () {
                vc.component.staffFeeManageInfo.conditions.userCode = "";
                vc.component.staffFeeManageInfo.conditions.startTime = "";
                vc.component.staffFeeManageInfo.conditions.endTime = "";
                vc.component._liststaffFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.staffFeeManageInfo.moreCondition) {
                    vc.component.staffFeeManageInfo.moreCondition = false;
                } else {
                    vc.component.staffFeeManageInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=staffFeeManage&' + vc.objToGetParam($that.staffFeeManageInfo.conditions));
            }
        }
    });
})(window.vc);
