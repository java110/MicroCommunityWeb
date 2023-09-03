/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportCollectFeesInfo: {
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
                vc.component.reportCollectFeesInfo.primeRates = _data;
            });
            //与字典表费用状态关联
            vc.getDict('report_fee_month_statistics_bill', "prepayment_state", function (_data) {
                vc.component.reportCollectFeesInfo.prepaymentStates = _data;
            });
            //与字典表费用类型关联
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.reportCollectFeesInfo.feeTypeCds = _data;
            });
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function () {
            vc.on('reportCollectFees', 'chooseFloor', function (_param) {
                vc.component.reportCollectFeesInfo.conditions.floorId = _param.floorId;
                vc.component.reportCollectFeesInfo.conditions.floorName = _param.floorName;
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
                        vc.component.reportCollectFeesInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportCollectFeesInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportCollectFeesInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportCollectFeesInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportCollectFeesInfo.conditions.endTime = '';
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
                        vc.component.reportCollectFeesInfo.conditions.startBeginTime = value;
                    });
                $('.startFinishTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startFinishTime").val();
                        vc.component.reportCollectFeesInfo.conditions.startFinishTime = value;
                        let start = Date.parse(new Date($that.reportCollectFeesInfo.conditions.startBeginTime))
                        let end = Date.parse(new Date($that.reportCollectFeesInfo.conditions.startFinishTime))
                        if (start - end >= 0) {
                            vc.toast("费用开始的结束时间必须大于费用开始的开始时间")
                            $that.reportCollectFeesInfo.conditions.startFinishTime = '';
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
                        vc.component.reportCollectFeesInfo.conditions.endBeginTime = value;
                    });
                $('.endFinishTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endFinishTime").val();
                        vc.component.reportCollectFeesInfo.conditions.endFinishTime = value;
                        let start = Date.parse(new Date($that.reportCollectFeesInfo.conditions.endBeginTime))
                        let end = Date.parse(new Date($that.reportCollectFeesInfo.conditions.endFinishTime))
                        if (start - end >= 0) {
                            vc.toast("费用开始的结束时间必须大于费用开始的开始时间")
                            $that.reportCollectFeesInfo.conditions.endFinishTime = '';
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
                vc.component.reportCollectFeesInfo.conditions.page = _page;
                vc.component.reportCollectFeesInfo.conditions.row = _rows;
                vc.component.reportCollectFeesInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportCollectFeesInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatisticsPrepayment/queryReportCollectFees',
                    param,
                    function (json, res) {
                        var _reportCollectFeesInfo = JSON.parse(json);
                        vc.component.reportCollectFeesInfo.total = _reportCollectFeesInfo.total;
                        vc.component.reportCollectFeesInfo.records = _reportCollectFeesInfo.records;
                        vc.component.reportCollectFeesInfo.fees = _reportCollectFeesInfo.data;
                        vc.component.reportCollectFeesInfo.fees.forEach(item => {
                            item.lateFee = (item.lateFee * -1).toFixed(2);
                        })
                        if (typeof (_reportCollectFeesInfo.sumTotal.totalReceivableAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.totalReceivableAmount = _reportCollectFeesInfo.sumTotal.totalReceivableAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.totalReceivableAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.totalReceivedAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.totalReceivedAmount = _reportCollectFeesInfo.sumTotal.totalReceivedAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.totalReceivedAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.totalOweAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.totalOweAmount = _reportCollectFeesInfo.sumTotal.totalOweAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.totalOweAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.totalPayableAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.totalPayableAmount = _reportCollectFeesInfo.sumTotal.totalPayableAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.totalPayableAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.allReceivableAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.allReceivableAmount = _reportCollectFeesInfo.sumTotal.allReceivableAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.allReceivableAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.allReceivedAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.allReceivedAmount = _reportCollectFeesInfo.sumTotal.allReceivedAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.allReceivedAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.allOweAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.allOweAmount = _reportCollectFeesInfo.sumTotal.allOweAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.allOweAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.allPayableAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.allPayableAmount = _reportCollectFeesInfo.sumTotal.allPayableAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.allPayableAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.totalPreferentialAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.totalPreferentialAmount = _reportCollectFeesInfo.sumTotal.totalPreferentialAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.totalPreferentialAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.totalDeductionAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.totalDeductionAmount = _reportCollectFeesInfo.sumTotal.totalDeductionAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.totalDeductionAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.totalLateFee) != 'undefined') {
                            vc.component.reportCollectFeesInfo.totalLateFee = (_reportCollectFeesInfo.sumTotal.totalLateFee) * (-1);
                        } else {
                            vc.component.reportCollectFeesInfo.totalLateFee = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.totalVacantHousingDiscount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.totalVacantHousingDiscount = _reportCollectFeesInfo.sumTotal.totalVacantHousingDiscount;
                        } else {
                            vc.component.reportCollectFeesInfo.totalVacantHousingDiscount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.totalVacantHousingReduction) != 'undefined') {
                            vc.component.reportCollectFeesInfo.totalVacantHousingReduction = _reportCollectFeesInfo.sumTotal.totalVacantHousingReduction;
                        } else {
                            vc.component.reportCollectFeesInfo.totalVacantHousingReduction = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.allPreferentialAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.allPreferentialAmount = _reportCollectFeesInfo.sumTotal.allPreferentialAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.allPreferentialAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.allDeductionAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.allDeductionAmount = _reportCollectFeesInfo.sumTotal.allDeductionAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.allDeductionAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.allLateFee) != 'undefined') {
                            vc.component.reportCollectFeesInfo.allLateFee = (_reportCollectFeesInfo.sumTotal.allLateFee) * (-1);
                        } else {
                            vc.component.reportCollectFeesInfo.allLateFee = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.allVacantHousingDiscount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.allVacantHousingDiscount = _reportCollectFeesInfo.sumTotal.allVacantHousingDiscount;
                        } else {
                            vc.component.reportCollectFeesInfo.allVacantHousingDiscount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.allVacantHousingReduction) != 'undefined') {
                            vc.component.reportCollectFeesInfo.allVacantHousingReduction = _reportCollectFeesInfo.sumTotal.allVacantHousingReduction;
                        } else {
                            vc.component.reportCollectFeesInfo.allVacantHousingReduction = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.allGiftAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.allGiftAmount = _reportCollectFeesInfo.sumTotal.allGiftAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.allGiftAmount = 0.0.toFixed(2);
                        }
                        if (typeof (_reportCollectFeesInfo.sumTotal.totalGiftAmount) != 'undefined') {
                            vc.component.reportCollectFeesInfo.totalGiftAmount = _reportCollectFeesInfo.sumTotal.totalGiftAmount;
                        } else {
                            vc.component.reportCollectFeesInfo.totalGiftAmount = 0.0.toFixed(2);
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportCollectFeesInfo.records,
                            dataCount: vc.component.reportCollectFeesInfo.total,
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
                vc.component.reportCollectFeesInfo.conditions.floorId = "";
                vc.component.reportCollectFeesInfo.conditions.floorName = "";
                vc.component.reportCollectFeesInfo.conditions.unitId = "";
                vc.component.reportCollectFeesInfo.conditions.roomNum = "";
                vc.component.reportCollectFeesInfo.conditions.roomName = "";
                vc.component.reportCollectFeesInfo.conditions.primeRate = "";
                vc.component.reportCollectFeesInfo.conditions.startTime = "";
                vc.component.reportCollectFeesInfo.conditions.endTime = "";
                vc.component.reportCollectFeesInfo.conditions.startBeginTime = "";
                vc.component.reportCollectFeesInfo.conditions.startFinishTime = "";
                vc.component.reportCollectFeesInfo.conditions.endBeginTime = "";
                vc.component.reportCollectFeesInfo.conditions.endFinishTime = "";
                vc.component.reportCollectFeesInfo.conditions.configId = "";
                vc.component.reportCollectFeesInfo.conditions.state = "";
                vc.component.reportCollectFeesInfo.conditions.prepaymentState = "";
                vc.component.reportCollectFeesInfo.conditions.feeTypeCd = "";
                // 清除下拉框选项
                vc.component.reportCollectFeesInfo.roomUnits = [];
                vc.component.reportCollectFeesInfo.feeConfigDtos = [];
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
                            vc.component.reportCollectFeesInfo.roomUnits = tmpUnits;
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
                        feeTypeCd: vc.component.reportCollectFeesInfo.conditions.feeTypeCd,
                        isFlag: "0"
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.reportCollectFeesInfo.feeConfigDtos = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _moreCondition: function () {
                if (vc.component.reportCollectFeesInfo.moreCondition) {
                    vc.component.reportCollectFeesInfo.moreCondition = false;
                } else {
                    vc.component.reportCollectFeesInfo.moreCondition = true;
                }
            },
            _exportFee: function () {
                // vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportCollectFees&' + vc.objToGetParam($that.reportCollectFeesInfo.conditions));
                vc.component.reportCollectFeesInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.reportCollectFeesInfo.conditions.pagePath = 'reportCollectFees';
                let param = {
                    params: vc.component.reportCollectFeesInfo.conditions
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