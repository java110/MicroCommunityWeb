(function (vc, vm) {
    vc.extends({
        data: {
            deleteStorehouseInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteStorehouse', 'openDeleteStorehouseModal', function (_params) {
                vc.component.deleteStorehouseInfo = _params;
                $('#deleteStorehouseModel').modal('show');
            });
        },
        methods: {
            deleteStorehouse: function () {
                vc.component.deleteStorehouseInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'resourceStore.deleteStorehouse',
                    JSON.stringify(vc.component.deleteStorehouseInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteStorehouseModel').modal('hide');
                            vc.emit('storehouseManage', 'listStorehouse', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteStorehouseModel: function () {
                $('#deleteStorehouseModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
