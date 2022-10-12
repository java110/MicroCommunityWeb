/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingCouponCarOrderInfo: {
                orders: [],
                total: 0,
                records: 1,
                moreCondition: false,
                couponId: '',
                conditions: {
                    couponId: '',
                    shopNameLike: '',
                    carNumLike: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._listParkingCouponCarOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('parkingCouponCarOrder', 'listParkingCouponCarOrder', function(_param) {
                vc.component._listParkingCouponCarOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listParkingCouponCarOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listParkingCouponCarOrders: function(_page, _rows) {

                vc.component.parkingCouponCarOrderInfo.conditions.page = _page;
                vc.component.parkingCouponCarOrderInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.parkingCouponCarOrderInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/parkingCouponCar.listParkingCouponCarOrder',
                    param,
                    function(json, res) {
                        let _parkingCouponCarOrderInfo = JSON.parse(json);
                        vc.component.parkingCouponCarOrderInfo.total = _parkingCouponCarOrderInfo.total;
                        vc.component.parkingCouponCarOrderInfo.records = _parkingCouponCarOrderInfo.records;
                        vc.component.parkingCouponCarOrderInfo.orders = _parkingCouponCarOrderInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.parkingCouponCarOrderInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryParkingCouponCarOrderMethod: function() {
                vc.component._listParkingCouponCarOrders(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.parkingCouponCarOrderInfo.moreCondition) {
                    vc.component.parkingCouponCarOrderInfo.moreCondition = false;
                } else {
                    vc.component.parkingCouponCarOrderInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);