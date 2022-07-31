(function (vc, vm) {

    vc.extends({
        data: {
            deleteContractChangeInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteContractChange', 'openDeleteContractPlanModal', function (_params) {

                vc.component.deleteContractChangeInfo = _params;
                $('#deleteContractChangeModel').modal('show');

            });
        },
        methods: {
            deleteContractChange: function () {
                vc.http.apiPost(
                    '/contract/deleteContractChangePlan',
                    JSON.stringify(vc.component.deleteContractChangeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteContractChangeModel').modal('hide');
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
                $('#deleteContractChangeModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
