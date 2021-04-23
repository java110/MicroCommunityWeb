(function (vc) {

    vc.extends({
        data: {
            storeOrderCartDetailInfo: {
                orderId:'',
                cartId: '',
                prodName: '',
                specValue: '',
                stateName: '',
                price: '',
                cartNum: '',
                payPrice: '',
                createTime: '',
                address: {
                    username: '',
                    tel: '',
                    address: ''
                },
                remark: '',
                events:[]


            }
        },
        _initMethod: function () {
            let cartId = vc.getParam('cartId');

            if (!vc.notNull(cartId)) {
                vc.toast('非法操作');
                vc.getBack();
                return;
            }
            $that.storeOrderCartDetailInfo.cartId = cartId;
            $that.storeOrderCartDetailInfo.orderId = vc.getParam('orderId');
            
            $that._listOrderCart();
            $that._listOrderAddress();
            $that._listOrderCartEvent();

        },
        _initEvent: function () {

        },
        methods: {
            _listOrderCart: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        cartId: $that.storeOrderCartDetailInfo.cartId
                    }
                };
                //发送get请求
                vc.http.apiGet('/storeOrder/queryStoreOrderCart',
                    param,
                    function (json, res) {
                        var _storeOrderCart = JSON.parse(json);
                        vc.copyObject(_storeOrderCart.data[0], $that.storeOrderCartDetailInfo);
                        let _orderCart = _storeOrderCart.data[0];
                        let _productSpecDetails = _orderCart.productSpecDetails;
                        let _specValue = '';
                        _productSpecDetails.forEach(detail => {
                            _specValue += (detail.detailValue + "/");
                        });
                        $that.storeOrderCartDetailInfo.specValue = _specValue;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOrderAddress: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        orderId: $that.storeOrderCartDetailInfo.orderId
                    }
                };
                //发送get请求
                vc.http.apiGet('/storeOrder/queryStoreOrderAddress',
                    param,
                    function (json, res) {
                        var _storeOrderAddress = JSON.parse(json);
                        vc.copyObject(_storeOrderAddress.data[0], $that.storeOrderCartDetailInfo.address);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOrderCartEvent:function(){
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        orderId: $that.storeOrderCartDetailInfo.orderId,
                        cartId: $that.storeOrderCartDetailInfo.cartId
                    }
                };
                //发送get请求
                vc.http.apiGet('/storeOrder/queryStoreOrderCartEvent',
                    param,
                    function (json, res) {
                        var _storeOrderEvent = JSON.parse(json);
                        $that.storeOrderCartDetailInfo.events = _storeOrderEvent.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack()
            }
        }
    });

})(window.vc);
