(function (vc, vm) {
    vc.extends({
        data: {
            deleteAccessControlWhiteInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteAccessControlWhite', 'openDeleteAccessControlWhiteModal', function (_params) {
                vc.component.deleteAccessControlWhiteInfo = _params;
                $('#deleteAccessControlWhiteModel').modal('show');
            });
        },
        methods: {
            deleteAccessControlWhite: function () {
                vc.component.deleteAccessControlWhiteInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/machine.deleteAccessControlWhite',
                    JSON.stringify(vc.component.deleteAccessControlWhiteInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteAccessControlWhiteModel').modal('hide');
                            vc.emit('accessControlWhiteManage', 'listAccessControlWhite', {});
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
            closeDeleteAccessControlWhiteModel: function () {
                $('#deleteAccessControlWhiteModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
