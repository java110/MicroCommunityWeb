(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            buyParkingCouponInfo: {
                couponId: '',
                quantity: '',
                shopId: '',
                receivableAmount: '',
                receivedAmount: '',
                remark: '',
                valuePrice: 0.0,
                payType: '',
                parkingCoupons: [],
                payTypes: []
            }
        },
        _initMethod: function() {
            $that._listParkingCoupons();
            vc.getDict('parking_coupon_order', "pay_type", function(_data) {
                vc.component.buyParkingCouponInfo.payTypes = _data;
            });
        },
        _initEvent: function() {
            vc.on('buyParkingCoupon', 'openBuyParkingCouponModal', function(_param) {
                $that.buyParkingCouponInfo.shopId = _param.shopId;
                $('#buyParkingCouponModel').modal('show');
            });
        },
        methods: {
            _changeParkingCoupon: function() {
                $that.buyParkingCouponInfo.parkingCoupons.forEach(item => {
                    if (item.couponId == $that.buyParkingCouponInfo.couponId) {
                        $that.buyParkingCouponInfo.valuePrice = item.valuePrice;
                    }
                });
            },
            _computeMoney: function() {
                if (!$that.buyParkingCouponInfo.valuePrice) {
                    return;
                }
                let _valuePrice = parseFloat($that.buyParkingCouponInfo.valuePrice);
                let _quantity = parseFloat($that.buyParkingCouponInfo.quantity);
                $that.buyParkingCouponInfo.receivableAmount = (_valuePrice * _quantity).toFixed(2);
            },
            _buyParkingCouponInfo: function() {
                vc.component.buyParkingCouponInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/parkingCoupon.buyParkingCoupon',
                    JSON.stringify(vc.component.buyParkingCouponInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#buyParkingCouponModel').modal('hide');
                            vc.component.clearBuyParkingCouponInfo();
                            vc.emit('communityShop', 'listCommunityShop', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearBuyParkingCouponInfo: function() {
                let _parkingCoupons = $that.buyParkingCouponInfo.parkingCoupons;
                let _payTypes = vc.component.buyParkingCouponInfo.payTypes;
                vc.component.buyParkingCouponInfo = {
                    couponId: '',
                    quantity: '',
                    shopId: '',
                    receivableAmount: '',
                    receivedAmount: '',
                    remark: '',
                    valuePrice: 0.0,
                    payType: '',
                    parkingCoupons: _parkingCoupons,
                    payTypes: _payTypes
                };
            },
            _listParkingCoupons: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/parkingCoupon.listParkingCoupon',
                    param,
                    function(json, res) {
                        var _parkingCouponManageInfo = JSON.parse(json);
                        vc.component.buyParkingCouponInfo.parkingCoupons = _parkingCouponManageInfo.data;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);