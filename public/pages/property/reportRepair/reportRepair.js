/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportRepairInfo: {
                repairs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                states: '',
                repairUsers: '',
                conditions: {
                    staffId: '',
                    staffName: '',
                    state: '',
                    stateName: '',
                    amount: '',
                    beginStartTime: '',
                    beginEndTime: '',
                    finishStartTime: '',
                    finishEndTime: '',
                    dealNumber: '',   //处理中总数量
                    dispatchNumber: '',   //派单总数量
                    transferOrderNumber: '',   //转单总数量
                    chargebackNumber: '',    //退单总数量
                    statementNumber: '',   //结单总数量
                    returnNumber: '',   //回访总数量
                    score: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            vc.component._listRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            //关联字典表费用类型
            vc.getDict('r_repair_user', "state", function (_data) {
                vc.component.reportRepairInfo.states = _data;
            });
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRepairs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function () {
                $(".begin_start_time").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true,
                    clearBtn: true
                });
                $(".begin_end_time").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true,
                    clearBtn: true
                });
                $(".finish_start_time").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true,
                    clearBtn: true
                });
                $(".finish_end_time").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true,
                    clearBtn: true
                });
                $('.begin_start_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".begin_start_time").val();
                        vc.component.reportRepairInfo.conditions.beginStartTime = value;
                    });
                $('.begin_end_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".begin_end_time").val();
                        vc.component.reportRepairInfo.conditions.beginEndTime = value;
                        let start = Date.parse(new Date($that.reportRepairInfo.conditions.beginStartTime))
                        let end = Date.parse(new Date($that.reportRepairInfo.conditions.beginEndTime))
                        if (start - end > 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportRepairInfo.conditions.beginEndTime = '';
                        }
                    });
                $('.finish_start_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".finish_start_time").val();
                        vc.component.reportRepairInfo.conditions.finishStartTime = value;
                    });
                $('.finish_end_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".finish_end_time").val();
                        vc.component.reportRepairInfo.conditions.finishEndTime = value;
                        let start = Date.parse(new Date($that.reportRepairInfo.conditions.finishStartTime))
                        let end = Date.parse(new Date($that.reportRepairInfo.conditions.finishEndTime))
                        if (start - end > 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportRepairInfo.conditions.finishEndTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByName('beginStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByName("beginEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByName('finishStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByName("finishEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            //查询
            _queryMethod: function () {
                vc.component._listRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listRepairs: function (_page, _rows) {
                vc.component.reportRepairInfo.conditions.page = _page;
                vc.component.reportRepairInfo.conditions.row = _rows;
                vc.component.reportRepairInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportRepairInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryRepair',
                    param,
                    function (json, res) {
                        var _reportRepairInfo = JSON.parse(json);
                        vc.component.reportRepairInfo.total = _reportRepairInfo.total;
                        vc.component.reportRepairInfo.records = _reportRepairInfo.records;
                        vc.component.reportRepairInfo.repairs = _reportRepairInfo.data;
                        vc.component.reportRepairInfo.repairUsers = _reportRepairInfo.sumTotal;
                        //处理中总数量
                        vc.component.reportRepairInfo.conditions.dealNumber = _reportRepairInfo.rep.dealNumber;
                        //派单总数量
                        vc.component.reportRepairInfo.conditions.dispatchNumber = _reportRepairInfo.rep.dispatchNumber;
                        //转单总数量
                        vc.component.reportRepairInfo.conditions.transferOrderNumber = _reportRepairInfo.rep.transferOrderNumber;
                        //退单总数量
                        vc.component.reportRepairInfo.conditions.chargebackNumber = _reportRepairInfo.rep.chargebackNumber;
                        //结单总数量
                        vc.component.reportRepairInfo.conditions.statementNumber = _reportRepairInfo.rep.statementNumber;
                        //回访总数量
                        vc.component.reportRepairInfo.conditions.returnNumber = _reportRepairInfo.rep.returnNumber;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportRepairInfo.records,
                            currentPage: _page,
                            dataCount: vc.component.reportRepairInfo.total
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetMethod: function (_page, _rows) {
                vc.component._resetListRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetListRepairs: function (_page, _rows) {
                vc.component.reportRepairInfo.conditions.staffId = "";
                vc.component.reportRepairInfo.conditions.staffName = "";
                vc.component.reportRepairInfo.conditions.beginStartTime = "";
                vc.component.reportRepairInfo.conditions.beginEndTime = "";
                vc.component.reportRepairInfo.conditions.finishStartTime = "";
                vc.component.reportRepairInfo.conditions.finishEndTime = "";
                vc.component.reportRepairInfo.conditions.state = "";
                vc.component.reportRepairInfo.conditions.stateName = "";
                var param = {
                    params: vc.component.reportRepairInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryRepair',
                    param,
                    function (json, res) {
                        var _reportRepairInfo = JSON.parse(json);
                        vc.component.reportRepairInfo.total = _reportRepairInfo.total;
                        vc.component.reportRepairInfo.records = _reportRepairInfo.records;
                        vc.component.reportRepairInfo.repairs = _reportRepairInfo.data;
                        //处理中总数量
                        vc.component.reportRepairInfo.conditions.dealNumber = _reportRepairInfo.rep.dealNumber;
                        //派单总数量
                        vc.component.reportRepairInfo.conditions.dispatchNumber = _reportRepairInfo.rep.dispatchNumber;
                        //转单总数量
                        vc.component.reportRepairInfo.conditions.transferOrderNumber = _reportRepairInfo.rep.transferOrderNumber;
                        //退单总数量
                        vc.component.reportRepairInfo.conditions.chargebackNumber = _reportRepairInfo.rep.chargebackNumber;
                        //结单总数量
                        vc.component.reportRepairInfo.conditions.statementNumber = _reportRepairInfo.rep.statementNumber;
                        //回访总数量
                        vc.component.reportRepairInfo.conditions.returnNumber = _reportRepairInfo.rep.returnNumber;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportRepairInfo.records,
                            currentPage: _page,
                            dataCount: vc.component.reportRepairInfo.total
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.reportRepairInfo.moreCondition) {
                    vc.component.reportRepairInfo.moreCondition = false;
                } else {
                    vc.component.reportRepairInfo.moreCondition = true;
                }
            },
            _exportFee: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportRepairDetail&' + vc.objToGetParam($that.reportRepairInfo.conditions));
            }
        }
    });
})(window.vc);
