(function(vc, vm) {

    vc.extends({
        data: {
            deleteOrgRelStaffInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteOrgRelStaff', 'openDeleteOrgModal', function(_params) {
                vc.component.deleteOrgRelStaffInfo = _params;
                $('#deleteOrgRelStaffModel').modal('show');
            });
        },
        methods: {
            deleteOrgRelStaff: function() {
                vc.http.apiPost(
                    '/org.deleteOrgRelStaff',
                    JSON.stringify(vc.component.deleteOrgRelStaffInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteOrgRelStaffModel').modal('hide');
                            vc.emit('orgManage', 'notice', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            closeDeleteOrgModel: function() {
                $('#deleteOrgRelStaffModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);