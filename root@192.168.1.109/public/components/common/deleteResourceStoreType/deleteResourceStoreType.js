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
                            if (vc.component.deleteResourceStoreTypeInfo.parentId != null && vc.component.deleteResourceStoreTypeInfo.parentId != ''
                                && vc.component.deleteResourceStoreTypeInfo.parentId != 'undefined' && vc.component.deleteResourceStoreTypeInfo.parentId != '0') {
                                vc.emit('listSonResourceStoreType', 'listSonResourceStoreTypes', {});
                            } else {
                                vc.emit('resourceStoreTypeManage', 'listResourceStoreType', {});
                            }
                            vc.toast("删除成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        errInfo = JSON.parse(errInfo)
                        vc.toast(errInfo.msg);
                    });
            },
            closeDeleteResourceStoreTypeModel: function () {
                $('#deleteResourceStoreTypeModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
