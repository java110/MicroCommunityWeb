(function (vc, vm) {

    vc.extends({
        data: {
            deleteContractInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteContract', 'openDeleteContractModal', function (_params) {

                vc.component.deleteContractInfo = _params;
                $('#deleteContractModel').modal('show');

            });
        },
        methods: {
            deleteContract: function () {
                vc.component.deleteContractInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/contract/deleteContract',
                    JSON.stringify(vc.component.deleteContractInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteContractModel').modal('hide');
                            vc.emit('contractManage', 'listContract', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteContractModel: function () {
                $('#deleteContractModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
