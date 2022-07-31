(function(vc, vm) {

    vc.extends({
        data: {
            deleteRoleStaffInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteRoleStaff', 'openDeleteRoleStaffModal', function(_params) {

                vc.component.deleteRoleStaffInfo = _params;
                $('#deleteRoleStaffModel').modal('show');

            });
        },
        methods: {
            deleteRoleStaff: function() {
                vc.http.apiPost(
                    '/role.deleteRoleStaff',
                    JSON.stringify(vc.component.deleteRoleStaffInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteRoleStaffModel').modal('hide');
                            vc.emit('roleStaffInfo', 'listRoleStaff', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            closeDeleteRoleStaffModel: function() {
                $('#deleteRoleStaffModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);