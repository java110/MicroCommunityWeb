(function (vc, vm) {
    vc.extends({
        data: {
            deleteAssetInventoryInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteAssetInventory', 'openDeleteAssetInventoryModal', function (_params) {
                vc.component.deleteAssetInventoryInfo = _params;
                $('#deleteAssetInventoryModel').modal('show');
            });
        },
        methods: {
            deleteAssetInventory: function () {
                vc.component.deleteAssetInventoryInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'assetInventory.deleteAssetInventory',
                    JSON.stringify(vc.component.deleteAssetInventoryInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteAssetInventoryModel').modal('hide');
                            vc.emit('assetInventoryManage', 'listAssetInventory', {});
                            vc.toast("删除成功");
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteAssetInventoryModel: function () {
                $('#deleteAssetInventoryModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
