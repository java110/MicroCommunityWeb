(function (vc, vm) {

    vc.extends({
        data: {
            deleteAccountBondObjInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteAccountBondObj', 'openDeleteAccountBondObjModal', function (_params) {

                vc.component.deleteAccountBondObjInfo = _params;
                $('#deleteAccountBondObjModel').modal('show');

            });
        },
        methods: {
            deleteAccountBondObj: function () {
                vc.component.deleteAccountBondObjInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/accountBondObj/deleteAccountBondObj',
                    JSON.stringify(vc.component.deleteAccountBondObjInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteAccountBondObjModel').modal('hide');
                            vc.emit('accountBondObjManage', 'listAccountBondObj', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteAccountBondObjModel: function () {
                $('#deleteAccountBondObjModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
