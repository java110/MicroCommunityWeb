/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            allocationStorehouseDetailInfo: {
                applyId: '',
                resourceStores: [],
                remark: '',
                startUserName: '',
                createTime: '',
                auditUsers: [],
                stateName: '',
                applyType: '',
                applyTypeName: '',
                action: '',
                taskId: ''
            }
        },
        _initMethod: function() {
            $that.allocationStorehouseDetailInfo.applyId = vc.getParam('applyId');
            $that.allocationStorehouseDetailInfo.applyType = vc.getParam('applyType');
            $that.allocationStorehouseDetailInfo.applyTypeName = vc.getParam('applyTypeName');
            $that.allocationStorehouseDetailInfo.action = vc.getParam('action');
            $that.allocationStorehouseDetailInfo.taskId = vc.getParam('taskId');
            $that._listAllocationStorehouseApply();
            $that._listPurchaseApply(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {},
        methods: {
            _listPurchaseApply: function(_page, _rows) {
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        applyId: $that.allocationStorehouseDetailInfo.applyId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStorehouses',
                    param,
                    function(json, res) {
                        let _allocationStorehouseDetailInfo = JSON.parse(json);
                        let _purchaseApply = _allocationStorehouseDetailInfo.data;
                        $that.allocationStorehouseDetailInfo.resourceStores = _purchaseApply;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listAllocationStorehouseApply: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        applyId: $that.allocationStorehouseDetailInfo.applyId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStorehouseApplys',
                    param,
                    function(json, res) {
                        let _allocationStorehouseDetailInfo = JSON.parse(json);
                        let _purchaseApply = _allocationStorehouseDetailInfo.data[0];
                        vc.copyObject(_purchaseApply, $that.allocationStorehouseDetailInfo);
                        if ($that.allocationStorehouseDetailInfo.applyType == 10000) {
                            $that._loadAuditUser();
                        }

                        if ($that.allocationStorehouseDetailInfo.action == 'audit') {
                            vc.emit('auditDiv', 'noifyData', {
                                createUserId: _purchaseApply.startUserId,
                                action: $that.allocationStorehouseDetailInfo.action,
                                taskId: $that.allocationStorehouseDetailInfo.taskId,
                                url: '/resourceStore.auditAllocationStoreOrder',
                                id: _purchaseApply.applyId,
                            });
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadAuditUser: function() {
                let param = {
                    params: {
                        businessKey: $that.allocationStorehouseDetailInfo.applyId,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listWorkflowAuditInfo',
                    param,
                    function(json, res) {
                        var _json = JSON.parse(json);
                        $that.allocationStorehouseDetailInfo.auditUsers = _json.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _callBackListPurchaseApply: function() {
                vc.getBack();
            }
        }
    });
})(window.vc);