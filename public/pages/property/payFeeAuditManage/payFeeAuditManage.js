/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeAuditManageInfo: {
                payFees: [],
                payObjTypes:[],
                total: 0,
                records: 1,
                moreCondition: false,
                name: '',
                conditions: {
                    communityId: vc.getCurrentCommunity().communityId,
                    payObjType: '',
                    startTime: '',
                    endTime: '',
                    userCode:'',
                    state:''
                }
            }
        },
        _initMethod: function () {
            vc.component._listPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            //vc.component._listFeeType();
            vc.getDict('pay_fee',"payer_obj_type",function(_data){
                vc.component.payFeeAuditManageInfo.payObjTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listpayFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listPayFees: function (_page, _rows) {
                vc.component.payFeeAuditManageInfo.conditions.page = _page;
                vc.component.payFeeAuditManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.payFeeAuditManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/payFeeAudit/queryPayFeeAudit',
                    param,
                    function (json, res) {
                        var _payFeeAuditManageInfo = JSON.parse(json);
                        vc.component.payFeeAuditManageInfo.total = _payFeeAuditManageInfo.total;
                        vc.component.payFeeAuditManageInfo.records = parseInt(_payFeeAuditManageInfo.total/_rows +1);
                        vc.component.payFeeAuditManageInfo.payFees = _payFeeAuditManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.payFeeAuditManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryPayFeeMethod: function () {
                vc.component._listPayFees(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.payFeeAuditManageInfo.moreCondition) {
                    vc.component.payFeeAuditManageInfo.moreCondition = false;
                } else {
                    vc.component.payFeeAuditManageInfo.moreCondition = true;
                }
            },
            _listFeeType: function () {
                var param = {
                    params:{
                        "hc":"cc@cc"
                    }
                };
                //发送get请求
                vc.http.get('payFeeAuditManage',
                    'listFeeType',
                    param,
                    function (json, res) {
                        var _feeTypesInfo = JSON.parse(json);
                        vc.component.payFeeAuditManageInfo.payFeeTypes = _feeTypesInfo;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _detailFee:function(_fee){
                vc.jumpToPage('/admin.html#/pages/property/propertyFee?'+vc.objToGetParam(_fee));
            }
        }
    });
})(window.vc);
