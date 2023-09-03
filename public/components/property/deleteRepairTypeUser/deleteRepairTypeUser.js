(function (vc, vm) {
    vc.extends({
        data: {
            deleteRepairTypeUserInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteRepairTypeUser', 'openDeleteRepairTypeUserModal', function (_params) {
                vc.component.deleteRepairTypeUserInfo = _params;
                $('#deleteRepairTypeUserModel').modal('show');
            });
        },
        methods: {
            deleteRepairTypeUser: function () {
                vc.component.deleteRepairTypeUserInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'repair.deleteRepairTypeUser',
                    JSON.stringify(vc.component.deleteRepairTypeUserInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteRepairTypeUserModel').modal('hide');
                            vc.emit('repairTypeUserManage', 'listRepairTypeUser', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteRepairTypeUserModel: function () {
                $('#deleteRepairTypeUserModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
