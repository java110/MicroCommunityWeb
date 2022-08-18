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
                    payerObjName: '',
                    startTime: '',
                    endTime: ''
                }
            }
        },
        _initMethod: function () {
            // 初始化方法（时间插件）
            vc.component._initReturnPayFeeManageDateInfo();
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
                        vc.component.returnPayFeeManageInfo.conditions.startTime = value;
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
                        var start = Date.parse(new Date(vc.component.returnPayFeeManageInfo.conditions.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间")
                            $(".endTime").val('')
                        } else {
                            vc.component.returnPayFeeManageInfo.conditions.endTime = value;
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
                vc.component.returnPayFeeManageInfo.conditions.page = _page;
                vc.component.returnPayFeeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.returnPayFeeManageInfo.conditions
                };
                param.params.detailId = param.params.detailId.trim();
                param.params.payerObjName = param.params.payerObjName.trim();
                vc.http.apiGet('/returnPayFee.listReturnPayFees',
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
                vc.component.returnPayFeeManageInfo.conditions.startTime = "";
                vc.component.returnPayFeeManageInfo.conditions.endTime = "";
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
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.component._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
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
                if (vc.component.returnPayFeeManageInfo.moreCondition) {
                    vc.component.returnPayFeeManageInfo.moreCondition = false;
                } else {
                    vc.component.returnPayFeeManageInfo.moreCondition = true;
                }
            },
            _exportFee: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=returnPayFeeManage&' + vc.objToGetParam($that.returnPayFeeManageInfo.conditions));
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