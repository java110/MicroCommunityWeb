(function (vc, vm) {
    vc.extends({
        data: {
            deleteResourceSupplierInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteResourceSupplier', 'openDeleteResourceSupplierModal', function (_params) {
                vc.component.deleteResourceSupplierInfo = _params;
                $('#deleteResourceSupplierModel').modal('show');
            });
        },
        methods: {
            deleteResourceSupplier: function () {
                vc.component.deleteResourceSupplierInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'resourceSupplier.deleteResourceSupplier',
                    JSON.stringify(vc.component.deleteResourceSupplierInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        console.log(_json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteResourceSupplierModel').modal('hide');
                            vc.emit('resourceSupplierManage', 'listResourceSupplier', {});
                            return;
                        }
                        vc.toast(_json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteResourceSupplierModel: function () {
                $('#deleteResourceSupplierModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
