/**
 入驻小区
 **/
(function(vc) {
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
                primeRates: [],
                feeConfigDtos: [],
                states: [],
                feeTypeCds: [],
                floors: [],
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
                allGiftAmount: 0.0,
                totalGiftAmount: 0.0,
                conditions: {
                    floorId: '',
                    roomNum: '',
                    roomName: '', // 1-1-101
                    configId: '',
                    primeRate: '',
                    state: '',
                    feeTypeCd: '',
                    startTime: '',
                    endTime: '',
                    feeStartTime: '',
                    feeEndTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            $that._initDate();
            $that.loadFloors();
            $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            //与字典表支付方式关联
            vc.getDict('pay_fee_detail', "prime_rate", function(_data) {
                $that.reportPayFeeDetailInfo.primeRates = _data;
            });
            //与字典表费用状态关联
            vc.getDict('pay_fee_detail', "state", function(_data) {
                $that.reportPayFeeDetailInfo.states = _data;
            });
            //与字典表费用类型关联
            vc.getDict('pay_fee_config', "fee_type_cd", function(_data) {
                $that.reportPayFeeDetailInfo.feeTypeCds = _data;
            });
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function() {
            vc.on('reportPayFeeDetail', 'chooseFloor', function(_param) {
                $that.reportPayFeeDetailInfo.conditions.floorId = _param.floorId;
                $that.reportPayFeeDetailInfo.conditions.floorName = _param.floorName;
                $that.loadUnits(_param.floorId);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function() {
                vc.initDate('startTime', function(_value) {
                    $that.reportPayFeeDetailInfo.conditions.startTime = _value;
                })
                vc.initDate('endTime', function(_value) {
                    $that.reportPayFeeDetailInfo.conditions.endTime = _value;
                    let start = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.startTime))
                    let end = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.endTime))
                    if (start - end > 0) {
                        vc.toast("结束时间必须大于开始时间")
                        $that.reportPayFeeDetailInfo.conditions.endTime = '';
                    }
                });

                vc.initDate('feeStartTime', function(_value) {
                    $that.reportPayFeeDetailInfo.conditions.feeStartTime = _value;
                })
                vc.initDate('feeEndTime', function(_value) {
                    $that.reportPayFeeDetailInfo.conditions.feeEndTime = _value;
                    let start = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.feeStartTime))
                    let end = Date.parse(new Date($that.reportPayFeeDetailInfo.conditions.feeEndTime))
                    if (start - end >= 0) {
                        vc.toast("结束时间必须大于开始时间")
                        $that.reportPayFeeDetailInfo.conditions.feeEndTime = '';
                    }
                })
            },
            //查询
            _queryMethod: function() {
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listFees: function(_page, _rows) {
                $that.reportPayFeeDetailInfo.conditions.page = _page;
                $that.reportPayFeeDetailInfo.conditions.row = _rows;
                $that.reportPayFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.reportPayFeeDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryPayFeeDetail',
                    param,
                    function(json, res) {
                        var _reportPayFeeDetailInfo = JSON.parse(json);
                        $that.reportPayFeeDetailInfo.total = _reportPayFeeDetailInfo.total;
                        $that.reportPayFeeDetailInfo.records = _reportPayFeeDetailInfo.records;
                        $that.reportPayFeeDetailInfo.fees = _reportPayFeeDetailInfo.data;
                        $that.reportPayFeeDetailInfo.fees.forEach(item => {
                            item.lateFee = (item.lateFee * -1).toFixed(2);
                        })
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalReceivableAmount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.totalReceivableAmount = _reportPayFeeDetailInfo.sumTotal.totalReceivableAmount;
                        } else {
                            $that.reportPayFeeDetailInfo.totalReceivableAmount = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalReceivedAmount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.totalReceivedAmount = _reportPayFeeDetailInfo.sumTotal.totalReceivedAmount;
                        } else {
                            $that.reportPayFeeDetailInfo.totalReceivedAmount = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allReceivableAmount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.allReceivableAmount = _reportPayFeeDetailInfo.sumTotal.allReceivableAmount;
                        } else {
                            $that.reportPayFeeDetailInfo.allReceivableAmount = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allReceivedAmount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.allReceivedAmount = _reportPayFeeDetailInfo.sumTotal.allReceivedAmount;
                        } else {
                            $that.reportPayFeeDetailInfo.allReceivedAmount = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalPreferentialAmount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.totalPreferentialAmount = _reportPayFeeDetailInfo.sumTotal.totalPreferentialAmount;
                        } else {
                            $that.reportPayFeeDetailInfo.totalPreferentialAmount = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalDeductionAmount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.totalDeductionAmount = _reportPayFeeDetailInfo.sumTotal.totalDeductionAmount;
                        } else {
                            $that.reportPayFeeDetailInfo.totalDeductionAmount = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalLateFee) != 'undefined') {
                            $that.reportPayFeeDetailInfo.totalLateFee = (_reportPayFeeDetailInfo.sumTotal.totalLateFee) * (-1);
                        } else {
                            $that.reportPayFeeDetailInfo.totalLateFee = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalVacantHousingDiscount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.totalVacantHousingDiscount = _reportPayFeeDetailInfo.sumTotal.totalVacantHousingDiscount;
                        } else {
                            $that.reportPayFeeDetailInfo.totalVacantHousingDiscount = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalVacantHousingReduction) != 'undefined') {
                            $that.reportPayFeeDetailInfo.totalVacantHousingReduction = _reportPayFeeDetailInfo.sumTotal.totalVacantHousingReduction;
                        } else {
                            $that.reportPayFeeDetailInfo.totalVacantHousingReduction = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allPreferentialAmount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.allPreferentialAmount = _reportPayFeeDetailInfo.sumTotal.allPreferentialAmount;
                        } else {
                            $that.reportPayFeeDetailInfo.allPreferentialAmount = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allDeductionAmount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.allDeductionAmount = _reportPayFeeDetailInfo.sumTotal.allDeductionAmount;
                        } else {
                            $that.reportPayFeeDetailInfo.allDeductionAmount = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allLateFee) != 'undefined') {
                            $that.reportPayFeeDetailInfo.allLateFee = (_reportPayFeeDetailInfo.sumTotal.allLateFee) * (-1);
                        } else {
                            $that.reportPayFeeDetailInfo.allLateFee = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allVacantHousingDiscount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.allVacantHousingDiscount = _reportPayFeeDetailInfo.sumTotal.allVacantHousingDiscount;
                        } else {
                            $that.reportPayFeeDetailInfo.allVacantHousingDiscount = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allVacantHousingReduction) != 'undefined') {
                            $that.reportPayFeeDetailInfo.allVacantHousingReduction = _reportPayFeeDetailInfo.sumTotal.allVacantHousingReduction;
                        } else {
                            $that.reportPayFeeDetailInfo.allVacantHousingReduction = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.allGiftAmount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.allGiftAmount = _reportPayFeeDetailInfo.sumTotal.allGiftAmount;
                        } else {
                            $that.reportPayFeeDetailInfo.allGiftAmount = 0.0.toFixed(2);
                        }
                        if (typeof(_reportPayFeeDetailInfo.sumTotal.totalGiftAmount) != 'undefined') {
                            $that.reportPayFeeDetailInfo.totalGiftAmount = _reportPayFeeDetailInfo.sumTotal.totalGiftAmount;
                        } else {
                            $that.reportPayFeeDetailInfo.totalGiftAmount = 0.0.toFixed(2);
                        }
                        vc.emit('pagination', 'init', {
                            total: $that.reportPayFeeDetailInfo.records,
                            dataCount: $that.reportPayFeeDetailInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetMethod: function(_page, _rows) {
                $that._resetListFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetListFees: function(_page, _rows) {
                $that.reportPayFeeDetailInfo.conditions.floorId = "";
                $that.reportPayFeeDetailInfo.conditions.roomNum = "";
                $that.reportPayFeeDetailInfo.conditions.roomName = "";
                $that.reportPayFeeDetailInfo.conditions.primeRate = "";
                $that.reportPayFeeDetailInfo.conditions.startTime = "";
                $that.reportPayFeeDetailInfo.conditions.endTime = "";
                $that.reportPayFeeDetailInfo.conditions.feeStartTime = "";
                $that.reportPayFeeDetailInfo.conditions.feeEndTime = "";
                $that.reportPayFeeDetailInfo.conditions.configId = "";
                $that.reportPayFeeDetailInfo.conditions.state = "";
                $that.reportPayFeeDetailInfo.conditions.feeTypeCd = "";
                $that.reportPayFeeDetailInfo.feeConfigDtos = [];
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            loadFloors: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet(
                    '/floor.queryFloors',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.reportPayFeeDetailInfo.floors = _json.apiFloorDataVoList;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //根据费用类型查询费用项
            _selectConfig: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: $that.reportPayFeeDetailInfo.conditions.feeTypeCd,
                        isFlag: "0"
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function(json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.reportPayFeeDetailInfo.feeConfigDtos = _feeConfigManageInfo.feeConfigs;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _moreCondition: function() {
                if ($that.reportPayFeeDetailInfo.moreCondition) {
                    $that.reportPayFeeDetailInfo.moreCondition = false;
                } else {
                    $that.reportPayFeeDetailInfo.moreCondition = true;
                }
            },
            _exportFee: function() {
                //vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportPayFeeDetail&' + vc.objToGetParam($that.reportPayFeeDetailInfo.conditions));
                $that.reportPayFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that.reportPayFeeDetailInfo.conditions.pagePath = 'reportPayFeeDetail';
                let param = {
                    params: $that.reportPayFeeDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            }
        }
    });
})(window.vc);