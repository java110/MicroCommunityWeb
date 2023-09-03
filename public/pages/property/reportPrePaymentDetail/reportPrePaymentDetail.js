/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportPrePaymentDetailInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                roomUnits: [],
                primeRates: [],
                feeConfigDtos: [],
                states: [],
                feeTypeCds: [],
                prepaymentStates: [],
                billStates: [],
                totalReceivableAmount: 0.0,
                totalReceivedAmount: 0.0,
                totalOweAmount: 0.0,
                totalPayableAmount: 0.0,
                allReceivableAmount: 0.0,
                allReceivedAmount: 0.0,
                allPayableAmount: 0.0,
                totalPreferentialAmount: 0.0,
                totalDeductionAmount: 0.0,
                totalLateFee: 0.0,
                totalVacantHousingDiscount: 0.0,
                totalVacantHousingReduction: 0.0,
                allPreferentialAmount: 0.0,
                allDeductionAmount: 0.0,
                allOweAmount: 0.0,
                allLateFee: 0.0,
                allVacantHousingDiscount: 0.0,
                allVacantHousingReduction: 0.0,
                allGiftAmount: 0.0,
                totalGiftAmount: 0.0,
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    roomName: '', // 1-1-101
                    unitId: '',
                    configId: '',
                    primeRate: '',
                    state: '',
                    prepaymentState: '',
                    billState: '',
                    feeTypeCd: '888800010001',
                    startTime: '',
                    endTime: '',
                    startBeginTime: '',
                    startFinishTime: '',
                    endBeginTime: '',
                    endFinishTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._selectConfig();
            //与字典表支付方式关联
            vc.getDict('pay_fee_detail', "prime_rate", function (_data) {
                vc.component.reportPrePaymentDetailInfo.primeRates = _data;
            });
            //与字典表费用状态关联
            vc.getDict('report_fee_month_statistics_bill', "prepayment_state", function (_data) {
                vc.component.reportPrePaymentDetailInfo.prepaymentStates = _data;
            });
            //与字典表账单状态关联
            vc.getDict('report_fee_month_statistics_bill', "bill_state", function (_data) {
                vc.component.reportPrePaymentDetailInfo.billStates = _data;
            });
            //与字典表费用类型关联
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.reportPrePaymentDetailInfo.feeTypeCds = _data;
            });
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function () {
            vc.on('reportPrePaymentDetail', 'chooseFloor', function (_param) {
                vc.component.reportPrePaymentDetailInfo.conditions.floorId = _param.floorId;
                vc.component.reportPrePaymentDetailInfo.conditions.floorName = _param.floorName;
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
                        vc.component.reportPrePaymentDetailInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportPrePaymentDetailInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportPrePaymentDetailInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportPrePaymentDetailInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportPrePaymentDetailInfo.conditions.endTime = '';
                        }
                    });
                $(".startBeginTime").datetimepicker({
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
                $(".startFinishTime").datetimepicker({
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
                $('.startBeginTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startBeginTime").val();
                        vc.component.reportPrePaymentDetailInfo.conditions.startBeginTime = value;
                    });
                $('.startFinishTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startFinishTime").val();
                        vc.component.reportPrePaymentDetailInfo.conditions.startFinishTime = value;
                        let start = Date.parse(new Date($that.reportPrePaymentDetailInfo.conditions.startBeginTime))
                        let end = Date.parse(new Date($that.reportPrePaymentDetailInfo.conditions.startFinishTime))
                        if (start - end >= 0) {
                            vc.toast("费用开始的结束时间必须大于费用开始的开始时间")
                            $that.reportPrePaymentDetailInfo.conditions.startFinishTime = '';
                        }
                    });
                $(".endBeginTime").datetimepicker({
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
                $(".endFinishTime").datetimepicker({
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
                $('.endBeginTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endBeginTime").val();
                        vc.component.reportPrePaymentDetailInfo.conditions.endBeginTime = value;
                    });
                $('.endFinishTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endFinishTime").val();
                        vc.component.reportPrePaymentDetailInfo.conditions.endFinishTime = value;
                        let start = Date.parse(new Date($that.reportPrePaymentDetailInfo.conditions.endBeginTime))
                        let end = Date.parse(new Date($that.reportPrePaymentDetailInfo.conditions.endFinishTime))
                        if (start - end >= 0) {
                            vc.toast("费用开始的结束时间必须大于费用开始的开始时间")
                            $that.reportPrePaymentDetailInfo.conditions.endFinishTime = '';
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

                document.getElementsByClassName(' form-control startBeginTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control startFinishTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(' form-control endBeginTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endFinishTime")[0].addEventListener('click', myfunc)

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
                vc.component.reportPrePaymentDetailInfo.conditions.page = _page;
                vc.component.reportPrePaymentDetailInfo.conditions.row = _rows;
                vc.component.reportPrePaymentDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportPrePaymentDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatisticsPrepayment/queryPayFeePrepaymentDetail',
                    param,
                    function (json, res) {
                        var _reportPrePaymentDetailInfo = JSON.parse(json);
                        vc.component.reportPrePaymentDetailInfo.total = _reportPrePaymentDetailInfo.total;
                        vc.component.reportPrePaymentDetailInfo.records = _reportPrePaymentDetailInfo.records;
                        vc.component.reportPrePaymentDetailInfo.fees = _reportPrePaymentDetailInfo.data;
                        vc.component.reportPrePaymentDetailInfo.fees.forEach(item => {
                            item.lateFee = (item.lateFee * -1).toFixed(2);
                        })
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.totalReceivableAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.totalReceivableAmount = _reportPrePaymentDetailInfo.sumTotal.totalReceivableAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.totalReceivableAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.totalReceivedAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.totalReceivedAmount = _reportPrePaymentDetailInfo.sumTotal.totalReceivedAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.totalReceivedAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.totalOweAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.totalOweAmount = _reportPrePaymentDetailInfo.sumTotal.totalOweAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.totalOweAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.totalPayableAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.totalPayableAmount = _reportPrePaymentDetailInfo.sumTotal.totalPayableAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.totalPayableAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.allReceivableAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.allReceivableAmount = _reportPrePaymentDetailInfo.sumTotal.allReceivableAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.allReceivableAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.allReceivedAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.allReceivedAmount = _reportPrePaymentDetailInfo.sumTotal.allReceivedAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.allReceivedAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.allOweAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.allOweAmount = _reportPrePaymentDetailInfo.sumTotal.allOweAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.allOweAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.allPayableAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.allPayableAmount = _reportPrePaymentDetailInfo.sumTotal.allPayableAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.allPayableAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.totalPreferentialAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.totalPreferentialAmount = _reportPrePaymentDetailInfo.sumTotal.totalPreferentialAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.totalPreferentialAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.totalDeductionAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.totalDeductionAmount = _reportPrePaymentDetailInfo.sumTotal.totalDeductionAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.totalDeductionAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.totalLateFee) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.totalLateFee = (_reportPrePaymentDetailInfo.sumTotal.totalLateFee) * (-1);
                        } else {
                            vc.component.reportPrePaymentDetailInfo.totalLateFee = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.totalVacantHousingDiscount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.totalVacantHousingDiscount = _reportPrePaymentDetailInfo.sumTotal.totalVacantHousingDiscount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.totalVacantHousingDiscount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.totalVacantHousingReduction) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.totalVacantHousingReduction = _reportPrePaymentDetailInfo.sumTotal.totalVacantHousingReduction;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.totalVacantHousingReduction = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.allPreferentialAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.allPreferentialAmount = _reportPrePaymentDetailInfo.sumTotal.allPreferentialAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.allPreferentialAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.allDeductionAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.allDeductionAmount = _reportPrePaymentDetailInfo.sumTotal.allDeductionAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.allDeductionAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.allLateFee) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.allLateFee = (_reportPrePaymentDetailInfo.sumTotal.allLateFee) * (-1);
                        } else {
                            vc.component.reportPrePaymentDetailInfo.allLateFee = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.allVacantHousingDiscount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.allVacantHousingDiscount = _reportPrePaymentDetailInfo.sumTotal.allVacantHousingDiscount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.allVacantHousingDiscount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.allVacantHousingReduction) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.allVacantHousingReduction = _reportPrePaymentDetailInfo.sumTotal.allVacantHousingReduction;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.allVacantHousingReduction = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.allGiftAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.allGiftAmount = _reportPrePaymentDetailInfo.sumTotal.allGiftAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.allGiftAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportPrePaymentDetailInfo.sumTotal.totalGiftAmount) != 'undefined') {
                            vc.component.reportPrePaymentDetailInfo.totalGiftAmount = _reportPrePaymentDetailInfo.sumTotal.totalGiftAmount;
                        } else {
                            vc.component.reportPrePaymentDetailInfo.totalGiftAmount = 0.0.toFixed(2);
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportPrePaymentDetailInfo.records,
                            dataCount: vc.component.reportPrePaymentDetailInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetMethod: function (_page, _rows) {
                vc.component._resetListFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetListFees: function (_page, _rows) {
                vc.component.reportPrePaymentDetailInfo.conditions.floorId = "";
                vc.component.reportPrePaymentDetailInfo.conditions.floorName = "";
                vc.component.reportPrePaymentDetailInfo.conditions.unitId = "";
                vc.component.reportPrePaymentDetailInfo.conditions.roomNum = "";
                vc.component.reportPrePaymentDetailInfo.conditions.roomName = "";
                vc.component.reportPrePaymentDetailInfo.conditions.primeRate = "";
                vc.component.reportPrePaymentDetailInfo.conditions.startTime = "";
                vc.component.reportPrePaymentDetailInfo.conditions.endTime = "";
                vc.component.reportPrePaymentDetailInfo.conditions.startBeginTime = "";
                vc.component.reportPrePaymentDetailInfo.conditions.startFinishTime = "";
                vc.component.reportPrePaymentDetailInfo.conditions.endBeginTime = "";
                vc.component.reportPrePaymentDetailInfo.conditions.endFinishTime = "";
                vc.component.reportPrePaymentDetailInfo.conditions.configId = "";
                vc.component.reportPrePaymentDetailInfo.conditions.state = "";
                vc.component.reportPrePaymentDetailInfo.conditions.prepaymentState = "";
                vc.component.reportPrePaymentDetailInfo.conditions.billState = "";
                vc.component.reportPrePaymentDetailInfo.conditions.feeTypeCd = "888800010001";
                // 清除下拉框选项
                vc.component.reportPrePaymentDetailInfo.roomUnits = [];
                vc.component.reportPrePaymentDetailInfo.feeConfigDtos = [];
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            loadUnits: function (_floorId) {
                var param = {
                    params: {
                        floorId: _floorId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet(
                    '/unit.queryUnits',
                    param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            let tmpUnits = JSON.parse(json);
                            vc.component.reportPrePaymentDetailInfo.roomUnits = tmpUnits;
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
            //根据费用类型查询费用项
            _selectConfig: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: vc.component.reportPrePaymentDetailInfo.conditions.feeTypeCd,
                        isFlag: "0"
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.reportPrePaymentDetailInfo.feeConfigDtos = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _moreCondition: function () {
                if (vc.component.reportPrePaymentDetailInfo.moreCondition) {
                    vc.component.reportPrePaymentDetailInfo.moreCondition = false;
                } else {
                    vc.component.reportPrePaymentDetailInfo.moreCondition = true;
                }
            },
            _exportFee: function () {
                /*vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportPrePaymentDetail&' + vc.objToGetParam($that.reportPrePaymentDetailInfo.conditions));*/
                vc.component.reportPrePaymentDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.reportPrePaymentDetailInfo.conditions.pagePath = 'reportPrePaymentDetail';
                let param = {
                    params: vc.component.reportPrePaymentDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    });
})(window.vc);