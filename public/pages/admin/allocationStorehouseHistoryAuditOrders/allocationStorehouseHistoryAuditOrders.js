/**
 审核订单
 **/
(function(vc) {
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
        _initMethod: function() {
            $that._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('allocationStorehouseHistoryAuditOrders', 'listAuditOrders', function(_param) {
                $that._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listAuditOrders(_currentPage, DEFAULT_ROWS);
            });

            vc.on('myAuditOrders', 'notifyAudit', function(_auditInfo) {
                $that._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditOrders: function(_page, _rows) {

                $that.allocationStorehouseHistoryAuditOrdersInfo.conditions.page = _page;
                $that.allocationStorehouseHistoryAuditOrdersInfo.conditions.row = _rows;
                var param = {
                    params: $that.allocationStorehouseHistoryAuditOrdersInfo.conditions
                };
                param.params.communityId = vc.getCurrentCommunity().communityId;

                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStoreHisAuditOrders',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.allocationStorehouseHistoryAuditOrdersInfo.total = _json.total;
                        $that.allocationStorehouseHistoryAuditOrdersInfo.records = _json.records;
                        $that.allocationStorehouseHistoryAuditOrdersInfo.auditOrders = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.allocationStorehouseHistoryAuditOrdersInfo.records,
                            dataCount: $that.allocationStorehouseHistoryAuditOrdersInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditOrderModel: function(_auditOrder) {
                $that.allocationStorehouseHistoryAuditOrdersInfo.orderInfo = _auditOrder;
                vc.emit('audit', 'openAuditModal', {});
            },
            _queryAuditOrdersMethod: function() {
                $that._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toDetail: function(_item) {
                vc.jumpToPage("/#/pages/common/allocationStorehouseDetail?applyId=" + _item.applyId);
            }
        }
    });
})(window.vc);