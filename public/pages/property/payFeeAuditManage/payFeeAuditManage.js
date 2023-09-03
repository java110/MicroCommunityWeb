/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeAuditManageInfo: {
                payFees: [],
                selectFeeDetailIds:[],
                payObjTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                name: '',
                conditions: {
                    communityId: vc.getCurrentCommunity().communityId,
                    payObjType: '',
                    startTime: '',
                    endTime: '',
                    userCode: '',
                    state: '1010',
                    payerObjId: ''
                },
                curPayFee: {}
            }
        },
        watch: { // 监视双向绑定的数据数组
            payFeeAuditManageInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.payFeeAuditManageInfo.selectFeeDetailIds.length == $that.payFeeAuditManageInfo.payFees.length) {
                        document.querySelector('#quan').checked = true;
                    } else {
                        document.querySelector('#quan').checked = false;
                    }
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function() {
            vc.component._listPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            //vc.component._listFeeType();
            vc.getDict('pay_fee', "payer_obj_type", function(_data) {
                vc.component.payFeeAuditManageInfo.payObjTypes = _data;
            });
        },
        _initEvent: function() {
            vc.on('payFeeAuditManage', 'listPayFee', function(_param) {
                vc.component._listPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listPayFees(_currentPage, DEFAULT_ROWS);
            });
            vc.on('payFeeAuditManage', 'audtiNotify', function(_param) {
                $that._auditFee(_param);
            });
        },
        methods: {
            _listPayFees: function(_page, _rows) {
                vc.component.payFeeAuditManageInfo.conditions.page = _page;
                vc.component.payFeeAuditManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.payFeeAuditManageInfo.conditions
                };
                $that.payFeeAuditManageInfo.selectFeeDetailIds = [];
                //发送get请求
                vc.http.apiGet('/payFeeAudit/queryPayFeeAudit',
                    param,
                    function(json, res) {
                        var _payFeeAuditManageInfo = JSON.parse(json);
                        vc.component.payFeeAuditManageInfo.total = _payFeeAuditManageInfo.total;
                        vc.component.payFeeAuditManageInfo.records = parseInt(_payFeeAuditManageInfo.total / _rows + 1);
                        vc.component.payFeeAuditManageInfo.payFees = _payFeeAuditManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.payFeeAuditManageInfo.records,
                            dataCount: vc.component.payFeeAuditManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryPayFeeMethod: function() {
                vc.component._listPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetPayFeeMethod: function() {
                vc.resetObject($that.payFeeAuditManageInfo.conditions);
                $that.payFeeAuditManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that.payFeeAuditManageInfo.conditions.state = "";
                vc.component._listPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.payFeeAuditManageInfo.moreCondition) {
                    vc.component.payFeeAuditManageInfo.moreCondition = false;
                } else {
                    vc.component.payFeeAuditManageInfo.moreCondition = true;
                }
            },
            _listFeeType: function() {
                var param = {
                    params: {
                        "hc": "cc@cc"
                    }
                };
                //发送get请求
                vc.http.get('payFeeAuditManage',
                    'listFeeType',
                    param,
                    function(json, res) {
                        var _feeTypesInfo = JSON.parse(json);
                        vc.component.payFeeAuditManageInfo.payFeeTypes = _feeTypesInfo;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _detailFee: function(_fee) {
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _openAuditFeeModal: function(_payFee) { // 打开 审核框
                $that.payFeeAuditManageInfo.curPayFee = _payFee;
                $that.payFeeAuditManageInfo.selectFeeDetailIds = [];
                vc.emit('audit', 'openAuditModal', {});
            },
            _batchAuditFees:function(){
                if($that.payFeeAuditManageInfo.selectFeeDetailIds.length<1){
                    vc.toast('请选择费用');
                    return;
                }
                $that.payFeeAuditManageInfo.curPayFee = {};
                vc.emit('audit', 'openAuditModal', {});
            },
            _auditFee: function(_param) {
                //2020 审核通过 3030 未审核
                let _state = _param.state == '1100' ? '2020' : '3030';
                let _feeDetailId = "";
                if($that.payFeeAuditManageInfo.selectFeeDetailIds.length>0){
                    _feeDetailId = $that.payFeeAuditManageInfo.selectFeeDetailIds.join(',');
                }else{
                    _feeDetailId = $that.payFeeAuditManageInfo.curPayFee.detailId;
                }
                let _data = {
                    state: _state,
                    message: _param.remark,
                    feeDetailId: _feeDetailId,
                    communityId: vc.getCurrentCommunity().communityId,
                };
                vc.http.apiPost(
                    '/payFeeAudit/savePayFeeAudit',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.component._listPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
                            $that.payFeeAuditManageInfo.selectFeeDetailIds = [];
                            $that.payFeeAuditManageInfo.curPayFee = {};
                            vc.toast("保存成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _getState: function(_state) {
                if (_state == '2020') {
                    return '审核通过';
                } else if (_state == '3030') {
                    return '审核不通过';
                }
                return '待审核';
            },
            _openRefundModel: function(_feeDetail) {
                _feeDetail.mainFeeInfo = {
                    feeId: _feeDetail.feeId
                }
                vc.emit('returnPayFee', 'openReturnPayFeeModel', _feeDetail);
            },
            checkAll: function(e) {
                let checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            $that.payFeeAuditManageInfo.selectFeeDetailIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.payFeeAuditManageInfo.selectFeeDetailIds = [];
                }
            }
        }
    });
})(window.vc);