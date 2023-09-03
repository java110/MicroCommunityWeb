(function (vc, vm) {

    vc.extends({
        data: {
            deleteOwnerRepairInfo: {}
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteOwnerRepair', 'openDeleteOwnerRepairModal', function (_params) {

                vc.component.deleteOwnerRepairInfo = _params;
                $('#deleteOwnerRepairModel').modal('show');

            });
        },
        methods: {
            deleteOwnerRepair: function () {
                vc.component.deleteOwnerRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/ownerRepair.deleteOwnerRepair',
                    JSON.stringify(vc.component.deleteOwnerRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteOwnerRepairModel').modal('hide');
                            vc.emit('ownerRepairManage', 'listOwnerRepair', {});
                            vc.emit('repairPoolManage', 'listRepairPool', {})
                            vc.toast("删除成功")
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            closeDeleteOwnerRepairModel: function () {
                $('#deleteOwnerRepairModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
