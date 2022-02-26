/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractApplyAuditOrdersInfo: {
                contractApplyAuditOrders: [],
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
            vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._loadStepStaff();
        },
        _initEvent: function() {

            vc.on('contractApplyAuditOrders', 'listAuditOrders', function(_param) {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listAuditOrders(_currentPage, DEFAULT_ROWS);
            });

            vc.on('contractApplyAuditOrders', 'notifyAudit', function(_auditInfo) {
                vc.component._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditOrders: function(_page, _rows) {

                vc.component.contractApplyAuditOrdersInfo.conditions.page = _page;
                vc.component.contractApplyAuditOrdersInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.contractApplyAuditOrdersInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContractChangeHistoryTask',
                    param,
                    function(json, res) {
                        var _contractApplyAuditOrdersInfo = JSON.parse(json);
                        vc.component.contractApplyAuditOrdersInfo.total = _contractApplyAuditOrdersInfo.total;
                        vc.component.contractApplyAuditOrdersInfo.records = _contractApplyAuditOrdersInfo.records;
                        vc.component.contractApplyAuditOrdersInfo.contractApplyAuditOrders = _contractApplyAuditOrdersInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.contractApplyAuditOrdersInfo.records,
                            dataCount: vc.component.contractApplyAuditOrdersInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _queryAuditOrdersMethod: function() {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetailPurchaseApplyModel: function(_purchaseApply) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=" + _purchaseApply.resOrderType);
            },

            _viewChangeDetail: function(_plan) {
                vc.jumpToPage("/#/pages/admin/contractChangeDetails?planId=" + _plan.planId);
            }

        }
    });
})(window.vc);