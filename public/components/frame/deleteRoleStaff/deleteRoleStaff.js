(function (vc, vm) {
    vc.extends({
        data: {
            deleteRoleStaffInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteRoleStaff', 'openDeleteRoleStaffModal', function (_params) {
                vc.component.deleteRoleStaffInfo = _params;
                $('#deleteRoleStaffModel').modal('show');
            });
        },
        methods: {
            deleteRoleStaff: function () {
                vc.http.apiPost(
                    '/role.deleteRoleStaff',
                    JSON.stringify(vc.component.deleteRoleStaffInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteRoleStaffModel').modal('hide');
                            vc.emit('roleStaffInfo', 'listRoleStaff', {});
                            vc.toast("删除成功")
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeDeleteRoleStaffModel: function () {
                $('#deleteRoleStaffModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);