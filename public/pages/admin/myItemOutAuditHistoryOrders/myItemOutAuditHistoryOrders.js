/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            auditOrderHistorysInfo: {
                auditOrderHistorys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                userName: '',
                conditions: {
                    AuditOrderHistorysId: '',
                    userName: '',
                    auditLink: '',
                },
                orderInfo: '',
            }
        },
        _initMethod: function() {
            $that._listAuditOrderHistorys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listAuditOrderHistorys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAuditOrderHistorys: function(_page, _rows) {

                $that.auditOrderHistorysInfo.conditions.page = _page;
                $that.auditOrderHistorysInfo.conditions.row = _rows;
                var param = {
                    params: $that.auditOrderHistorysInfo.conditions
                };
                param.params.communityId = vc.getCurrentCommunity().communityId;

                //发送get请求
                vc.http.apiGet('/auditUser.listItemOutAuditHistoryOrders',
                    param,
                    function(json, res) {
                        var _auditOrderHistorysInfo = JSON.parse(json);
                        $that.auditOrderHistorysInfo.total = _auditOrderHistorysInfo.total;
                        $that.auditOrderHistorysInfo.records = _auditOrderHistorysInfo.records;
                        $that.auditOrderHistorysInfo.auditOrderHistorys = _auditOrderHistorysInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.auditOrderHistorysInfo.records,
                            dataCount: $that.auditOrderHistorysInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryHistory: function() {
                $that._listAuditOrderHistorys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetailPurchaseApplyModel: function(_purchaseApply) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=" + _purchaseApply.resOrderType);
            }
        }
    });
})(window.vc);