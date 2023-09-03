(function(vc, vm) {

    vc.extends({
        data: {
            deleteBasePrivilegeInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteBasePrivilege', 'openDeleteBasePrivilegeModal', function(_params) {

                vc.component.deleteBasePrivilegeInfo = _params;
                $('#deleteBasePrivilegeModel').modal('show');

            });
        },
        methods: {
            deleteBasePrivilege: function() {
                vc.http.apiPost(
                    '/basePrivilege.deleteBasePrivilege',
                    JSON.stringify(vc.component.deleteBasePrivilegeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteBasePrivilegeModel').modal('hide');
                            vc.emit('basePrivilegeManage', 'listBasePrivilege', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            closeDeleteBasePrivilegeModel: function() {
                $('#deleteBasePrivilegeModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);