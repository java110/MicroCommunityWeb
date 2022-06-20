/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeDetailInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                totalReceivableAmount: 0.0,
                allReceivableAmount: 0.0,
                totalReceivedAmount: 0.0,
                allReceivedAmount: 0.0,
                totalPreferentialAmount: 0.0,
                allHisOweReceivedAmount: 0.0,
                primeRates: [],
                roomUnits: [],
                feeConfigDtos: [],
                feeTypeCds: [],
                conditions: {
                    floorId: '',
                    floorName: '',
                    configId: '',
                    feeTypeCd: '',
                    feeName: '',
                    roomNum: '',
                    unitId: '',
                    startTime: '',
                    endTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._initDate();
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            //与字典表费用类型关联
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.reportFeeDetailInfo.feeTypeCds = _data;
            });
            // vc.initDateMonth('startTime', function (_startTime) {
            //     $that.reportFeeDetailInfo.conditions.startTime = _startTime;
            // });
            // vc.initDateMonth('endTime', function (_endTime) {
            //     $that.reportFeeDetailInfo.conditions.endTime = _endTime;
            //     let start = Date.parse(new Date($that.reportFeeDetailInfo.conditions.startTime + "-01"))
            //     let end = Date.parse(new Date($that.reportFeeDetailInfo.conditions.endTime + "-01"))
            //     if (start - end >= 0) {
            //         vc.toast("结束时间必须大于开始时间")
            //         $that.reportFeeDetailInfo.conditions.endTime = '';
            //     }
            // });
        },
        _initEvent: function() {
            vc.on('reportFeeDetail', 'chooseFloor', function(_param) {
                vc.component.reportFeeDetailInfo.conditions.floorId = _param.floorId;
                vc.component.reportFeeDetailInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function() {
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
                    .on('changeDate', function(ev) {
                        var value = $(".startTime").val();
                        vc.component.reportFeeDetailInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".endTime").val();
                        vc.component.reportFeeDetailInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportFeeDetailInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportFeeDetailInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportFeeDetailInfo.conditions.endTime = '';
                        }
                    });
            },
            _queryMethod: function() {
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listFees: function(_page, _rows) {
                vc.component.reportFeeDetailInfo.conditions.page = _page;
                vc.component.reportFeeDetailInfo.conditions.row = _rows;
                vc.component.reportFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportFeeDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryFeeDetail',
                    param,
                    function(json, res) {
                        var _reportFeeDetailInfo = JSON.parse(json);
                        vc.component.reportFeeDetailInfo.total = _reportFeeDetailInfo.total;
                        vc.component.reportFeeDetailInfo.records = _reportFeeDetailInfo.records;
                        vc.component.reportFeeDetailInfo.fees = _reportFeeDetailInfo.data;
                        //计算小计
                        let _totalReceivableAmount = 0.0;
                        let _totalReceivedAmount = 0.0;
                        let _totalPreferentialAmount = 0.0;

                        _reportFeeDetailInfo.data.forEach(item => {
                            _totalReceivableAmount += parseFloat(item.receivableAmount);
                            _totalReceivedAmount += parseFloat(item.receivedAmount);
                            _totalPreferentialAmount += parseFloat(item.oweAmount);
                        });

                        $that.reportFeeDetailInfo.totalReceivableAmount = _totalReceivableAmount.toFixed(2);
                        $that.reportFeeDetailInfo.totalReceivedAmount = _totalReceivedAmount.toFixed(2);
                        $that.reportFeeDetailInfo.totalPreferentialAmount = _totalPreferentialAmount.toFixed(2);

                        if (_reportFeeDetailInfo.data.length > 0) {
                            $that.reportFeeDetailInfo.allReceivableAmount = _reportFeeDetailInfo.data[0].allReceivableAmount;
                            $that.reportFeeDetailInfo.allReceivedAmount = _reportFeeDetailInfo.data[0].allReceivedAmount;
                            $that.reportFeeDetailInfo.allOweAmount = _reportFeeDetailInfo.data[0].allOweAmount;
                            $that.reportFeeDetailInfo.allHisOweReceivedAmount = _reportFeeDetailInfo.data[0].allHisOweReceivedAmount;
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportFeeDetailInfo.records,
                            dataCount: vc.component.reportFeeDetailInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetMethod: function() {
                vc.component._resetListFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置方法
            _resetListFees: function(_page, _rows) {
                vc.component.reportFeeDetailInfo.conditions.floorName = '';
                vc.component.reportFeeDetailInfo.conditions.floorId = '';
                vc.component.reportFeeDetailInfo.conditions.unitId = '';
                vc.component.reportFeeDetailInfo.conditions.roomNum = '';
                vc.component.reportFeeDetailInfo.conditions.startTime = '';
                vc.component.reportFeeDetailInfo.conditions.endTime = '';
                vc.component.reportFeeDetailInfo.conditions.configId = '';
                vc.component.reportFeeDetailInfo.conditions.feeTypeCd = '';
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            loadUnits: function(_floorId) {
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
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            let tmpUnits = JSON.parse(json);
                            vc.component.reportFeeDetailInfo.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //根据费用类型查询费用项
            _selectConfig: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: vc.component.reportFeeDetailInfo.conditions.feeTypeCd,
                        isFlag: "0"
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFeeAdd', 'list', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.reportFeeDetailInfo.feeConfigDtos = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _openChooseFloorMethod: function() {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            _moreCondition: function() {
                if (vc.component.reportFeeDetailInfo.moreCondition) {
                    vc.component.reportFeeDetailInfo.moreCondition = false;
                } else {
                    vc.component.reportFeeDetailInfo.moreCondition = true;
                }
            },
            _exportFee: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFeeDetail&' + vc.objToGetParam($that.reportFeeDetailInfo.conditions));
            },
            _computeSum: function(a, b) {
                return (parseFloat(a) + parseFloat(b)).toFixed(2)
            },
            _computeOweFee: function(fee) {
                let _oweFee = (parseFloat(fee.hisOweAmount) + parseFloat(fee.curReceivableAmount) - parseFloat(fee.curReceivedAmount) - parseFloat(fee.hisOweReceivedAmount)).toFixed(2);
                if (_oweFee < 0) {
                    return 0;
                }
                return _oweFee;
            },
            _computeTotalOweAmount: function() {
                if (!window.$that) {
                    return 0;
                }
                if (!$that.reportFeeDetailInfo) {
                    return 0;
                }
                let _amount = 0;
                $that.reportFeeDetailInfo.fees.forEach(item => {
                    _amount += parseFloat($that._computeOweFee(item));
                })
                console.log(_amount)
                return _amount.toFixed(2);
            },
            _computeTotalHisOweReceivedAmount: function() {
                if (!window.$that) {
                    return 0;
                }
                if (!$that.reportFeeDetailInfo) {
                    return 0;
                }
                let _amount = 0;
                $that.reportFeeDetailInfo.fees.forEach(item => {
                    _amount += parseFloat(item.hisOweReceivedAmount);
                })
                return _amount.toFixed(2);
            }
        }
    });
})(window.vc);