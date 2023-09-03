(function(vc, vm) {

    vc.extends({
        data: {
            deleteMerchantShopInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteMerchantShop', 'openDeleteMerchantShopModal', function(_params) {
                vc.component.deleteMerchantShopInfo = _params;
                $('#deleteMerchantShopModel').modal('show');
            });
        },
        methods: {
            deleteMerchantShop: function() {
                vc.http.apiPost(
                    '/shop/deleteShop',
                    JSON.stringify(vc.component.deleteMerchantShopInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMerchantShopModel').modal('hide');
                            vc.emit('merchantShop', 'listShop', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteMerchantShopModel: function() {
                $('#deleteMerchantShopModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);