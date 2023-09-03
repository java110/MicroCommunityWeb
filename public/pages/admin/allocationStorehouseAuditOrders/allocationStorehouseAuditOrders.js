/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationStorehouseAuditOrdersInfo: {
                auditOrders: [],
                total: 0,
                records: 1,
                moreCondition: false,
                userName: '',
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    AuditOrdersId: '',
                    userName: '',
                    auditLink: '',
                },
                orderInfo: '',
                procure: false,
                audit: '1'
            }
        },
        _initMethod: function() {
            $that._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._loadStepStaff();
        },
        _initEvent: function() {
            vc.on('allocationStorehouseAuditOrders', 'list', function(_param) {
                $that.allocationStorehouseAuditOrdersInfo.audit = '1';
            });
            vc.on('allocationStorehouseAuditOrders', 'listAuditOrders', function(_param) {
                $that.allocationStorehouseAuditOrdersInfo.audit = '1';
                $that._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listAuditOrders(_currentPage, DEFAULT_ROWS);
            });
            vc.on('allocationStorehouseAuditOrders', 'notifyAudit', function(_auditInfo) {
                $that.allocationStorehouseAuditOrdersInfo.audit = '1';
                $that._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditOrders: function(_page, _rows) {
                $that.allocationStorehouseAuditOrdersInfo.audit = '1';
                $that.allocationStorehouseAuditOrdersInfo.conditions.page = _page;
                $that.allocationStorehouseAuditOrdersInfo.conditions.row = _rows;
                let param = {
                    params: $that.allocationStorehouseAuditOrdersInfo.conditions
                };
                param.params.communityId = vc.getCurrentCommunity().communityId;
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStoreAuditOrders',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.allocationStorehouseAuditOrdersInfo.total = _json.total;
                        $that.allocationStorehouseAuditOrdersInfo.records = _json.records;
                        $that.allocationStorehouseAuditOrdersInfo.auditOrders = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.allocationStorehouseAuditOrdersInfo.records,
                            dataCount: $that.allocationStorehouseAuditOrdersInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditOrderModel: function(_auditOrder) {
                vc.jumpToPage("/#/pages/common/allocationStorehouseDetail?applyId=" + _auditOrder.applyId + "&action=audit&taskId=" + _auditOrder.taskId);
            },
            _openEditPurchaseModel: function(_auditOrder) {
                vc.jumpToPage("/#/pages/resource/editAllocationStorehouseApply?applyId=" + _auditOrder.applyId);
            },
            _queryAuditOrdersMethod: function() {
                $that._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _allocationStorehouseEnter: function(_auditOrder) {
                vc.jumpToPage('/#/pages/resource/allocationStorehouseEnter?applyId=' + _auditOrder.applyId + "&taskId=" + _auditOrder.taskId)
            },
            _loadStepStaff: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        staffId: $that.allocationStorehouseAuditOrdersInfo.currentUserId,
                        staffRole: '3003',
                        requestType: 'allocationHandle'
                    }
                };
                //发送get请求
                vc.http.apiGet('/workflow.listWorkflowStepStaffs',
                    param,
                    function(json, res) {
                        var _json = JSON.parse(json);
                        if (_json.data.length > 0) {
                            $that.allocationStorehouseAuditOrdersInfo.procure = true;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toDetail: function(_item) {
                vc.jumpToPage("/#/pages/common/allocationStorehouseDetail?applyId=" + _item.applyId);
            }
        }
    });
})(window.vc);