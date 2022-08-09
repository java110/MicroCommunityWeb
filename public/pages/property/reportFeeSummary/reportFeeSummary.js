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
                feeConfigs: [],
                feeConfigNames: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                roomUnits: [],
                totalReceivableAmount: 0.0,
                allReceivableAmount: 0.0,
                totalReceivedAmount: 0.0,
                allReceivedAmount: 0.0,
                totalPreferentialAmount: 0.0,
                allHisOweReceivedAmount: 0.0,
                allOweAmount: 0.0,
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
        watch: {
            'reportFeeSummaryInfo.feeConfigs': function () { //'goodList'是我要渲染的对象，也就是我要等到它渲染完才能调用函数
                this.$nextTick(function () {
                    $('#configIds').selectpicker({
                        title: '请选择费用项',
                        styleBase: 'form-control',
                        width: 'auto'
                    });
                })
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            $that._listFeeConfigs();
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function () {
            $('#configIds').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                // do something...
                if (isSelected) {
                    $that.reportFeeSummaryInfo.feeConfigNames.push({
                        configId: $that.reportFeeSummaryInfo.feeConfigs[clickedIndex].configId,
                        configName: $that.reportFeeSummaryInfo.feeConfigs[clickedIndex].feeName
                    })
                } else {
                    let _feeConfigNames = [];
                    $that.reportFeeSummaryInfo.feeConfigNames.forEach(item => {
                        if (item.configId != $that.reportFeeSummaryInfo.feeConfigs[clickedIndex].configId) {
                            _feeConfigNames.push(item);
                        }
                    });
                    $that.reportFeeSummaryInfo.feeConfigNames = _feeConfigNames;
                }
            });
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
                let _configIds = "";
                $that.reportFeeSummaryInfo.feeConfigNames.forEach(item => {
                    _configIds += (item.configId + ',')
                })
                if (_configIds.endsWith(',')) {
                    _configIds = _configIds.substring(0, _configIds.length - 1);
                }
                param.params.configIds = _configIds;
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryReportFeeSummary',
                    param,
                    function (json, res) {
                        var _reportFeeSummaryInfo = JSON.parse(json);
                        vc.component.reportFeeSummaryInfo.total = _reportFeeSummaryInfo.total;
                        vc.component.reportFeeSummaryInfo.records = _reportFeeSummaryInfo.records;
                        vc.component.reportFeeSummaryInfo.fees = _reportFeeSummaryInfo.data;
                        //计算小计
                        let _totalReceivableAmount = 0.0;
                        let _totalReceivedAmount = 0.0;
                        let _totalPreferentialAmount = 0.0;
                        _reportFeeSummaryInfo.data.forEach(item => {
                            _totalReceivableAmount += parseFloat(item.receivableAmount);
                            _totalReceivedAmount += parseFloat(item.receivedAmount);
                            _totalPreferentialAmount += parseFloat(item.oweAmount);
                        });
                        $that.reportFeeSummaryInfo.totalReceivableAmount = _totalReceivableAmount.toFixed(2);
                        $that.reportFeeSummaryInfo.totalReceivedAmount = _totalReceivedAmount.toFixed(2);
                        $that.reportFeeSummaryInfo.totalPreferentialAmount = _totalPreferentialAmount.toFixed(2);
                        if (_reportFeeSummaryInfo.data.length > 0) {
                            $that.reportFeeSummaryInfo.allReceivableAmount = _reportFeeSummaryInfo.data[0].allReceivableAmount;
                            $that.reportFeeSummaryInfo.allReceivedAmount = _reportFeeSummaryInfo.data[0].allReceivedAmount;
                            $that.reportFeeSummaryInfo.allOweAmount = _reportFeeSummaryInfo.data[0].allOweAmount;
                            $that.reportFeeSummaryInfo.allHisOweReceivedAmount = _reportFeeSummaryInfo.data[0].allHisOweReceivedAmount;
                        } else {
                            $that.reportFeeSummaryInfo.allReceivedAmount = 0.0.toFixed(2);
                            $that.reportFeeSummaryInfo.allHisOweReceivedAmount = 0.0.toFixed(2);
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportFeeSummaryInfo.records,
                            dataCount: vc.component.reportFeeSummaryInfo.total,
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
            _listFeeConfigs: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.reportFeeSummaryInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _getFeeReceivedAmountAmount: function (item, fee) {
                let _items = fee.feeConfigDtos;
                if (!_items) {
                    return 0;
                }
                let _value = 0;
                _items.forEach(tmp => {
                    if (tmp.configId == item.configId) {
                        _value = tmp.amount;
                        return;
                    }
                })
                return _value;
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFeeSummary&' + vc.objToGetParam($that.reportFeeSummaryInfo.conditions));
            },
            _computeSum: function (a, b) {
                return (parseFloat(a) + parseFloat(b)).toFixed(2)
            },
            _computeOweFee: function (fee) {
                let _oweFee = (parseFloat(fee.hisOweAmount) + parseFloat(fee.curReceivableAmount) - parseFloat(fee.curReceivedAmount) - parseFloat(fee.hisOweReceivedAmount)).toFixed(2);
                if (_oweFee < 0) {
                    return 0;
                }
                return _oweFee;
            },
            _computeTotalOweAmount: function () {
                if (!window.$that) {
                    return 0;
                }
                if (!$that.reportFeeSummaryInfo) {
                    return 0;
                }
                let _amount = 0;
                $that.reportFeeSummaryInfo.fees.forEach(item => {
                    _amount += parseFloat($that._computeOweFee(item));
                })
                return _amount.toFixed(2);
            },
            _computeTotalHisOweReceivedAmount: function () {
                if (!window.$that) {
                    return 0;
                }
                if (!$that.reportFeeSummaryInfo) {
                    return 0;
                }
                let _amount = 0;
                $that.reportFeeSummaryInfo.fees.forEach(item => {
                    _amount += parseFloat(item.hisOweReceivedAmount);
                })
                return _amount.toFixed(2);
            },
            _toDetail: function (_fee) {
                let _configIds = "";
                $that.reportFeeSummaryInfo.feeConfigNames.forEach(item => {
                    _configIds += (item.configId + ',')
                })
                if (_configIds.endsWith(',')) {
                    _configIds = _configIds.substring(0, _configIds.length - 1);
                }
                vc.jumpToPage('/#/pages/property/reportFeeSummaryDetail?feeYear=' + _fee.feeYear + "&feeMonth=" + _fee.feeMonth + "&configIds=" + _configIds + "&" + vc.objToGetParam($that.reportFeeSummaryInfo.conditions))
            },
            _printFeeSummary: function() {
                let _param = vc.objToGetParam($that.reportFeeSummaryInfo.conditions);

                window.open('/print.html#/pages/property/reportFeeSummaryPrint?' + _param);
            }
        }
    });
})(window.vc);