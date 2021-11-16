/**
 审核订单
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationStorehouseHistoryAuditOrdersInfo: {
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
                procure: false
            }
        },
        _initMethod: function () {
            vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('allocationStorehouseHistoryAuditOrders', 'listAuditOrders', function (_param) {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAuditOrders(_currentPage, DEFAULT_ROWS);
            });

            vc.on('myAuditOrders', 'notifyAudit', function (_auditInfo) {
                vc.component._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditOrders: function (_page, _rows) {

                vc.component.allocationStorehouseHistoryAuditOrdersInfo.conditions.page = _page;
                vc.component.allocationStorehouseHistoryAuditOrdersInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.allocationStorehouseHistoryAuditOrdersInfo.conditions
                };
                param.params.communityId = vc.getCurrentCommunity().communityId;

                //发送get请求
                vc.http.apiGet('resourceStore.listAllocationStoreHisAuditOrders',
                    param,
                    function (json, res) {
                        var _allocationStorehouseHistoryAuditOrdersInfo = JSON.parse(json);
                        vc.component.allocationStorehouseHistoryAuditOrdersInfo.total = _allocationStorehouseHistoryAuditOrdersInfo.total;
                        vc.component.allocationStorehouseHistoryAuditOrdersInfo.records = _allocationStorehouseHistoryAuditOrdersInfo.records;
                        vc.component.allocationStorehouseHistoryAuditOrdersInfo.auditOrders = _allocationStorehouseHistoryAuditOrdersInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.allocationStorehouseHistoryAuditOrdersInfo.records,
                            dataCount: vc.component.allocationStorehouseHistoryAuditOrdersInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditOrderModel: function (_auditOrder) {
                vc.component.allocationStorehouseHistoryAuditOrdersInfo.orderInfo = _auditOrder;
                vc.emit('audit', 'openAuditModal', {});
            },
            _queryAuditOrdersMethod: function () {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toDetail: function (_item) {
                vc.jumpToPage("/admin.html#/pages/common/allocationStorehouseDetail?applyId=" + _item.applyId);
            }
        }
    });
})(window.vc);
