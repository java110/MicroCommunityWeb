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
                    state: '',
                    feeTypeCd: '',
                    payerObjName: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('return_pay_fee', "state", function (_data) {
                vc.component.returnPayFeeManageInfo.returnPayFeeStates = _data;
            });
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.returnPayFeeManageInfo.feeTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReturnPayFees(_currentPage, DEFAULT_ROWS);
            });
            vc.on('returnPayFeeManage', 'notifyAuditInfo', function (_auditInfo) {
                vc.component._auditReturnPayFeeState(_auditInfo);
            });
        },
        methods: {
            _listReturnPayFees: function (_page, _rows) {
                vc.component.returnPayFeeManageInfo.conditions.page = _page;
                vc.component.returnPayFeeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.returnPayFeeManageInfo.conditions
                };
                param.params.detailId = param.params.detailId.trim();
                param.params.payerObjName = param.params.payerObjName.trim();
                vc.http.apiGet('returnPayFee.listReturnPayFees',
                    param,
                    function (json) {
                        var _returnPayFeeManageInfo = JSON.parse(json);
                        vc.component.returnPayFeeManageInfo.total = _returnPayFeeManageInfo.total;
                        // vc.component.returnPayFeeManageInfo.records = parseInt(_returnPayFeeManageInfo.total/_rows +1);
                        vc.component.returnPayFeeManageInfo.records = _returnPayFeeManageInfo.records;
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
                        vc.component.returnPayFeeManageInfo.returnPayFees = _returnPayFeeManageInfo.returnPayFees;
                        vc.emit('pagination', 'init', {
                            total: vc.component.returnPayFeeManageInfo.records,
                            dataCount: vc.component.returnPayFeeManageInfo.total,
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
                vc.component._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetReturnPayFeeMethod: function () {
                vc.component.returnPayFeeManageInfo.conditions.detailId = "";
                vc.component.returnPayFeeManageInfo.conditions.feeTypeCd = "";
                vc.component.returnPayFeeManageInfo.conditions.state = "";
                vc.component.returnPayFeeManageInfo.conditions.payerObjName = "";
                vc.component._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _auditReturnPayFeeState: function (_auditInfo) {
                vc.component.returnPayFeeManageInfo.returnPayFee.state = _auditInfo.state;
                //vc.component.returnPayFeeManageInfo.returnPayFee.remark = _auditInfo.remark;
                let _returnPayFee = vc.component.returnPayFeeManageInfo.returnPayFee;
                vc.http.apiPost(
                    'returnPayFee.updateReturnPayFee',
                    JSON.stringify(_returnPayFee), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            vc.component._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                    });
            },
            _moreCondition: function () {
                if (vc.component.returnPayFeeManageInfo.moreCondition) {
                    vc.component.returnPayFeeManageInfo.moreCondition = false;
                } else {
                    vc.component.returnPayFeeManageInfo.moreCondition = true;
                }
            },
            _openReturnPayFeeAuditModel(_payFee) {
                vc.component.returnPayFeeManageInfo.returnPayFee = _payFee;
                vc.emit('audit', 'openAuditModal', {});
            },
            _toReturnFeeDetail: function (_payFee) {
                vc.jumpToPage('/#/pages/property/propertyFee?feeId=' + _payFee.feeId);
            }
        }
    });
})(window.vc);