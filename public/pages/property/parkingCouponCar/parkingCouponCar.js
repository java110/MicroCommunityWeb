/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingCouponCarInfo: {
                parkingCouponCars: [],
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
        _initMethod: function () {
            vc.component._listParkingCouponCars(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('parkingCouponCar', 'listParkingCouponCar', function (_param) {
                vc.component._listParkingCouponCars(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listParkingCouponCars(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listParkingCouponCars: function (_page, _rows) {
                vc.component.parkingCouponCarInfo.conditions.page = _page;
                vc.component.parkingCouponCarInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.parkingCouponCarInfo.conditions
                };
                param.params.carNumLike = param.params.carNumLike.trim();
                param.params.shopNameLike = param.params.shopNameLike.trim();
                //发送get请求
                vc.http.apiGet('/parkingCoupon.listParkingCouponCar',
                    param,
                    function (json, res) {
                        let _parkingCouponCarInfo = JSON.parse(json);
                        vc.component.parkingCouponCarInfo.total = _parkingCouponCarInfo.total;
                        vc.component.parkingCouponCarInfo.records = _parkingCouponCarInfo.records;
                        vc.component.parkingCouponCarInfo.parkingCouponCars = _parkingCouponCarInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.parkingCouponCarInfo.records,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryParkingCouponCarMethod: function () {
                vc.component._listParkingCouponCars(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetParkingCouponCarMethod: function () {
                vc.component.parkingCouponCarInfo.conditions.carNumLike = "";
                vc.component.parkingCouponCarInfo.conditions.shopNameLike = "";
                vc.component.parkingCouponCarInfo.conditions.state = "";
                vc.component._listParkingCouponCars(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.parkingCouponCarInfo.moreCondition) {
                    vc.component.parkingCouponCarInfo.moreCondition = false;
                } else {
                    vc.component.parkingCouponCarInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);