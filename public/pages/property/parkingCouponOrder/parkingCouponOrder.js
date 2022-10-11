/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingCouponOrderInfo: {
                parkingCoupons: [],
                total: 0,
                records: 1,
                moreCondition: false,
                couponId: '',
                conditions: {
                    couponId: '',
                    shopName: '',
                    typeCd: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._listParkingCouponOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('parkingCouponOrder', 'listParkingCouponOrder', function(_param) {
                vc.component._listParkingCouponOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listParkingCouponOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listParkingCouponOrders: function(_page, _rows) {

                vc.component.parkingCouponOrderInfo.conditions.page = _page;
                vc.component.parkingCouponOrderInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.parkingCouponOrderInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/parkingCoupon.listParkingCouponOrder',
                    param,
                    function(json, res) {
                        var _parkingCouponOrderInfo = JSON.parse(json);
                        vc.component.parkingCouponOrderInfo.total = _parkingCouponOrderInfo.total;
                        vc.component.parkingCouponOrderInfo.records = _parkingCouponOrderInfo.records;
                        vc.component.parkingCouponOrderInfo.parkingCoupons = _parkingCouponOrderInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.parkingCouponOrderInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryParkingCouponOrderMethod: function() {
                vc.component._listParkingCouponOrders(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.parkingCouponOrderInfo.moreCondition) {
                    vc.component.parkingCouponOrderInfo.moreCondition = false;
                } else {
                    vc.component.parkingCouponOrderInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);