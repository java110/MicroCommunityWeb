(function (vc, vm) {
    vc.extends({
        data: {
            deleteResourceStoreSpecificationInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteResourceStoreSpecification', 'openDeleteResourceStoreSpecificationModal', function (_params) {
                vc.component.deleteResourceStoreSpecificationInfo = _params;
                $('#deleteResourceStoreSpecificationModel').modal('show');
            });
        },
        methods: {
            deleteResourceStoreSpecification: function () {
                vc.component.deleteResourceStoreSpecificationInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'resourceStore.deleteResourceStoreSpecification',
                    JSON.stringify(vc.component.deleteResourceStoreSpecificationInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteResourceStoreSpecificationModel').modal('hide');
                            vc.emit('resourceStoreSpecificationManage', 'listResourceStoreSpecification', {});
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
            closeDeleteResourceStoreSpecificationModel: function () {
                $('#deleteResourceStoreSpecificationModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
