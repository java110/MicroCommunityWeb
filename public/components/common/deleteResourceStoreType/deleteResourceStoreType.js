(function (vc, vm) {
    vc.extends({
        data: {
            deleteResourceStoreTypeInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteResourceStoreType', 'openDeleteResourceStoreTypeModal', function (_params) {
                vc.component.deleteResourceStoreTypeInfo = _params;
                $('#deleteResourceStoreTypeModel').modal('show');
            });
        },
        methods: {
            deleteResourceStoreType: function () {
                vc.component.deleteResourceStoreTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.post('deleteResourceStoreType',
                    'delete',
                    JSON.stringify(vc.component.deleteResourceStoreTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteResourceStoreTypeModel').modal('hide');
                            vc.emit('resourceStoreTypeManage', 'listResourceStoreType', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteResourceStoreTypeModel: function () {
                $('#deleteResourceStoreTypeModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
