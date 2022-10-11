(function(vc, vm) {

    vc.extends({
        data: {
            deleteCommunityShopInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteCommunityShop', 'openDeleteCommunityShopModal', function(_params) {

                vc.component.deleteCommunityShopInfo = _params;
                $('#deleteCommunityShopModel').modal('show');

            });
        },
        methods: {
            deleteCommunityShop: function() {
                vc.component.deleteCommunityShopInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/store.propertyDeleteStoreAndShop',
                    JSON.stringify(vc.component.deleteCommunityShopInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCommunityShopModel').modal('hide');
                            vc.emit('communityShop', 'listCommunityShop', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteCommunityShopModel: function() {
                $('#deleteCommunityShopModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);