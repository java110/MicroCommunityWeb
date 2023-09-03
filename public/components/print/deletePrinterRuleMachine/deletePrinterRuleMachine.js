(function(vc, vm) {

    vc.extends({
        data: {
            deletePrinterRuleMachineInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deletePrinterRuleMachine', 'openDeletePrinterRuleMachineModal', function(_params) {

                vc.component.deletePrinterRuleMachineInfo = _params;
                $('#deletePrinterRuleMachineModel').modal('show');

            });
        },
        methods: {
            deletePrinterRuleMachine: function() {
                vc.component.deletePrinterRuleMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/printer.deletePrinterRuleMachine',
                    JSON.stringify(vc.component.deletePrinterRuleMachineInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePrinterRuleMachineModel').modal('hide');
                            vc.emit('printerRuleMachineManage', 'listPrinterRuleMachine', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeletePrinterRuleMachineModel: function() {
                $('#deletePrinterRuleMachineModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);