(function (vc, vm) {
    vc.extends({
        data: {
            stopContractInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('stopContract', 'openStopContractModal', function (_params) {
                vc.component.stopContractInfo = _params;
                $('#stopContractModel').modal('show');
            });
        },
        methods: {
            stopContract: function () {
                vc.http.apiPost(
                    '/contract/stopContract',
                    JSON.stringify(vc.component.stopContractInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#stopContractModel').modal('hide');
                            vc.emit('contractManage', 'listContract', {});
                            vc.toast("操作成功");
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
            closeStopContractModel: function () {
                $('#stopContractModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
