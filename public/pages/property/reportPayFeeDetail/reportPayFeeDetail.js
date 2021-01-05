/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportPayFeeDetailInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                roomUnits: [],
                primeRates: [],
                feeConfigDtos: [],
                totalReceivableAmount: 0.0,
                totalReceivedAmount: 0.0,
                allReceivableAmount: 0.0,
                allReceivedAmount: 0.0,
                totalPreferentialAmount: 0.0,
                totalDeductionAmount: 0.0,
                totalLateFee: 0.0,
                totalVacantHousingDiscount: 0.0,
                totalVacantHousingReduction: 0.0,
                allPreferentialAmount: 0.0,
                allDeductionAmount: 0.0,
                allLateFee: 0.0,
                allVacantHousingDiscount: 0.0,
                allVacantHousingReduction: 0.0,
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    unitId: '',
                    configId: '',
                    primeRate: '',
                    startTime: '',
                    endTime: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            //与字典表支付方式关联
            vc.getDict('pay_fee_detail', "prime_rate", function (_data) {
                vc.component.reportPayFeeDetailInfo.primeRates = _data;
            });
            // vc.initDateMonth('startTime', function (_startTime) {
            //     $that.reportPayFeeDetailInfo.conditions.startTime = _startTime;
            // });

            // vc.initDateMonth('endTime', function (_endTime) {
            //     $that.reportPayFeeDetailInfo.conditions.endTime = _endTime;
            //     let start = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.startTime + "-01"))
            //     let end = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.endTime + "-01"))
            //     if (start - end >= 0) {
            //         vc.toast("结束时间必须大于开始时间")
            //         $that.reportPayFeeDetailInfo.conditions.endTime = '';
            //     }
            // });
        },
        _initEvent: function () {
            vc.on('reportPayFeeDetail', 'chooseFloor', function (_param) {
                vc.component.reportPayFeeDetailInfo.conditions.floorId = _param.floorId;
                vc.component.reportPayFeeDetailInfo.conditions.floorName = _param.floorName;
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
                        vc.component.reportPayFeeDetailInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportPayFeeDetailInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportPayFeeDetailInfo.conditions.endTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByName('startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByName("endTime")[0].addEventListener('click', myfunc)

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
                vc.component.reportPayFeeDetailInfo.conditions.page = _page;
                vc.component.reportPayFeeDetailInfo.conditions.row = _rows;
                vc.component.reportPayFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportPayFeeDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryPayFeeDetail',
                    param,
                    function (json, res) {
                        var _reportPayFeeDetailInfo = JSON.parse(json);
                        vc.component.reportPayFeeDetailInfo.total = _reportPayFeeDetailInfo.total;
                        vc.component.reportPayFeeDetailInfo.records = _reportPayFeeDetailInfo.records;
                        vc.component.reportPayFeeDetailInfo.fees = _reportPayFeeDetailInfo.data;
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalReceivableAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalReceivableAmount = _reportPayFeeDetailInfo.sumTotal.totalReceivableAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalReceivableAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalReceivedAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalReceivedAmount = _reportPayFeeDetailInfo.sumTotal.totalReceivedAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalReceivedAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allReceivableAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allReceivableAmount = _reportPayFeeDetailInfo.sumTotal.allReceivableAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allReceivableAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allReceivedAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allReceivedAmount = _reportPayFeeDetailInfo.sumTotal.allReceivedAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allReceivedAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalPreferentialAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalPreferentialAmount = _reportPayFeeDetailInfo.sumTotal.totalPreferentialAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalPreferentialAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalDeductionAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalDeductionAmount = _reportPayFeeDetailInfo.sumTotal.totalDeductionAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalDeductionAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalLateFee) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalLateFee = (_reportPayFeeDetailInfo.sumTotal.totalLateFee)*(-1);
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalLateFee = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalVacantHousingDiscount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalVacantHousingDiscount = _reportPayFeeDetailInfo.sumTotal.totalVacantHousingDiscount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalVacantHousingDiscount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalVacantHousingReduction) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalVacantHousingReduction = _reportPayFeeDetailInfo.sumTotal.totalVacantHousingReduction;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalVacantHousingReduction = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allPreferentialAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allPreferentialAmount = _reportPayFeeDetailInfo.sumTotal.allPreferentialAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allPreferentialAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allDeductionAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allDeductionAmount = _reportPayFeeDetailInfo.sumTotal.allDeductionAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allDeductionAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allLateFee) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allLateFee = (_reportPayFeeDetailInfo.sumTotal.allLateFee)*(-1);
                        } else {
                            vc.component.reportPayFeeDetailInfo.allLateFee = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allVacantHousingDiscount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allVacantHousingDiscount = _reportPayFeeDetailInfo.sumTotal.allVacantHousingDiscount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allVacantHousingDiscount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allVacantHousingReduction) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allVacantHousingReduction = _reportPayFeeDetailInfo.sumTotal.allVacantHousingReduction;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allVacantHousingReduction = "0.0";
                        }
                        if (_reportPayFeeDetailInfo.data.length > 0) {
                            vc.component.reportPayFeeDetailInfo.feeConfigDtos = _reportPayFeeDetailInfo.data[0].feeConfigDtos;
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportPayFeeDetailInfo.records,
                            currentPage: _page,
                            dataCount: vc.component.reportPayFeeDetailInfo.total
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetMethod: function (_page, _rows) {
                vc.component._resetListFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetListFees: function (_page, _rows) {
                vc.component.reportPayFeeDetailInfo.conditions.floorId = "";
                vc.component.reportPayFeeDetailInfo.conditions.floorName = "";
                vc.component.reportPayFeeDetailInfo.conditions.unitId = "";
                vc.component.reportPayFeeDetailInfo.conditions.roomNum = "";
                vc.component.reportPayFeeDetailInfo.conditions.primeRate = "";
                vc.component.reportPayFeeDetailInfo.conditions.startTime = "";
                vc.component.reportPayFeeDetailInfo.conditions.endTime = "";
                vc.component.reportPayFeeDetailInfo.conditions.configId = "";
                var param = {
                    params: vc.component.reportPayFeeDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryPayFeeDetail',
                    param,
                    function (json, res) {
                        var _reportPayFeeDetailInfo = JSON.parse(json);
                        vc.component.reportPayFeeDetailInfo.total = _reportPayFeeDetailInfo.total;
                        vc.component.reportPayFeeDetailInfo.records = _reportPayFeeDetailInfo.records;
                        vc.component.reportPayFeeDetailInfo.fees = _reportPayFeeDetailInfo.data;
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalReceivableAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalReceivableAmount = _reportPayFeeDetailInfo.sumTotal.totalReceivableAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalReceivableAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalReceivedAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalReceivedAmount = _reportPayFeeDetailInfo.sumTotal.totalReceivedAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalReceivedAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allReceivableAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allReceivableAmount = _reportPayFeeDetailInfo.sumTotal.allReceivableAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allReceivableAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allReceivedAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allReceivedAmount = _reportPayFeeDetailInfo.sumTotal.allReceivedAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allReceivedAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalPreferentialAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalPreferentialAmount = _reportPayFeeDetailInfo.sumTotal.totalPreferentialAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalPreferentialAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalDeductionAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalDeductionAmount = _reportPayFeeDetailInfo.sumTotal.totalDeductionAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalDeductionAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalLateFee) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalLateFee = (_reportPayFeeDetailInfo.sumTotal.totalLateFee)*(-1);
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalLateFee = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalVacantHousingDiscount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalVacantHousingDiscount = _reportPayFeeDetailInfo.sumTotal.totalVacantHousingDiscount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalVacantHousingDiscount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalVacantHousingReduction) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.totalVacantHousingReduction = _reportPayFeeDetailInfo.sumTotal.totalVacantHousingReduction;
                        } else {
                            vc.component.reportPayFeeDetailInfo.totalVacantHousingReduction = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allPreferentialAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allPreferentialAmount = _reportPayFeeDetailInfo.sumTotal.allPreferentialAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allPreferentialAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allDeductionAmount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allDeductionAmount = _reportPayFeeDetailInfo.sumTotal.allDeductionAmount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allDeductionAmount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allLateFee) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allLateFee = (_reportPayFeeDetailInfo.sumTotal.allLateFee)*(-1);
                        } else {
                            vc.component.reportPayFeeDetailInfo.allLateFee = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allVacantHousingDiscount) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allVacantHousingDiscount = _reportPayFeeDetailInfo.sumTotal.allVacantHousingDiscount;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allVacantHousingDiscount = "0.0";
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allVacantHousingReduction) != 'undefined') {
                            vc.component.reportPayFeeDetailInfo.allVacantHousingReduction = _reportPayFeeDetailInfo.sumTotal.allVacantHousingReduction;
                        } else {
                            vc.component.reportPayFeeDetailInfo.allVacantHousingReduction = "0.0";
                        }
                        if (_reportPayFeeDetailInfo.data.length > 0) {
                            vc.component.reportPayFeeDetailInfo.feeConfigDtos = _reportPayFeeDetailInfo.data[0].feeConfigDtos;
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportPayFeeDetailInfo.records,
                            currentPage: _page,
                            dataCount: vc.component.reportPayFeeDetailInfo.total
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
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
                            vc.component.reportPayFeeDetailInfo.roomUnits = tmpUnits;
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
                if (vc.component.reportPayFeeDetailInfo.moreCondition) {
                    vc.component.reportPayFeeDetailInfo.moreCondition = false;
                } else {
                    vc.component.reportPayFeeDetailInfo.moreCondition = true;
                }
            },
            _exportFee: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportPayFeeDetail&' + vc.objToGetParam($that.reportPayFeeDetailInfo.conditions));
            }
        }
    });
})(window.vc);
