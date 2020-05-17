/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 30;
    vc.extends({
        data: {
            returnPayFeeManageInfo: {
                returnPayFees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                returnPayFeeStates:'',
                name: '',
                auditReturnFeeId:'',
                returnPayFee:'',
                conditions: {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: '',
                    detailId: '',
                    userCode:'',
                    state:'',
                    feeTypeCd:''
                }
            }
        },
        _initMethod: function () {
            vc.component._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('return_pay_fee',"state",function(_data){
                vc.component.returnPayFeeManageInfo.returnPayFeeStates = _data;
            });
            vc.getDict('pay_fee_config',"fee_type_cd",function(_data){
                vc.component.returnPayFeeManageInfo.feeTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listpayFees(_currentPage, DEFAULT_ROWS);
            });

            vc.on('returnPayFeeManage','notifyAuditInfo',function(_auditInfo){
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
                vc.http.apiGet('returnPayFee.listReturnPayFees',
                    param,
                    function (json) {
                        var _returnPayFeeManageInfo = JSON.parse(json);
                        vc.component.returnPayFeeManageInfo.total = _returnPayFeeManageInfo.total;
                        vc.component.returnPayFeeManageInfo.records = parseInt(_returnPayFeeManageInfo.total/_rows +1);
                        vc.component.returnPayFeeManageInfo.returnPayFees = _returnPayFeeManageInfo.returnPayFees;
                        vc.emit('pagination', 'init', {
                            total: vc.component.returnPayFeeManageInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryReturnPayFeeMethod: function () {
                vc.component._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _auditReturnPayFeeState:function(_auditInfo){
                vc.component.returnPayFeeManageInfo.returnPayFee.state = _auditInfo.state;
                //vc.component.returnPayFeeManageInfo.returnPayFee.remark = _auditInfo.remark;
                let _returnPayFee = vc.component.returnPayFeeManageInfo.returnPayFee;
                vc.http.apiPost(
                    'returnPayFee.updateReturnPayFee',
                    JSON.stringify(_returnPayFee),
                    {
                        emulateJSON:true
                    },
                    function(json,res){
                        if(res.status == 200){
                            vc.component._listReturnPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
                            return ;
                        }
                        vc.toast(json);
                    },
                    function(errInfo,error){
                        vc.toast(errInfo);
                    });
            },
            _openReturnPayFeeAuditModel(_payFee){
                vc.component.returnPayFeeManageInfo.returnPayFee = _payFee;
                vc.emit('audit','openAuditModal',{});
            }


        }
    });
})(window.vc);
