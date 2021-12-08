(function(vc, vm) {

    vc.extends({
        data: {
            deleteAccountBondInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteAccountBond', 'openDeleteAccountBondModal', function(_params) {

                vc.component.deleteAccountBondInfo = _params;
                $('#deleteAccountBondModel').modal('show');

            });
        },
        methods: {
            deleteAccountBond: function() {
                vc.http.apiPost(
                    '/accountBond/deleteAccountBond',
                    JSON.stringify(vc.component.deleteAccountBondInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteAccountBondModel').modal('hide');
                            vc.emit('accountBondManage', 'listAccountBond', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteAccountBondModel: function() {
                $('#deleteAccountBondModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);