(function (vc, vm) {
    vc.extends({
        data: {
            deleteResourceStoreInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteResourceStore', 'openDeleteResourceStoreModal', function (_params) {
                vc.component.deleteResourceStoreInfo = _params;
                $('#deleteResourceStoreModel').modal('show');
            });
        },
        methods: {
            deleteResourceStore: function () {
                vc.component.deleteResourceStoreInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/resourceStore.deleteResourceStore',
                    JSON.stringify(vc.component.deleteResourceStoreInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteResourceStoreModel').modal('hide');
                            vc.emit('resourceStoreManage', 'listResourceStore', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteResourceStoreModel: function () {
                $('#deleteResourceStoreModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);