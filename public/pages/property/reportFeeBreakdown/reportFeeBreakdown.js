/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeBreakdownInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                roomUnits: [],
                feeTypeCds: [],
                feeConfigDtos: [],
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
                    configId: '',
                    feeTypeCd: '',
                    startTime: '',
                    endTime: '',
                    yearMonth: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            //vc.component._initDate();
            //$that.reportFeeBreakdownInfo.conditions.yearMonth = $that._getCurrentMonth();
            $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            //关联字典表费用类型
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.reportFeeBreakdownInfo.feeTypeCds = _data;
            });
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function () {
            vc.on('reportFeeBreakdown', 'chooseFloor', function (_param) {
                vc.component.reportFeeBreakdownInfo.conditions.floorId = _param.floorId;
                vc.component.reportFeeBreakdownInfo.conditions.floorName = _param.floorName;
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
                        vc.component.reportFeeBreakdownInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportFeeBreakdownInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportFeeBreakdownInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportFeeBreakdownInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportFeeBreakdownInfo.conditions.endTime = '';
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
                vc.component.reportFeeBreakdownInfo.conditions.page = _page;
                vc.component.reportFeeBreakdownInfo.conditions.row = _rows;
                vc.component.reportFeeBreakdownInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportFeeBreakdownInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryFeeBreakdown',
                    param,
                    function (json, res) {
                        var _reportFeeBreakdownInfo = JSON.parse(json);
                        vc.component.reportFeeBreakdownInfo.total = _reportFeeBreakdownInfo.total;
                        vc.component.reportFeeBreakdownInfo.records = _reportFeeBreakdownInfo.records;
                        vc.component.reportFeeBreakdownInfo.fees = _reportFeeBreakdownInfo.data;
                        if (_reportFeeBreakdownInfo.data.length > 0) {
                            vc.component.reportFeeBreakdownInfo.feeConfigDtos = _reportFeeBreakdownInfo.data[0].feeConfigDtos;
                        }
                        //计算小计
                        let _totalReceivableAmount = 0.0;
                        let _totalReceivedAmount = 0.0;
                        let _totalPreferentialAmount = 0.0;
                        _reportFeeBreakdownInfo.data.forEach(item => {
                            _totalReceivableAmount += parseFloat(item.receivableAmount);
                            _totalReceivedAmount += parseFloat(item.receivedAmount);
                            _totalPreferentialAmount += parseFloat(item.oweAmount);
                        });
                        $that.reportFeeBreakdownInfo.totalReceivableAmount = _totalReceivableAmount.toFixed(2);
                        $that.reportFeeBreakdownInfo.totalReceivedAmount = _totalReceivedAmount.toFixed(2);
                        $that.reportFeeBreakdownInfo.totalPreferentialAmount = _totalPreferentialAmount.toFixed(2);
                        if (_reportFeeBreakdownInfo.data.length > 0) {
                            $that.reportFeeBreakdownInfo.allReceivableAmount = _reportFeeBreakdownInfo.data[0].allReceivableAmount;
                            $that.reportFeeBreakdownInfo.allReceivedAmount = _reportFeeBreakdownInfo.data[0].allReceivedAmount;
                            $that.reportFeeBreakdownInfo.allOweAmount = _reportFeeBreakdownInfo.data[0].allOweAmount;
                            $that.reportFeeBreakdownInfo.allHisOweReceivedAmount = _reportFeeBreakdownInfo.data[0].allHisOweReceivedAmount;
                        } else {
                            $that.reportFeeBreakdownInfo.allReceivableAmount = 0.0.toFixed(2);
                            $that.reportFeeBreakdownInfo.allReceivedAmount = 0.0.toFixed(2);
                            $that.reportFeeBreakdownInfo.allOweAmount = 0.0.toFixed(2);
                            $that.reportFeeBreakdownInfo.allHisOweReceivedAmount = 0.0.toFixed(2);
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportFeeBreakdownInfo.records,
                            dataCount: vc.component.reportFeeBreakdownInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置
            _resetMethod: function () {
                vc.component._resetListFee(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置方法
            _resetListFee: function (_page, _rows) {
                vc.component.reportFeeBreakdownInfo.conditions.floorId = "";
                vc.component.reportFeeBreakdownInfo.conditions.floorName = "";
                vc.component.reportFeeBreakdownInfo.conditions.unitId = "";
                vc.component.reportFeeBreakdownInfo.conditions.roomNum = "";
                vc.component.reportFeeBreakdownInfo.conditions.configId = "";
                vc.component.reportFeeBreakdownInfo.conditions.startTime = "";
                vc.component.reportFeeBreakdownInfo.conditions.endTime = "";
                vc.component.reportFeeBreakdownInfo.conditions.feeTypeCd = "";
                vc.component.reportFeeBreakdownInfo.conditions.yearMonth = "";
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            loadUnits: function (_floorId) {
                let param = {
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
                            vc.component.reportFeeBreakdownInfo.roomUnits = tmpUnits;
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
                if (vc.component.reportFeeBreakdownInfo.moreCondition) {
                    vc.component.reportFeeBreakdownInfo.moreCondition = false;
                } else {
                    vc.component.reportFeeBreakdownInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFeeBreakdown&' + vc.objToGetParam($that.reportFeeBreakdownInfo.conditions));
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
                if (!$that.reportFeeBreakdownInfo) {
                    return 0;
                }
                let _amount = 0;
                $that.reportFeeBreakdownInfo.fees.forEach(item => {
                    _amount += parseFloat($that._computeOweFee(item));
                })
                return _amount.toFixed(2);
            },
            _getCurrentMonth: function () {
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month < 10) {
                    month = '0' + month;
                }
                return year + '' + month;
            },
            _computeTotalHisOweReceivedAmount: function () {
                if (!window.$that) {
                    return 0;
                }
                if (!$that.reportFeeBreakdownInfo) {
                    return 0;
                }
                let _amount = 0;
                $that.reportFeeBreakdownInfo.fees.forEach(item => {
                    _amount += parseFloat(item.hisOweReceivedAmount);
                })
                return _amount.toFixed(2);
            },
            _toDetail: function (_fee) {
                let _condition = {
                    floorId: vc.component.reportFeeBreakdownInfo.conditions.floorId,
                    floorName: vc.component.reportFeeBreakdownInfo.conditions.floorName,
                    unitId: vc.component.reportFeeBreakdownInfo.conditions.unitId,
                    roomNum: vc.component.reportFeeBreakdownInfo.conditions.roomNum,
                    startTime: vc.component.reportFeeBreakdownInfo.conditions.startTime,
                    endTime: vc.component.reportFeeBreakdownInfo.conditions.endTime,
                    feeTypeCd: vc.component.reportFeeBreakdownInfo.conditions.feeTypeCd,
                    yearMonth: vc.component.reportFeeBreakdownInfo.conditions.yearMonth,
                }
                vc.jumpToPage('/#/pages/property/reportFeeBreakdownDetail?configId=' + _fee.configId +
                    "&" + vc.objToGetParam(_condition))
            },
            _viewFeeConfig: function (_fee) {
                vc.emit('viewFeeConfigData', 'showData', {
                    configId: _fee.configId
                })
            },
        }
    });
})(window.vc);