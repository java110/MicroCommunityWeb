(function (vc, vm) {

    vc.extends({
        data: {
            deleteAccessControlWhiteAuthInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteAccessControlWhiteAuth', 'openDeleteAccessControlWhiteAuthModal', function (_params) {

                vc.component.deleteAccessControlWhiteAuthInfo = _params;
                $('#deleteAccessControlWhiteAuthModel').modal('show');

            });
        },
        methods: {
            deleteAccessControlWhiteAuth: function () {
                vc.component.deleteAccessControlWhiteAuthInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/machine.deleteAccessControlWhiteAuth',
                    JSON.stringify(vc.component.deleteAccessControlWhiteAuthInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteAccessControlWhiteAuthModel').modal('hide');
                            vc.emit('accessControlWhiteAuthManage', 'listAccessControlWhiteAuth', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteAccessControlWhiteAuthModel: function () {
                $('#deleteAccessControlWhiteAuthModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
