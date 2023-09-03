/**
 入驻小区
 **/
(function(vc) {
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
        _initMethod: function() {

            vc.component._listAllFees(DEFAULT_PAGE, DEFAULT_ROWS);
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function() {
            $('#configIds').on('changed.bs.select', function(e, clickedIndex, isSelected, previousValue) {
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
            vc.on('reportFeeSummary', 'chooseFloor', function(_param) {
                vc.component.reportFeeSummaryInfo.conditions.floorId = _param.floorId;
                vc.component.reportFeeSummaryInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询
            _queryMethod: function() {
                vc.component._listAllFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listFees: function(_yearMonth) {
                vc.component.reportFeeSummaryInfo.conditions.page = 1;
                vc.component.reportFeeSummaryInfo.conditions.row = 1;
                vc.component.reportFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that.reportFeeSummaryInfo.conditions.startDate = _yearMonth + "-01";
                // 下个月
                let _date = new Date(Date.parse($that.reportFeeSummaryInfo.conditions.startDate.replace(/-/g, "/")));
                vc.component.reportFeeSummaryInfo.conditions.endDate = vc.addMonthDate(_date, 1);

                let param = {
                    params: vc.component.reportFeeSummaryInfo.conditions
                };
                param.params.roomNum = param.params.roomNum.trim();
                // let _configIds = "";
                // $that.reportFeeSummaryInfo.feeConfigNames.forEach(item => {
                //     _configIds += (item.configId + ',')
                // })
                // if (_configIds.endsWith(',')) {
                //     _configIds = _configIds.substring(0, _configIds.length - 1);
                // }
                // param.params.configIds = _configIds;
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics.queryReportFeeSummary',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        //vc.component.reportFeeSummaryInfo.fees = _json.data;
                        _json.data.forEach(item => {
                            item.yearMonth = _yearMonth;
                            vc.component.reportFeeSummaryInfo.fees.push(item);
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetMethod: function(_page, _rows) {
                vc.component.reportFeeSummaryInfo.conditions.floorName = "";
                vc.component.reportFeeSummaryInfo.conditions.floorId = "";
                vc.component.reportFeeSummaryInfo.conditions.unitId = "";
                vc.component.reportFeeSummaryInfo.conditions.roomNum = "";
                vc.component.reportFeeSummaryInfo.conditions.startTime = "";
                vc.component.reportFeeSummaryInfo.conditions.endTime = "";
                $that._listAllFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            loadUnits: function(_floorId) {
                var param = {
                    params: {
                        floorId: _floorId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet(
                    '/unit.queryUnits',
                    param,
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            let tmpUnits = JSON.parse(json);
                            vc.component.reportFeeSummaryInfo.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openChooseFloorMethod: function() {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            _moreCondition: function() {
                if (vc.component.reportFeeSummaryInfo.moreCondition) {
                    vc.component.reportFeeSummaryInfo.moreCondition = false;
                } else {
                    vc.component.reportFeeSummaryInfo.moreCondition = true;
                }
            },

            _getFeeReceivedAmountAmount: function(item, fee) {
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
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFeeSummary&' + vc.objToGetParam($that.reportFeeSummaryInfo.conditions));
            },
            _computeSum: function(a, b) {
                return (parseFloat(a) + parseFloat(b)).toFixed(2)
            },

            _printFeeSummary: function() {
                let _param = vc.objToGetParam($that.reportFeeSummaryInfo.conditions);
                window.open('/print.html#/pages/property/reportFeeSummaryPrint?' + _param);
            },
            _listAllFees: function() {
                vc.component.reportFeeSummaryInfo.fees = [];
                let data = new Date();
                //获取年
                let year = data.getFullYear();
                //获取月
                let mon = data.getMonth() + 1;
                let arry = new Array();
                for (let i = 0; i < 12; i++) {
                    if (mon <= 0) {
                        year = year - 1;
                        mon = mon + 12;
                    }
                    if (mon < 10) {
                        mon = "0" + mon;
                    }
                    arry[i] = year + "-" + mon;
                    mon = mon - 1;
                }

                arry.forEach(item => {
                    $that._listFees(item);
                })

            }
        }
    });
})(window.vc);