(function (vc, vm) {
    vc.extends({
        data: {
            deleteDataPrivilegeStaffInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteDataPrivilegeStaff', 'openDeleteDataPrivilegeStaffModal', function (_params) {
                vc.component.deleteDataPrivilegeStaffInfo = _params;
                $('#deleteDataPrivilegeStaffModel').modal('show');
            });
        },
        methods: {
            deleteDataPrivilegeStaff: function () {
                vc.http.apiPost(
                    '/dataPrivilegeStaff.deleteDataPrivilegeStaff',
                    JSON.stringify(vc.component.deleteDataPrivilegeStaffInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteDataPrivilegeStaffModel').modal('hide');
                            vc.emit('dataPrivilegeStaffInfo', 'listDataPrivilegeStaff', {});
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
            closeDeleteDataPrivilegeStaffModel: function () {
                $('#deleteDataPrivilegeStaffModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);