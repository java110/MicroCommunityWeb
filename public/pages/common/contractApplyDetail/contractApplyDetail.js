/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 1;
    vc.extends({
        data: {
            contractDetailInfo: {
                contractId: '',
                contractName: '',
                contractCode: '',
                contractType: '',
                partyA: '',
                partyB: '',
                aContacts: '',
                bContacts: '',
                aLink: '',
                bLink: '',
                operator: '',
                operatorLink: '',
                amount: '',
                startTime: '',
                endTime: '',
                signingTime: '',
                param: '',
                planType: '',

            },
            auditUsers: []
        },
        _initMethod: function () {
            vc.component.contractDetailInfo.contractId = vc.getParam('applyOrderId');
            vc.component.contractDetailInfo.resOrderType = vc.getParam('resOrderType');
            vc.component._listPurchaseApply(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._loadAuditUser();
        },
        _initEvent: function () {

        },
        methods: {
            _listPurchaseApply: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        contractId: vc.component.contractDetailInfo.contractId,
                        resOrderType: vc.component.contractDetailInfo.resOrderType,
                    }
                };
                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json) {
                        console.log('json',json);
                        var _purchaseApplyDetailInfo = JSON.parse(json);
                        var _purchaseApply = _purchaseApplyDetailInfo[0];
                        vc.copyObject(_purchaseApply, vc.component.contractDetailInfo);
                    }, function () {
                        console.log('请求失败处理');
                    }
                );




                
            },
            _loadAuditUser: function () {
                var param = {
                    params: {
                        businessKey: vc.component.contractDetailInfo.contractId,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };

                //发送get请求
                vc.http.apiGet('workflow.listWorkflowAuditInfo',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        $that.auditUsers = _json.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _callBackListPurchaseApply: function () {
                vc.getBack();
            },
            _printPurchaseApply:function(){
                window.open("/print.html#/pages/property/printPurchaseApply?applyOrderId="+$that.contractDetailInfo.contractId+"&resOrderType="+$that.contractDetailInfo.resOrderType)
                //vc.emit('printPurchaseApply', 'openPrintPurchaseApplyModal',vc.component.contractDetailInfo);
            }
        }
    });
})(window.vc);
