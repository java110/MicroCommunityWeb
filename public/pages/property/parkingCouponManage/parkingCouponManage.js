/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingCouponManageInfo: {
                parkingCoupons: [],
                total: 0,
                records: 1,
                moreCondition: false,
                couponId: '',
                conditions: {
                    couponId: '',
                    name: '',
                    typeCd: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listParkingCoupons(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('parkingCouponManage', 'listParkingCoupon', function (_param) {
                vc.component._listParkingCoupons(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listParkingCoupons(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listParkingCoupons: function (_page, _rows) {
                vc.component.parkingCouponManageInfo.conditions.page = _page;
                vc.component.parkingCouponManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.parkingCouponManageInfo.conditions
                };
                param.params.couponId = param.params.couponId.trim();
                param.params.name = param.params.name.trim();
                //发送get请求
                vc.http.apiGet('/parkingCoupon.listParkingCoupon',
                    param,
                    function (json, res) {
                        var _parkingCouponManageInfo = JSON.parse(json);
                        vc.component.parkingCouponManageInfo.total = _parkingCouponManageInfo.total;
                        vc.component.parkingCouponManageInfo.records = _parkingCouponManageInfo.records;
                        vc.component.parkingCouponManageInfo.parkingCoupons = _parkingCouponManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.parkingCouponManageInfo.records,
                            dataCount: vc.component.parkingCouponManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddParkingCouponModal: function () {
                vc.emit('addParkingCoupon', 'openAddParkingCouponModal', {});
            },
            _openEditParkingCouponModel: function (_parkingCoupon) {
                vc.emit('editParkingCoupon', 'openEditParkingCouponModal', _parkingCoupon);
            },
            _openDeleteParkingCouponModel: function (_parkingCoupon) {
                vc.emit('deleteParkingCoupon', 'openDeleteParkingCouponModal', _parkingCoupon);
            },
            //查询
            _queryParkingCouponMethod: function () {
                vc.component._listParkingCoupons(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetParkingCouponMethod: function () {
                vc.component.parkingCouponManageInfo.conditions.couponId = "";
                vc.component.parkingCouponManageInfo.conditions.name = "";
                vc.component.parkingCouponManageInfo.conditions.typeCd = "";
                vc.component._listParkingCoupons(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.parkingCouponManageInfo.moreCondition) {
                    vc.component.parkingCouponManageInfo.moreCondition = false;
                } else {
                    vc.component.parkingCouponManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);