/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeSummaryInfo: {
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
        },
        _initEvent: function () {
            vc.on('reportFeeSummary', 'chooseFloor', function (_param) {
                vc.component.reportFeeSummaryInfo.conditions.floorId = _param.floorId;
                vc.component.reportFeeSummaryInfo.conditions.floorName = _param.floorName;
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
                        vc.component.reportFeeSummaryInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportFeeSummaryInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportFeeSummaryInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportFeeSummaryInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportFeeSummaryInfo.conditions.endTime = '';
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
            //查询方法
            _listFees: function (_page, _rows) {
                vc.component.reportFeeSummaryInfo.conditions.page = _page;
                vc.component.reportFeeSummaryInfo.conditions.row = _rows;
                vc.component.reportFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportFeeSummaryInfo.conditions
                };
                param.params.roomNum = param.params.roomNum.trim();
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryReportFeeSummary',
                    param,
                    function (json, res) {
                        var _reportFeeSummaryInfo = JSON.parse(json);
                        vc.component.reportFeeSummaryInfo.total = _reportFeeSummaryInfo.total;
                        vc.component.reportFeeSummaryInfo.records = _reportFeeSummaryInfo.records;
                        vc.component.reportFeeSummaryInfo.fees = _reportFeeSummaryInfo.data;
                        //计算小计
                        let _totalReceivableAmount=0.0;
                        let _totalReceivedAmount=0.0;
                        let _totalPreferentialAmount=0.0;
                       
                        _reportFeeSummaryInfo.data.forEach(item => {
                            _totalReceivableAmount += parseFloat(item.receivableAmount);
                            _totalReceivedAmount += parseFloat(item.receivedAmount);
                            _totalPreferentialAmount += parseFloat(item.oweAmount);
                        });

                        $that.reportFeeSummaryInfo.totalReceivableAmount = _totalReceivableAmount.toFixed(2);
                        $that.reportFeeSummaryInfo.totalReceivedAmount = _totalReceivedAmount.toFixed(2);
                        $that.reportFeeSummaryInfo.totalPreferentialAmount = _totalPreferentialAmount.toFixed(2);

                        if(_reportFeeSummaryInfo.data.length>0){
                            $that.reportFeeSummaryInfo.allReceivableAmount = _reportFeeSummaryInfo.data[0].allReceivableAmount;
                            $that.reportFeeSummaryInfo.allReceivedAmount = _reportFeeSummaryInfo.data[0].allReceivedAmount;
                            $that.reportFeeSummaryInfo.allOweAmount = _reportFeeSummaryInfo.data[0].allOweAmount;
                        }

                        vc.emit('pagination', 'init', {
                            total: vc.component.reportFeeSummaryInfo.records,
                            dataCount: vc.component.reportFeeSummaryInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetMethod: function (_page, _rows) {
                vc.component.reportFeeSummaryInfo.conditions.floorName = "";
                vc.component.reportFeeSummaryInfo.conditions.floorId = "";
                vc.component.reportFeeSummaryInfo.conditions.unitId = "";
                vc.component.reportFeeSummaryInfo.conditions.roomNum = "";
                vc.component.reportFeeSummaryInfo.conditions.startTime = "";
                vc.component.reportFeeSummaryInfo.conditions.endTime = "";
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
                            vc.component.reportFeeSummaryInfo.roomUnits = tmpUnits;
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
                if (vc.component.reportFeeSummaryInfo.moreCondition) {
                    vc.component.reportFeeSummaryInfo.moreCondition = false;
                } else {
                    vc.component.reportFeeSummaryInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFeeSummary&' + vc.objToGetParam($that.reportFeeSummaryInfo.conditions));
            }
        }
    });
})(window.vc);
