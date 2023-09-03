/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            auditOrdersInfo: {
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
        },
        _initEvent: function() {
            vc.on('myAuditOrders', 'list', function(_param) {
                $that.auditOrdersInfo.audit = '1';
            });
            vc.on('myAuditOrders', 'listAuditOrders', function(_param) {
                $that.auditOrdersInfo.audit = '1';
                $that._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listAuditOrders(_currentPage, DEFAULT_ROWS);
            });
            vc.on('myAuditOrders', 'notifyAudit', function(_auditInfo) {
                $that.auditOrdersInfo.audit = '1';
                $that._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditOrders: function(_page, _rows) {
                $that.auditOrdersInfo.audit = '1';
                $that.auditOrdersInfo.conditions.page = _page;
                $that.auditOrdersInfo.conditions.row = _rows;
                var param = {
                    params: $that.auditOrdersInfo.conditions
                };
                param.params.communityId = vc.getCurrentCommunity().communityId;
                //发送get请求
                vc.http.apiGet('/collection/getCollectionAuditOrder',
                    param,
                    function(json, res) {
                        var _auditOrdersInfo = JSON.parse(json);
                        $that.auditOrdersInfo.total = _auditOrdersInfo.total;
                        $that.auditOrdersInfo.records = _auditOrdersInfo.records;
                        $that.auditOrdersInfo.auditOrders = _auditOrdersInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.auditOrdersInfo.records,
                            dataCount: $that.auditOrdersInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditOrderModel: function(_auditOrder) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _auditOrder.applyOrderId + "&resOrderType=" + _auditOrder.resOrderType + "&action=audit&taskId=" + _auditOrder.taskId);
            },
            _queryAuditOrdersMethod: function() {
                $that._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetailPurchaseApplyModel: function(_purchaseApply) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=" + _purchaseApply.resOrderType);
            },
            _openEditPurchaseModel: function(_purchaseApply) {
                vc.jumpToPage("/#/pages/resource/editPurchaseApply?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=" + _purchaseApply.resOrderType);
            },

            _distributionOrder: function(_purchaseApply) {
                vc.jumpToPage("/#/pages/common/resourceOutManage?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=" + _purchaseApply.resOrderType + "&taskId=" + _purchaseApply.taskId);
            }
        }
    });
})(window.vc);