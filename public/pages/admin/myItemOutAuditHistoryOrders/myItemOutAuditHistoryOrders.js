/**
 审核订单
 **/
(function (vc) {
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
                orderInfo:'',
            }
        },
        _initMethod: function () {
            vc.component._listAuditOrderHistorys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

        
        },
        methods: {
            _listAuditOrderHistorys: function (_page, _rows) {

                vc.component.auditOrderHistorysInfo.conditions.page = _page;
                vc.component.auditOrderHistorysInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.auditOrderHistorysInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('auditUser.listItemOutAuditHistoryOrders',
                    param,
                    function (json, res) {
                        var _auditOrderHistorysInfo = JSON.parse(json);
                        vc.component.auditOrderHistorysInfo.total = _auditOrderHistorysInfo.total;
                        vc.component.auditOrderHistorysInfo.records = _auditOrderHistorysInfo.records;
                        vc.component.auditOrderHistorysInfo.auditOrderHistorys = _auditOrderHistorysInfo.resourceOrders;
                        vc.emit('pagination', 'init', {
                            total: vc.component.auditOrderHistorysInfo.records,
                            dataCount: vc.component.auditOrderHistorysInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openDetailPurchaseApplyModel:function(_purchaseApply){
                vc.jumpToPage("/admin.html#/pages/common/purchaseApplyDetail?applyOrderId="+_purchaseApply.applyOrderId+"&resOrderType="+_purchaseApply.resOrderType);
            }
        }
    });
})(window.vc);
