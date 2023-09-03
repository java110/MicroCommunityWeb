(function(vc, vm) {

    vc.extends({
        data: {
            deletePrinterRuleInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deletePrinterRule', 'openDeletePrinterRuleModal', function(_params) {

                vc.component.deletePrinterRuleInfo = _params;
                $('#deletePrinterRuleModel').modal('show');

            });
        },
        methods: {
            deletePrinterRule: function() {
                vc.component.deletePrinterRuleInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/printer.deletePrinterRule',
                    JSON.stringify(vc.component.deletePrinterRuleInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePrinterRuleModel').modal('hide');
                            vc.emit('printerRuleManage', 'listPrinterRule', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            closeDeletePrinterRuleModel: function() {
                $('#deletePrinterRuleModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);