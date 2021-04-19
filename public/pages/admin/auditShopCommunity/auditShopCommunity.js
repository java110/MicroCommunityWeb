/**
 审核订单
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            auditShopCommunityInfo: {
                shopCommunitys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                userName: '',
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    state: '12001'
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

                vc.component.auditShopCommunityInfo.conditions.page = _page;
                vc.component.auditShopCommunityInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.auditShopCommunityInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/shop/queryShopCommunity',
                    param,
                    function (json, res) {
                        var _auditShopCommunityInfo = JSON.parse(json);
                        vc.component.auditShopCommunityInfo.total = _auditShopCommunityInfo.total;
                        vc.component.auditShopCommunityInfo.records = _auditShopCommunityInfo.records;
                        vc.component.auditShopCommunityInfo.shopCommunitys = _auditShopCommunityInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.auditShopCommunityInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditShopCommunityModel: function (_auditOrder) {
                vc.component.auditShopCommunityInfo.orderInfo = _auditOrder;
                vc.emit('audit', 'openAuditModal', {});
            },
            _queryAuditShopCommunitysMethod: function () {
                vc.component._listAuditShopCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //提交审核信息
            _auditOrderInfo: function (_auditInfo) {
                console.log("提交得参数：" + _auditInfo);
                //发送get请求
                _auditInfo.shopId = $that.auditShopCommunityInfo.orderInfo.shopId;
                _auditInfo.storeId = $that.auditShopCommunityInfo.orderInfo.storeId;
                _auditInfo.scId = $that.auditShopCommunityInfo.orderInfo.scId;
                vc.http.apiPost('/shop/auditShopCommunity',
                    JSON.stringify(_auditInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json)
                        if (_json.code != 0) {
                            vc.toast(_json.msg);
                            return;
                        }
                        vc.toast("处理成功");
                        vc.component._listAuditShopCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            }
        }
    });
})(window.vc);
