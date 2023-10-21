/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeManageInfo: {
                payFees: [],
                payObjTypes: [],
                primeRates: [],
                payFeeSum: [],
                communitys:[],
                total: 0,
                records: 1,
                totalReceivableAmount: 0.0,
                totalReceivedAmount: 0.0,
                allReceivableAmount: 0.0,
                allReceivedAmount: 0.0,
                moreCondition: false,
                name: '',
                conditions: {
                    communityId: '',
                    payObjType: '',
                    startTime: '',
                    endTime: '',
                    primeRate: '',
                    userName: ''
                }
            }
        },
        _initMethod: function () {
            $that.payFeeManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
            $that._initDate();
            $that._loadStaffCommunitys();
            $that._listpayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            //$that._listFeeType();
            vc.getDict('pay_fee', "payer_obj_type", function (_data) {
                $that.payFeeManageInfo.payObjTypes = _data;
            });
            vc.getDict('pay_fee_detail', "prime_rate", function (_data) {
                $that.payFeeManageInfo.primeRates = _data;
            })
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listpayFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function () {
                $(".start_time").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true,
                    clearBtn: true
                });
                $(".end_time").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true,
                    clearBtn: true
                });
                $('.start_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".start_time").val();
                        $that.payFeeManageInfo.conditions.startTime = value;
                    });
                $('.end_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".end_time").val();
                        $that.payFeeManageInfo.conditions.endTime = value;
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
            _listpayFees: function (_page, _rows) {
                $that.payFeeManageInfo.conditions.page = _page;
                $that.payFeeManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.payFeeManageInfo.conditions
                };
                param.params.userName = param.params.userName.trim();
                //发送get请求
                vc.http.get('payFeeManage',
                    'list',
                    param,
                    function (json, res) {
                        var _payFeeManageInfo = JSON.parse(json);
                        $that.payFeeManageInfo.total = _payFeeManageInfo.total;
                        $that.payFeeManageInfo.records = Math.ceil(_payFeeManageInfo.total / _rows);
                        $that.payFeeManageInfo.payFees = _payFeeManageInfo.payFees;
                        $that.payFeeManageInfo.payFeeSum = _payFeeManageInfo.payFeeSum;
                        var allReceivableAmount = 0.0;
                        var allReceivedAmount = 0.0;
                        if (_payFeeManageInfo.payFeeSum.length > 0) {
                            if (_payFeeManageInfo.payFeeSum[0].allReceivableAmount != "") {
                                allReceivableAmount = parseFloat(_payFeeManageInfo.payFeeSum[0].allReceivableAmount).toFixed(2);
                                $that.payFeeManageInfo.allReceivableAmount = allReceivableAmount;
                            } else {
                                $that.payFeeManageInfo.allReceivableAmount = "0.0";
                            }
                            if (_payFeeManageInfo.payFeeSum[0].allReceivedAmount != "") {
                                allReceivedAmount = parseFloat(_payFeeManageInfo.payFeeSum[0].allReceivedAmount).toFixed(2);
                                $that.payFeeManageInfo.allReceivedAmount = allReceivedAmount;
                            } else {
                                $that.payFeeManageInfo.allReceivedAmount = "0.0";
                            }
                        } else {
                            $that.payFeeManageInfo.allReceivableAmount = "0.0";
                            $that.payFeeManageInfo.allReceivedAmount = "0.0";
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
                            $that.payFeeManageInfo.totalReceivableAmount = receivableAmount;
                            $that.payFeeManageInfo.totalReceivedAmount = receivedAmount;
                        } else {
                            $that.payFeeManageInfo.totalReceivableAmount = "0.0";
                            $that.payFeeManageInfo.totalReceivedAmount = "0.0";
                        }
                        vc.emit('pagination', 'init', {
                            total: $that.payFeeManageInfo.records,
                            dataCount: $that.payFeeManageInfo.total,
                            currentPage: _page,
                            // dataCount: $that.payFeeManageInfo.total
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryPayFeeMethod: function () {
                $that._listpayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetPayFeeMethod: function () {
                $that.payFeeManageInfo.conditions.payObjType = "";
                $that.payFeeManageInfo.conditions.startTime = "";
                $that.payFeeManageInfo.conditions.endTime = "";
                $that.payFeeManageInfo.conditions.userName = "";
                $that.payFeeManageInfo.conditions.primeRate = "";
                $that._listpayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.payFeeManageInfo.moreCondition) {
                    $that.payFeeManageInfo.moreCondition = false;
                } else {
                    $that.payFeeManageInfo.moreCondition = true;
                }
            },
            //导出
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportPayFeeManage&' + vc.objToGetParam($that.payFeeManageInfo.conditions));
            },
            _listFeeType: function () {
                var param = {
                    params: {
                        "hc": "cc@cc"
                    }
                };
                //发送get请求
                vc.http.get('payFeeManage',
                    'listFeeType',
                    param,
                    function (json, res) {
                        var _feeTypesInfo = JSON.parse(json);
                        $that.payFeeManageInfo.payFeeTypes = _feeTypesInfo;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _detailFee: function (_fee) {
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _loadStaffCommunitys: function () {
                let param = {
                    params: {
                        _uid: '123mlkdinkldldijdhuudjdjkkd',
                        page: 1,
                        row: 100,
                    }
                };
                vc.http.apiGet('/community.listMyEnteredCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _data = JSON.parse(json);
                            $that.payFeeManageInfo.communitys = _data.communitys;
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _changCommunity:function(){
                $that._listpayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);