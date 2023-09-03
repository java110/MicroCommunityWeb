(function (vc, vm) {
    vc.extends({
        data: {
            deleteMenuUserInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMenuUser', 'openDeleteMenuUserModal', function (_params) {
                vc.component.deleteMenuUserInfo = _params;
                $('#deleteMenuUserModel').modal('show');
            });
        },
        methods: {
            deleteMenuUser: function () {
                vc.http.apiPost(
                    '/menuUser.deleteMenuUser',
                    JSON.stringify(vc.component.deleteMenuUserInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMenuUserModel').modal('hide');
                            vc.toast("删除成功");
                            vc.emit('menuUserManage', 'listMenuUser', {});
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeDeleteMenuUserModel: function () {
                $('#deleteMenuUserModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);