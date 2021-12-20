(function (vc, vm) {
    vc.extends({
        data: {
            deleteStorehouseManageInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteStorehouseManage', 'openDeleteStorehouseManageModal', function (_params) {
                vc.component.deleteStorehouseManageInfo = _params;
                $('#deleteStorehouseManageModel').modal('show');
            });
        },
        methods: {
            deleteStorehouseManage: function () {
                vc.component.deleteStorehouseManageInfo.communityId = vc.getCurrentCommunity().communityId;
                //发送get请求
                vc.http.apiPost('resourceStore.deleteAllocationStorehouse',
                    JSON.stringify(vc.component.deleteStorehouseManageInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (_json.status == 200) {
                            //关闭model
                            $('#deleteStorehouseManageModel').modal('hide');
                            vc.emit('allocationStorehouseManage', 'listAllocationStorehouse', {});
                            vc.toast(_json.msg);
                            return;
                        }else{
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteStorehouseManageModel: function () {
                $('#deleteStorehouseManageModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
