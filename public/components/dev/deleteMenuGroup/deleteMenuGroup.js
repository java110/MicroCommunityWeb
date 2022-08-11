(function (vc, vm) {
    vc.extends({
        data: {
            deleteMenuGroupInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMenuGroup', 'openDeleteMenuGroupModal', function (_params) {
                vc.component.deleteMenuGroupInfo = _params;
                $('#deleteMenuGroupModel').modal('show');
            });
        },
        methods: {
            deleteMenuGroup: function () {
                vc.http.post(
                    'deleteMenuGroup',
                    'delete',
                    JSON.stringify(vc.component.deleteMenuGroupInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteMenuGroupModel').modal('hide');
                            vc.emit('menuGroupManage', 'listMenuGroup', {});
                            vc.toast("删除成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeDeleteMenuGroupModel: function () {
                $('#deleteMenuGroupModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
