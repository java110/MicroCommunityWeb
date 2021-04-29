/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            allocationStorehouseDetailInfo: {
                applyId: '',
                resourceStores: [],
                remark: '',
                startUserName:'',
                createTime:'',
                auditUsers: [],
                stateName:''
            }
        },
        _initMethod: function () {
            vc.component.allocationStorehouseDetailInfo.applyId = vc.getParam('applyId');
            $that._listAllocationStorehouseApply();
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
                        applyId: vc.component.allocationStorehouseDetailInfo.applyId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listAllocationStorehouses',
                    param,
                    function (json, res) {
                        var _allocationStorehouseDetailInfo = JSON.parse(json);
                        var _purchaseApply = _allocationStorehouseDetailInfo.data;
                        vc.component.allocationStorehouseDetailInfo.resourceStores = _purchaseApply;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listAllocationStorehouseApply: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        applyId: vc.component.allocationStorehouseDetailInfo.applyId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listAllocationStorehouseApplys',
                    param,
                    function (json, res) {
                        var _allocationStorehouseDetailInfo = JSON.parse(json);
                        var _purchaseApply = _allocationStorehouseDetailInfo.data[0];
                        vc.copyObject(_purchaseApply,vc.component.allocationStorehouseDetailInfo);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadAuditUser: function () {
                var param = {
                    params: {
                        businessKey: vc.component.allocationStorehouseDetailInfo.applyId,
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
