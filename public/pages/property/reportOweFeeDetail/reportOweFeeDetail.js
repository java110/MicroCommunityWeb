/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportOweFeeDetailInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                roomUnits: [],
                totalPreferentialAmount: 0.0,
                allOweAmount: 0.0,
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    objName: '',
                    unitId: '',
                    startTime: '',
                    endTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);

            $(".popover-show").mouseover(() => { $('.popover-show').popover('show'); })
            $(".popover-show").mouseleave(() => { $('.popover-show').popover('hide'); })
            // vc.initDateMonth('startTime', function (_startTime) {
            //     $that.reportOweFeeDetailInfo.conditions.startTime = _startTime;
            // });
            // vc.initDateMonth('endTime', function (_endTime) {
            //     $that.reportOweFeeDetailInfo.conditions.endTime = _endTime;
            //     let start = Date.parse(new Date($that.reportOweFeeDetailInfo.conditions.startTime + "-01"))
            //     let end = Date.parse(new Date($that.reportOweFeeDetailInfo.conditions.endTime + "-01"))
            //     if (start - end >= 0) {
            //         vc.toast("结束时间必须大于开始时间")
            //         $that.reportOweFeeDetailInfo.conditions.endTime = '';
            //     }
            // });
        },
        _initEvent: function () {
            vc.on('reportOweFeeDetail', 'chooseFloor', function (_param) {
                vc.component.reportOweFeeDetailInfo.conditions.floorId = _param.floorId;
                vc.component.reportOweFeeDetailInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function () {
                $(".startTime").datetimepicker({
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
                $(".endTime").datetimepicker({
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
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.reportOweFeeDetailInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportOweFeeDetailInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportOweFeeDetailInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportOweFeeDetailInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportOweFeeDetailInfo.conditions.endTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            //查询
            _queryMethod: function () {
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMethod: function () {
                vc.component._resetFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listFees: function (_page, _rows) {
                vc.component.reportOweFeeDetailInfo.conditions.page = _page;
                vc.component.reportOweFeeDetailInfo.conditions.row = _rows;
                vc.component.reportOweFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportOweFeeDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryOweFeeDetail',
                    param,
                    function (json, res) {
                        var _reportOweFeeDetailInfo = JSON.parse(json);
                        vc.component.reportOweFeeDetailInfo.total = _reportOweFeeDetailInfo.total;
                        vc.component.reportOweFeeDetailInfo.records = _reportOweFeeDetailInfo.records;
                        vc.component.reportOweFeeDetailInfo.fees = _reportOweFeeDetailInfo.data;
                        //计算小计
                        let _totalPreferentialAmount = 0.0;
                        _reportOweFeeDetailInfo.data.forEach(item => {
                            _totalPreferentialAmount += parseFloat(item.oweAmount);
                        });
                        $that.reportOweFeeDetailInfo.totalPreferentialAmount = _totalPreferentialAmount.toFixed(2);
                        if (_reportOweFeeDetailInfo.data.length > 0) {
                            $that.reportOweFeeDetailInfo.allOweAmount = _reportOweFeeDetailInfo.data[0].allOweAmount;
                        } else {
                            $that.reportOweFeeDetailInfo.allOweAmount = 0.0.toFixed(2);
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportOweFeeDetailInfo.records,
                            dataCount: vc.component.reportOweFeeDetailInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetFees: function (_page, _rows) {
                vc.component.reportOweFeeDetailInfo.conditions.floorName = "";
                vc.component.reportOweFeeDetailInfo.conditions.floorId = "";
                vc.component.reportOweFeeDetailInfo.conditions.unitId = "";
                vc.component.reportOweFeeDetailInfo.conditions.objName = "";
                vc.component.reportOweFeeDetailInfo.conditions.startTime = "";
                vc.component.reportOweFeeDetailInfo.conditions.endTime = "";
                vc.component.reportOweFeeDetailInfo.roomUnits = [];
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            loadUnits: function (_floorId) {
                var param = {
                    params: {
                        floorId: _floorId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.get(
                    'room',
                    'loadUnits',
                    param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            let tmpUnits = JSON.parse(json);
                            vc.component.reportOweFeeDetailInfo.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openChooseFloorMethod: function () {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            _moreCondition: function () {
                if (vc.component.reportOweFeeDetailInfo.moreCondition) {
                    vc.component.reportOweFeeDetailInfo.moreCondition = false;
                } else {
                    vc.component.reportOweFeeDetailInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportOweFeeDetail&' + vc.objToGetParam($that.reportOweFeeDetailInfo.conditions));
            }
        }
    });
})(window.vc);
