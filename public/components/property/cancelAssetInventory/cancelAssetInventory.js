(function (vc, vm) {
    vc.extends({
        data: {
            cancelAssetInventoryInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('cancelAssetInventory', 'openCancelAssetInventoryModal', function (_params) {
                vc.component.cancelAssetInventoryInfo = _params;
                $('#cancelAssetInventoryModel').modal('show');
            });
        },
        methods: {
            cancelAssetInventory: function () {
                vc.http.apiPost(
                    'assetInventory.updateAssetInventory',
                    JSON.stringify({ 
                        aiId: vc.component.cancelAssetInventoryInfo.aiId,
                        shId: vc.component.cancelAssetInventoryInfo.shId,
                        state: '1000',
                        communityId:vc.getCurrentCommunity().communityId
                    }),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#cancelAssetInventoryModel').modal('hide');
                            vc.emit('assetInventoryManage', 'listAssetInventory', {});
                            vc.toast("取消成功");
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeCancelAssetInventoryModel: function () {
                $('#cancelAssetInventoryModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
