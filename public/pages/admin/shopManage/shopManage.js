//订单查询
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            shopManageInfo: {
                shops: [],
                storeTypes: [],
                total: 0,
                records: 1,
                orderDetail: false,
                conditions: {
                    shopName: '',
                    storeType: '',
                    state: '',
                    appId: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listShops(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('s_shop', "stop_type", function (_data) {
                vc.component.shopManageInfo.storeTypes = _data;
            });
        },
        _initEvent: function () {

            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listShops(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listShops: function (_page, _rows) {
                vc.component.shopManageInfo.conditions.page = _page;
                vc.component.shopManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.shopManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/shop/queryShopsByAdmin',
                    param,
                    function (json, res) {
                        var _shopManageInfo = JSON.parse(json);
                        vc.component.shopManageInfo.total = _shopManageInfo.total;
                        vc.component.shopManageInfo.records = _shopManageInfo.records;
                        vc.component.shopManageInfo.shops = _shopManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.shopManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryOrdersMethod: function () {
                vc.component._listShops(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openOrderDetailModel: function (_order) {
                vc.component.shopManageInfo.orderDetail = true;
                vc.emit('orderDetailManage', 'listOrderDetails', _order.cBusiness);
            }
        }
    });
})(window.vc);
