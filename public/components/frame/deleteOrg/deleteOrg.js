(function (vc, vm) {
    vc.extends({
        data: {
            deleteOrgInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteOrg', 'openDeleteOrgModal', function (_params) {
                vc.component.deleteOrgInfo = _params;
                $('#deleteOrgModel').modal('show');
            });
        },
        methods: {
            deleteOrg: function () {
                vc.http.apiPost(
                    '/org.deleteOrg',
                    JSON.stringify(vc.component.deleteOrgInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteOrgModel').modal('hide');
                            vc.emit('orgTree', 'refreshTree', {});
                            vc.toast("删除成功");
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
            closeDeleteOrgModel: function () {
                $('#deleteOrgModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);