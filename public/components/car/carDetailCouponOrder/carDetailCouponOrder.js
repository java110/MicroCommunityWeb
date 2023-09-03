/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carDetailCouponOrderInfo: {
                orders: [],
                carId: '',
                memberId:'',
                carNum:'',
                paId:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('carDetailCouponOrder', 'switch', function (_data) {
                $that.carDetailCouponOrderInfo.carId = _data.carId;
                $that.carDetailCouponOrderInfo.carNum = _data.carNum;
                $that.carDetailCouponOrderInfo.paId = _data.paId;
                $that.carDetailCouponOrderInfo.memberId = _data.memberId;
                $that._loadCarDetailCouponOrderData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('carDetailCouponOrder', 'notify',
                function (_data) {
                    $that._loadCarDetailCouponOrderData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('carDetailCouponOrder', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadCarDetailCouponOrderData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadCarDetailCouponOrderData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        carNum: $that.carDetailCouponOrderInfo.carNum,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/parkingCouponCar.listParkingCouponCarOrder',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.carDetailCouponOrderInfo.orders = _roomInfo.data;
                        vc.emit('carDetailCouponOrder', 'paginationPlus', 'init', {
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
            _qureyCarDetailCouponOrder: function () {
                $that._loadCarDetailCouponOrderData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);