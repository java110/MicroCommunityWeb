(function(vc, vm) {

    vc.extends({
        data: {
            deleteMachinePrinterInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteMachinePrinter', 'openDeleteMachinePrinterModal', function(_params) {

                vc.component.deleteMachinePrinterInfo = _params;
                $('#deleteMachinePrinterModel').modal('show');

            });
        },
        methods: {
            deleteMachinePrinter: function() {
                vc.component.deleteMachinePrinterInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/printer.deleteMachinePrinter',
                    JSON.stringify(vc.component.deleteMachinePrinterInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMachinePrinterModel').modal('hide');
                            vc.emit('machinePrinterManage', 'listMachinePrinter', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteMachinePrinterModel: function() {
                $('#deleteMachinePrinterModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);