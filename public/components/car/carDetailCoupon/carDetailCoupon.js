/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carDetailCouponInfo: {
                carIns: [],
                carId: '',
                memberId:'',
                carNum:'',
                paId:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('carDetailCoupon', 'switch', function (_data) {
                $that.carDetailCouponInfo.carId = _data.carId;
                $that.carDetailCouponInfo.carNum = _data.carNum;
                $that.carDetailCouponInfo.paId = _data.paId;
                $that.carDetailCouponInfo.memberId = _data.memberId;
                $that._loadCarDetailCouponData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('carDetailCoupon', 'notify',
                function (_data) {
                    $that._loadCarDetailCouponData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('carDetailCoupon', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadCarDetailCouponData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadCarDetailCouponData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        carNum: $that.carDetailCouponInfo.carNum,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/parkingCoupon.listParkingCouponCar',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.carDetailCouponInfo.parkingCouponCars = _roomInfo.data;
                        vc.emit('carDetailCoupon', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyCarDetailCoupon: function () {
                $that._loadCarDetailCouponData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);