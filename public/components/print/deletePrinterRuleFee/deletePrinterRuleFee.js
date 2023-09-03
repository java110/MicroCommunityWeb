(function(vc, vm) {

    vc.extends({
        data: {
            deletePrinterRuleFeeInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deletePrinterRuleFee', 'openDeletePrinterRuleFeeModal', function(_params) {

                vc.component.deletePrinterRuleFeeInfo = _params;
                $('#deletePrinterRuleFeeModel').modal('show');

            });
        },
        methods: {
            deletePrinterRuleFee: function() {
                vc.component.deletePrinterRuleFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/printer.deletePrinterRuleFee',
                    JSON.stringify(vc.component.deletePrinterRuleFeeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePrinterRuleFeeModel').modal('hide');
                            vc.emit('printerRuleFeeManage', 'listPrinterRuleFee', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeletePrinterRuleFeeModel: function() {
                $('#deletePrinterRuleFeeModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);