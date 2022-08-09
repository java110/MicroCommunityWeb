/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 1;
    vc.extends({
        data: {
            purchaseApplyDetailInfo: {
                resourceNames: '',
                state: '',
                totalPrice: '',
                purchaseTotalPrice: '',
                applyOrderId: '',
                description: '',
                createTime: '',
                userName: '',
                endUserName: '',
                endUserTel: '',
                stateName: '',
                resOrderType: '',
                purchaseApplyDetailVo: [],
                auditUsers: [],
                warehousingWay: ''
            }
        },
        _initMethod: function() {
            vc.component.purchaseApplyDetailInfo.applyOrderId = vc.getParam('applyOrderId');
            vc.component.purchaseApplyDetailInfo.resOrderType = vc.getParam('resOrderType');
            vc.component._listPurchaseApply(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {},
        methods: {
            _listPurchaseApply: function(_page, _rows) {
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        applyOrderId: vc.component.purchaseApplyDetailInfo.applyOrderId,
                        resOrderType: vc.component.purchaseApplyDetailInfo.resOrderType
                    }
                };
                //发送get请求
                vc.http.apiGet('/purchaseApply.listPurchaseApplys',
                    param,
                    function(json, res) {
                        var _purchaseApplyDetailInfo = JSON.parse(json);
                        var _purchaseApply = _purchaseApplyDetailInfo.purchaseApplys;
                        vc.copyObject(_purchaseApply[0], vc.component.purchaseApplyDetailInfo);
                        if (vc.component.purchaseApplyDetailInfo.warehousingWay == 20000) {
                            $that._loadAuditUser();
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadAuditUser: function() {
                var param = {
                    params: {
                        businessKey: vc.component.purchaseApplyDetailInfo.applyOrderId,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listWorkflowAuditInfo',
                    param,
                    function(json, res) {
                        var _json = JSON.parse(json);
                        $that.purchaseApplyDetailInfo.auditUsers = _json.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _callBackListPurchaseApply: function() {
                vc.getBack();
            },
            _printPurchaseApply: function() {
                window.open("/print.html#/pages/property/printPurchaseApply?applyOrderId=" + $that.purchaseApplyDetailInfo.applyOrderId + "&resOrderType=" + $that.purchaseApplyDetailInfo.resOrderType)
                    //vc.emit('printPurchaseApply', 'openPrintPurchaseApplyModal',vc.component.purchaseApplyDetailInfo);
            }
        }
    });
})(window.vc);