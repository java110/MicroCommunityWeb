/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 1;
    vc.extends({
        data: {
            allocationStorehouseDetailInfo: {
                asId: '',
                resId: '',
                resName: '',
                shaName: '',
                shzName: '',
                stock: '',
                stateName: '',
                startUserName: '',
                remark: '',
                auditUsers: []
            }
        },
        _initMethod: function () {
            vc.component.allocationStorehouseDetailInfo.asId = vc.getParam('asId');
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
                        applyOrderId: vc.component.allocationStorehouseDetailInfo.asId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listAllocationStorehouses',
                    param,
                    function (json, res) {
                        var _allocationStorehouseDetailInfo = JSON.parse(json);
                        var _purchaseApply = _allocationStorehouseDetailInfo.data;
                        vc.copyObject(_purchaseApply[0], vc.component.allocationStorehouseDetailInfo);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadAuditUser: function () {
                var param = {
                    params: {
                        businessKey: vc.component.allocationStorehouseDetailInfo.asId,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };

                //发送get请求
                vc.http.apiGet('workflow.listWorkflowAuditInfo',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        $that.allocationStorehouseDetailInfo.auditUsers = _json.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _callBackListPurchaseApply: function () {
                vc.getBack();
            }
        }
    });
})(window.vc);
