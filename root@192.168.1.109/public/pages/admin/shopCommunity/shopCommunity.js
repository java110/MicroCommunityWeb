/**
 审核订单
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            shopCommunityInfo: {
                shopCommunitys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                userName: '',
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    state: '24002',
                    shopName:'',
                    communityName:''
                },
                orderInfo: {},
                procure: false
            }
        },
        _initMethod: function () {
            vc.component._listAuditShopCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('auditShopCommunity', 'listAuditShopCommunitys', function (_param) {
                vc.component._listAuditShopCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAuditShopCommunitys(_currentPage, DEFAULT_ROWS);
            });

            vc.on('auditShopCommunity', 'notifyAudit', function (_auditInfo) {
                vc.component._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditShopCommunitys: function (_page, _rows) {

                vc.component.shopCommunityInfo.conditions.page = _page;
                vc.component.shopCommunityInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.shopCommunityInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/shop/queryShopCommunity',
                    param,
                    function (json, res) {
                        var _shopCommunityInfo = JSON.parse(json);
                        vc.component.shopCommunityInfo.total = _shopCommunityInfo.total;
                        vc.component.shopCommunityInfo.records = _shopCommunityInfo.records;
                        vc.component.shopCommunityInfo.shopCommunitys = _shopCommunityInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.shopCommunityInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openShopCommunityWithdrawModel: function(_shopCommunity){
                vc.emit('shopCommunityWithdraw','shopCommunityWithdrawModel', _shopCommunity);
            },
            _queryAuditShopCommunitysMethod: function () {
                vc.component._listAuditShopCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);
