(function(vc, vm) {

    vc.extends({
        data: {
            deletePrinterRuleRepairInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deletePrinterRuleRepair', 'openDeletePrinterRuleRepairModal', function(_params) {

                vc.component.deletePrinterRuleRepairInfo = _params;
                $('#deletePrinterRuleRepairModel').modal('show');

            });
        },
        methods: {
            deletePrinterRuleRepair: function() {
                vc.component.deletePrinterRuleRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/printer.deletePrinterRuleRepair',
                    JSON.stringify(vc.component.deletePrinterRuleRepairInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePrinterRuleRepairModel').modal('hide');
                            vc.emit('printerRuleRepairManage', 'listPrinterRuleRepair', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeletePrinterRuleRepairModel: function() {
                $('#deletePrinterRuleRepairModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);