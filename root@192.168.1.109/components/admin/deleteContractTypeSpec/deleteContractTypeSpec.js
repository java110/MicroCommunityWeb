(function (vc, vm) {

    vc.extends({
        data: {
            deleteContractTypeSpecInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteContractTypeSpec', 'openDeleteContractTypeSpecModal', function (_params) {
                vc.component.deleteContractTypeSpecInfo = _params;
                $('#deleteContractTypeSpecModel').modal('show');
            });
        },
        methods: {
            deleteContractTypeSpec: function () {
                vc.component.deleteContractTypeSpecInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/contract/deleteContractTypeSpec',
                    JSON.stringify(vc.component.deleteContractTypeSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteContractTypeSpecModel').modal('hide');
                            vc.emit('contractTypeSpecManage', 'listContractTypeSpec', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteContractTypeSpecModel: function () {
                $('#deleteContractTypeSpecModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
