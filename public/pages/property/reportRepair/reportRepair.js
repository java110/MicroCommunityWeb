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
                communitys:[],
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
                    communityId: ''
                }
            }
        },
        _initMethod: function () {
            $that._initDate();
            $that.reportRepairInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
            $that._loadStaffCommunitys();
            $that._listRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            //关联字典表费用类型
            vc.getDict('r_repair_user', "state", function (_data) {
                $that.reportRepairInfo.states = _data;
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
                $that._listRepairs(_currentPage, DEFAULT_ROWS);
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
                        $that.reportRepairInfo.conditions.beginStartTime = value;
                    });
                $('.begin_end_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".begin_end_time").val();
                        $that.reportRepairInfo.conditions.beginEndTime = value;
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
                        $that.reportRepairInfo.conditions.finishStartTime = value;
                    });
                $('.finish_end_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".finish_end_time").val();
                        $that.reportRepairInfo.conditions.finishEndTime = value;
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
                $that._listRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listRepairs: function (_page, _rows) {
                $that.reportRepairInfo.conditions.page = _page;
                $that.reportRepairInfo.conditions.row = _rows;
                //$that.reportRepairInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: $that.reportRepairInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryRepair',
                    param,
                    function (json, res) {
                        var _reportRepairInfo = JSON.parse(json);
                        $that.reportRepairInfo.total = _reportRepairInfo.total;
                        $that.reportRepairInfo.records = _reportRepairInfo.records;
                        $that.reportRepairInfo.repairs = _reportRepairInfo.data;
                        $that.reportRepairInfo.repairUsers = _reportRepairInfo.sumTotal;
                        //处理中总数量
                        $that.reportRepairInfo.conditions.dealNumber = _reportRepairInfo.rep.dealNumber;
                        //派单总数量
                        $that.reportRepairInfo.conditions.dispatchNumber = _reportRepairInfo.rep.dispatchNumber;
                        //转单总数量
                        $that.reportRepairInfo.conditions.transferOrderNumber = _reportRepairInfo.rep.transferOrderNumber;
                        //退单总数量
                        $that.reportRepairInfo.conditions.chargebackNumber = _reportRepairInfo.rep.chargebackNumber;
                        //结单总数量
                        $that.reportRepairInfo.conditions.statementNumber = _reportRepairInfo.rep.statementNumber;
                        //回访总数量
                        $that.reportRepairInfo.conditions.returnNumber = _reportRepairInfo.rep.returnNumber;
                        vc.emit('pagination', 'init', {
                            total: $that.reportRepairInfo.records,
                            currentPage: _page,
                            dataCount: $that.reportRepairInfo.total
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetMethod: function (_page, _rows) {
                $that._resetListRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetListRepairs: function (_page, _rows) {
                $that.reportRepairInfo.conditions.staffId = "";
                $that.reportRepairInfo.conditions.staffName = "";
                $that.reportRepairInfo.conditions.beginStartTime = "";
                $that.reportRepairInfo.conditions.beginEndTime = "";
                $that.reportRepairInfo.conditions.finishStartTime = "";
                $that.reportRepairInfo.conditions.finishEndTime = "";
                $that.reportRepairInfo.conditions.state = "";
                $that.reportRepairInfo.conditions.stateName = "";
                var param = {
                    params: $that.reportRepairInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryRepair',
                    param,
                    function (json, res) {
                        var _reportRepairInfo = JSON.parse(json);
                        $that.reportRepairInfo.total = _reportRepairInfo.total;
                        $that.reportRepairInfo.records = _reportRepairInfo.records;
                        $that.reportRepairInfo.repairs = _reportRepairInfo.data;
                        //处理中总数量
                        $that.reportRepairInfo.conditions.dealNumber = _reportRepairInfo.rep.dealNumber;
                        //派单总数量
                        $that.reportRepairInfo.conditions.dispatchNumber = _reportRepairInfo.rep.dispatchNumber;
                        //转单总数量
                        $that.reportRepairInfo.conditions.transferOrderNumber = _reportRepairInfo.rep.transferOrderNumber;
                        //退单总数量
                        $that.reportRepairInfo.conditions.chargebackNumber = _reportRepairInfo.rep.chargebackNumber;
                        //结单总数量
                        $that.reportRepairInfo.conditions.statementNumber = _reportRepairInfo.rep.statementNumber;
                        //回访总数量
                        $that.reportRepairInfo.conditions.returnNumber = _reportRepairInfo.rep.returnNumber;
                        vc.emit('pagination', 'init', {
                            total: $that.reportRepairInfo.records,
                            currentPage: _page,
                            dataCount: $that.reportRepairInfo.total
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if ($that.reportRepairInfo.moreCondition) {
                    $that.reportRepairInfo.moreCondition = false;
                } else {
                    $that.reportRepairInfo.moreCondition = true;
                }
            },
            _exportFee: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportRepairDetail&' + vc.objToGetParam($that.reportRepairInfo.conditions));
            },
            _loadStaffCommunitys: function () {
                let param = {
                    params: {
                        _uid: '123mlkdinkldldijdhuudjdjkkd',
                        page: 1,
                        row: 100,
                    }
                };
                vc.http.apiGet('/community.listMyEnteredCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _data = JSON.parse(json);
                            $that.reportRepairInfo.communitys = _data.communitys;
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _changCommunity:function(){
                $that._listRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);
