(function(vc, vm) {

    vc.extends({
        data: {
            deleteDataPrivilegeInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteDataPrivilege', 'openDeleteDataPrivilegeModal', function(_params) {

                vc.component.deleteDataPrivilegeInfo = _params;
                $('#deleteDataPrivilegeModel').modal('show');

            });
        },
        methods: {
            deleteDataPrivilege: function() {
                vc.component.deleteDataPrivilegeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/dataPrivilege.deleteDataPrivilege',
                    JSON.stringify(vc.component.deleteDataPrivilegeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteDataPrivilegeModel').modal('hide');
                            vc.emit('dataPrivilegeDiv', '_loadDataPrivilege', {});

                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            closeDeleteDataPrivilegeModel: function() {
                $('#deleteDataPrivilegeModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);