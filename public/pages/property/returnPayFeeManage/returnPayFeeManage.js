/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            returnPayFeeManageInfo: {
                returnPayFees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                returnPayFeeStates: '',
                name: '',
                auditReturnFeeId: '',
                returnPayFee: '',
                conditions: {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: '',
                    detailId: '',
                    userCode: '',
                    state: '1000',
                    feeTypeCd: '',
                    payerObjName: '',
                    startTime: '',
                    endTime: '',
                    auditPersonName: '',
                    applyPersonName: ''
                }
            }
        },
        _initMethod: function () {
            // 初始化方法（时间插件）
            $that._initReturnPayFeeManageDateInfo();
            $that._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('return_pay_fee', "state", function (_data) {
                $that.returnPayFeeManageInfo.returnPayFeeStates = _data;
            });
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                $that.returnPayFeeManageInfo.feeTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listReturnPayFees(_currentPage, DEFAULT_ROWS);
            });
            vc.on('returnPayFeeManage', 'notifyAuditInfo', function (_auditInfo) {
                $that._auditReturnPayFeeState(_auditInfo);
            });
        },
        methods: {
            // 新增初始化时间插件方法
            _initReturnPayFeeManageDateInfo: function () {
                $('.startTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        $that.returnPayFeeManageInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        var start = Date.parse(new Date($that.returnPayFeeManageInfo.conditions.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间")
                            $(".endTime").val('')
                        } else {
                            $that.returnPayFeeManageInfo.conditions.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listReturnPayFees: function (_page, _rows) {
                $that.returnPayFeeManageInfo.conditions.page = _page;
                $that.returnPayFeeManageInfo.conditions.row = _rows;
                var param = {
                    params: $that.returnPayFeeManageInfo.conditions
                };
                param.params.detailId = param.params.detailId.trim();
                param.params.payerObjName = param.params.payerObjName.trim();
                param.params.applyPersonName = param.params.applyPersonName.trim();
                param.params.auditPersonName = param.params.auditPersonName.trim();
                vc.http.apiGet('/returnPayFee.listReturnPayFees',
                    param,
                    function (json) {
                        var _returnPayFeeManageInfo = JSON.parse(json);
                        $that.returnPayFeeManageInfo.total = _returnPayFeeManageInfo.total;
                        // $that.returnPayFeeManageInfo.records = parseInt(_returnPayFeeManageInfo.total/_rows +1);
                        $that.returnPayFeeManageInfo.records = _returnPayFeeManageInfo.records;
                        if (_returnPayFeeManageInfo.returnPayFees != null && _returnPayFeeManageInfo.returnPayFees.length > 0) {
                            _returnPayFeeManageInfo.returnPayFees.forEach(item => {
                                if (item.feeAccountDetailDtoList != null && item.feeAccountDetailDtoList.length > 0) {
                                    item.feeAccountDetailDtoList.forEach(item2 => {
                                        if (item2.state == '1001' || item2.state == '1003') { //无抵扣或积分抵扣
                                            return;
                                        } else {
                                            item.receivedAmount = (parseFloat(item.receivedAmount) - parseFloat(item2.amount)).toFixed(2);
                                        }
                                    })
                                }
                            });
                        }
                        $that.returnPayFeeManageInfo.returnPayFees = _returnPayFeeManageInfo.returnPayFees;
                        vc.emit('pagination', 'init', {
                            total: $that.returnPayFeeManageInfo.records,
                            dataCount: $that.returnPayFeeManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryReturnPayFeeMethod: function () {
                $that._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetReturnPayFeeMethod: function () {
                $that.returnPayFeeManageInfo.conditions.detailId = "";
                $that.returnPayFeeManageInfo.conditions.feeTypeCd = "";
                $that.returnPayFeeManageInfo.conditions.state = "";
                $that.returnPayFeeManageInfo.conditions.payerObjName = "";
                $that.returnPayFeeManageInfo.conditions.startTime = "";
                $that.returnPayFeeManageInfo.conditions.endTime = "";
                $that.returnPayFeeManageInfo.conditions.applyPersonName = "";
                $that.returnPayFeeManageInfo.conditions.auditPersonName = "";
                $that._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _auditReturnPayFeeState: function (_auditInfo) {
                $that.returnPayFeeManageInfo.returnPayFee.state = _auditInfo.state;
                $that.returnPayFeeManageInfo.returnPayFee.payableAmount = 0.0;
                //$that.returnPayFeeManageInfo.returnPayFee.remark = _auditInfo.remark;
                let _returnPayFee = $that.returnPayFeeManageInfo.returnPayFee;
                vc.http.apiPost(
                    '/returnPayFee.updateReturnPayFee',
                    JSON.stringify(_returnPayFee), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $that._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
                            vc.toast("审核成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                    });
            },
            _moreCondition: function () {
                if ($that.returnPayFeeManageInfo.moreCondition) {
                    $that.returnPayFeeManageInfo.moreCondition = false;
                } else {
                    $that.returnPayFeeManageInfo.moreCondition = true;
                }
            },
            _exportFee: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=returnPayFeeManage&' + vc.objToGetParam($that.returnPayFeeManageInfo.conditions));
            },
            _openReturnPayFeeAuditModel(_payFee) {
                $that.returnPayFeeManageInfo.returnPayFee = _payFee;
                vc.emit('audit', 'openAuditModal', {});
            },
            _toReturnFeeDetail: function (_payFee) {
                vc.jumpToPage('/#/pages/property/propertyFee?feeId=' + _payFee.feeId);
            }
        }
    });
})(window.vc);