/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeManageInfo: {
                payFees: [],
                payObjTypes: [],
                primeRates: [],
                payFeeSum: [],
                total: 0,
                records: 1,
                totalReceivableAmount: 0.0,
                totalReceivedAmount: 0.0,
                allReceivableAmount: 0.0,
                allReceivedAmount: 0.0,
                moreCondition: false,
                name: '',
                conditions: {
                    communityId: vc.getCurrentCommunity().communityId,
                    payObjType: '',
                    startTime: '',
                    endTime: '',
                    userCode: '',
                    primeRate: ''
                }
            }
        },
        _initMethod: function() {
            vc.component._initDate();
            vc.component._listpayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            //vc.component._listFeeType();
            vc.getDict('pay_fee', "payer_obj_type", function(_data) {
                vc.component.payFeeManageInfo.payObjTypes = _data;
            });
            vc.getDict('pay_fee_detail', "prime_rate", function(_data) {
                vc.component.payFeeManageInfo.primeRates = _data;
            })
        },
        _initEvent: function() {
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listpayFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function() {
                $(".start_time").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".end_time").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.start_time').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".start_time").val();
                        vc.component.payFeeManageInfo.conditions.startTime = value;
                    });
                $('.end_time').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".end_time").val();
                        vc.component.payFeeManageInfo.conditions.endTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control form_datetime  start_time')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control form_datetime  end_time")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listpayFees: function(_page, _rows) {
                vc.component.payFeeManageInfo.conditions.page = _page;
                vc.component.payFeeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.payFeeManageInfo.conditions
                };
                //发送get请求
                vc.http.get('payFeeManage',
                    'list',
                    param,
                    function(json, res) {
                        var _payFeeManageInfo = JSON.parse(json);
                        vc.component.payFeeManageInfo.total = _payFeeManageInfo.total;
                        vc.component.payFeeManageInfo.records = parseInt(_payFeeManageInfo.total / _rows + 1);
                        vc.component.payFeeManageInfo.payFees = _payFeeManageInfo.payFees;
                        vc.component.payFeeManageInfo.payFeeSum = _payFeeManageInfo.payFeeSum;
                        var allReceivableAmount = 0.0;
                        var allReceivedAmount = 0.0;
                        if (_payFeeManageInfo.payFeeSum.length > 0) {
                            if (_payFeeManageInfo.payFeeSum[0].allReceivableAmount != "") {
                                allReceivableAmount = parseFloat(_payFeeManageInfo.payFeeSum[0].allReceivableAmount).toFixed(2);
                                vc.component.payFeeManageInfo.allReceivableAmount = allReceivableAmount;
                            } else {
                                vc.component.payFeeManageInfo.allReceivableAmount = "0.0";
                            }
                            if (_payFeeManageInfo.payFeeSum[0].allReceivedAmount != "") {
                                allReceivedAmount = parseFloat(_payFeeManageInfo.payFeeSum[0].allReceivedAmount).toFixed(2);
                                vc.component.payFeeManageInfo.allReceivedAmount = allReceivedAmount;
                            } else {
                                vc.component.payFeeManageInfo.allReceivedAmount = "0.0";
                            }
                        } else {
                            vc.component.payFeeManageInfo.allReceivableAmount = "0.0";
                            vc.component.payFeeManageInfo.allReceivedAmount = "0.0";
                        }
                        var receivableAmount = 0.0;
                        var receivedAmount = 0.0;
                        if (_payFeeManageInfo.payFees.length > 0) {
                            for (var i = 0; i < _payFeeManageInfo.payFees.length; i++) {
                                receivableAmount = receivableAmount + _payFeeManageInfo.payFees[i].receivableAmount;
                                receivedAmount = receivedAmount + _payFeeManageInfo.payFees[i].receivedAmount;
                            }
                            //四舍五入保留两位
                            receivableAmount = parseFloat(receivableAmount).toFixed(2);
                            receivedAmount = parseFloat(receivedAmount).toFixed(2);
                            vc.component.payFeeManageInfo.totalReceivableAmount = receivableAmount;
                            vc.component.payFeeManageInfo.totalReceivedAmount = receivedAmount;
                        } else {
                            vc.component.payFeeManageInfo.totalReceivableAmount = "0.0";
                            vc.component.payFeeManageInfo.totalReceivedAmount = "0.0";
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.payFeeManageInfo.records,
                            dataCount: vc.component.payFeeManageInfo.total,
                            currentPage: _page,
                            // dataCount: vc.component.payFeeManageInfo.total
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetListPayFees: function(_page, _rows) {
                vc.component.payFeeManageInfo.conditions.payObjType = "";
                vc.component.payFeeManageInfo.conditions.startTime = "";
                vc.component.payFeeManageInfo.conditions.endTime = "";
                vc.component.payFeeManageInfo.conditions.userCode = "";
                vc.component.payFeeManageInfo.conditions.primeRate = "";
                var param = {
                    params: vc.component.payFeeManageInfo.conditions
                };
                //发送get请求
                vc.http.get('payFeeManage',
                    'list',
                    param,
                    function(json, res) {
                        var _payFeeManageInfo = JSON.parse(json);
                        vc.component.payFeeManageInfo.total = _payFeeManageInfo.total;
                        vc.component.payFeeManageInfo.records = parseInt(_payFeeManageInfo.total / _rows + 1);
                        vc.component.payFeeManageInfo.payFees = _payFeeManageInfo.payFees;
                        vc.component.payFeeManageInfo.payFeeSum = _payFeeManageInfo.payFeeSum;
                        var allReceivableAmount = 0.0;
                        var allReceivedAmount = 0.0;
                        if (_payFeeManageInfo.payFeeSum.length > 0) {
                            if (_payFeeManageInfo.payFeeSum[0].allReceivableAmount != "") {
                                allReceivableAmount = parseFloat(_payFeeManageInfo.payFeeSum[0].allReceivableAmount).toFixed(2);
                                vc.component.payFeeManageInfo.allReceivableAmount = allReceivableAmount;
                            } else {
                                vc.component.payFeeManageInfo.allReceivableAmount = "0.0";
                            }
                            if (_payFeeManageInfo.payFeeSum[0].allReceivedAmount != "") {
                                allReceivedAmount = parseFloat(_payFeeManageInfo.payFeeSum[0].allReceivedAmount).toFixed(2);
                                vc.component.payFeeManageInfo.allReceivedAmount = allReceivedAmount;
                            } else {
                                vc.component.payFeeManageInfo.allReceivedAmount = "0.0";
                            }
                        } else {
                            vc.component.payFeeManageInfo.allReceivableAmount = "0.0";
                            vc.component.payFeeManageInfo.allReceivedAmount = "0.0";
                        }
                        var receivableAmount = 0.0;
                        var receivedAmount = 0.0;
                        if (_payFeeManageInfo.payFees.length > 0) {
                            for (var i = 0; i < _payFeeManageInfo.payFees.length; i++) {
                                receivableAmount = receivableAmount + _payFeeManageInfo.payFees[i].receivableAmount;
                                receivedAmount = receivedAmount + _payFeeManageInfo.payFees[i].receivedAmount;
                            }
                            //四舍五入保留两位
                            receivableAmount = parseFloat(receivableAmount).toFixed(2);
                            receivedAmount = parseFloat(receivedAmount).toFixed(2);
                            vc.component.payFeeManageInfo.totalReceivableAmount = receivableAmount;
                            vc.component.payFeeManageInfo.totalReceivedAmount = receivedAmount;
                        } else {
                            vc.component.payFeeManageInfo.totalReceivableAmount = "0.0";
                            vc.component.payFeeManageInfo.totalReceivedAmount = "0.0";
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.payFeeManageInfo.records,
                            currentPage: _page,
                            // dataCount: vc.component.payFeeManageInfo.total
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryPayFeeMethod: function() {
                vc.component._listpayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetPayFeeMethod: function() {
                vc.component._resetListPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.payFeeManageInfo.moreCondition) {
                    vc.component.payFeeManageInfo.moreCondition = false;
                } else {
                    vc.component.payFeeManageInfo.moreCondition = true;
                }
            },
            //导出
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportPayFeeManage&' + vc.objToGetParam($that.payFeeManageInfo.conditions));
            },
            _listFeeType: function() {
                var param = {
                    params: {
                        "hc": "cc@cc"
                    }
                };
                //发送get请求
                vc.http.get('payFeeManage',
                    'listFeeType',
                    param,
                    function(json, res) {
                        var _feeTypesInfo = JSON.parse(json);
                        vc.component.payFeeManageInfo.payFeeTypes = _feeTypesInfo;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _detailFee: function(_fee) {
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            }
        }
    });
})(window.vc);