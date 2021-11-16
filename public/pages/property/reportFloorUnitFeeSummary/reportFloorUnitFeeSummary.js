/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFloorUnitFeeSummaryInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                roomUnits: [],
                totalReceivableAmount:0.0,
                allReceivableAmount:0.0,
                totalReceivedAmount:0.0,
                allReceivedAmount:0.0,
                totalPreferentialAmount:0.0,
                allOweAmount:0.0,
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
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
            // vc.initDateMonth('startTime', function (_startTime) {
            //     $that.reportFloorUnitFeeSummaryInfo.conditions.startTime = _startTime;
            // });
            // vc.initDateMonth('endTime', function (_endTime) {
            //     $that.reportFloorUnitFeeSummaryInfo.conditions.endTime = _endTime;
            //     let start = Date.parse(new Date($that.reportFloorUnitFeeSummaryInfo.conditions.startTime + "-01"))
            //     let end = Date.parse(new Date($that.reportFloorUnitFeeSummaryInfo.conditions.endTime + "-01"))
            //     if (start - end >= 0) {
            //         vc.toast("结束时间必须大于开始时间")
            //         $that.reportFloorUnitFeeSummaryInfo.conditions.endTime = '';
            //     }
            // });
        },
        _initEvent: function () {
            vc.on('reportFloorUnitFeeSummary', 'chooseFloor', function (_param) {
                vc.component.reportFloorUnitFeeSummaryInfo.conditions.floorId = _param.floorId;
                vc.component.reportFloorUnitFeeSummaryInfo.conditions.floorName = _param.floorName;
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
                    todayBtn: true
                });
                $(".endTime").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.reportFloorUnitFeeSummaryInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportFloorUnitFeeSummaryInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportFloorUnitFeeSummaryInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportFloorUnitFeeSummaryInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportFloorUnitFeeSummaryInfo.conditions.endTime = '';
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
            _queryMethod: function () {
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMethod: function () {
                vc.component._resetFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listFees: function (_page, _rows) {
                vc.component.reportFloorUnitFeeSummaryInfo.conditions.page = _page;
                vc.component.reportFloorUnitFeeSummaryInfo.conditions.row = _rows;
                vc.component.reportFloorUnitFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportFloorUnitFeeSummaryInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryFloorUnitFeeSummary',
                    param,
                    function (json, res) {
                        var _reportFloorUnitFeeSummaryInfo = JSON.parse(json);
                        vc.component.reportFloorUnitFeeSummaryInfo.total = _reportFloorUnitFeeSummaryInfo.total;
                        vc.component.reportFloorUnitFeeSummaryInfo.records = _reportFloorUnitFeeSummaryInfo.records;
                        vc.component.reportFloorUnitFeeSummaryInfo.fees = _reportFloorUnitFeeSummaryInfo.data;
                        //计算小计
                        let _totalReceivableAmount=0.0;
                        let _totalReceivedAmount=0.0;
                        let _totalPreferentialAmount=0.0;
                       
                        _reportFloorUnitFeeSummaryInfo.data.forEach(item => {
                            _totalReceivableAmount += parseFloat(item.receivableAmount);
                            _totalReceivedAmount += parseFloat(item.receivedAmount);
                            _totalPreferentialAmount += parseFloat(item.oweAmount);
                        });

                        $that.reportFloorUnitFeeSummaryInfo.totalReceivableAmount = _totalReceivableAmount.toFixed(2);
                        $that.reportFloorUnitFeeSummaryInfo.totalReceivedAmount = _totalReceivedAmount.toFixed(2);
                        $that.reportFloorUnitFeeSummaryInfo.totalPreferentialAmount = _totalPreferentialAmount.toFixed(2);

                        if(_reportFloorUnitFeeSummaryInfo.data.length>0){
                            $that.reportFloorUnitFeeSummaryInfo.allReceivableAmount = _reportFloorUnitFeeSummaryInfo.data[0].allReceivableAmount;
                            $that.reportFloorUnitFeeSummaryInfo.allReceivedAmount = _reportFloorUnitFeeSummaryInfo.data[0].allReceivedAmount;
                            $that.reportFloorUnitFeeSummaryInfo.allOweAmount = _reportFloorUnitFeeSummaryInfo.data[0].allOweAmount;
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportFloorUnitFeeSummaryInfo.records,
                            dataCount: vc.component.reportFloorUnitFeeSummaryInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetFees: function (_page, _rows) {
                vc.component.reportFloorUnitFeeSummaryInfo.conditions.floorName = "";
                vc.component.reportFloorUnitFeeSummaryInfo.conditions.floorId = "";
                vc.component.reportFloorUnitFeeSummaryInfo.conditions.unitId = "";
                vc.component.reportFloorUnitFeeSummaryInfo.conditions.roomNum = "";
                vc.component.reportFloorUnitFeeSummaryInfo.conditions.startTime = "";
                vc.component.reportFloorUnitFeeSummaryInfo.conditions.endTime = "";
                $that._listFees(DEFAULT_PAGE,DEFAULT_ROWS);
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
                            vc.component.reportFloorUnitFeeSummaryInfo.roomUnits = tmpUnits;
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
                if (vc.component.reportFloorUnitFeeSummaryInfo.moreCondition) {
                    vc.component.reportFloorUnitFeeSummaryInfo.moreCondition = false;
                } else {
                    vc.component.reportFloorUnitFeeSummaryInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFloorUnitFeeSummary&' + vc.objToGetParam($that.reportFloorUnitFeeSummaryInfo.conditions));
            }
        }
    });
})(window.vc);
