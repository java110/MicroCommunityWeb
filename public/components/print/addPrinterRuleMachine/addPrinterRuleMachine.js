(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPrinterRuleMachineInfo: {
                machineId: '',
                quantity: '1',
                ruleId: '',
                machines: []
            }
        },
        _initMethod: function() {
            //100301 赠送一次  100302 每月赠送一次
        },
        _initEvent: function() {
            vc.on('addPrinterRuleMachine', 'openAddPrinterRuleMachineModal', function(_rule) {
                vc.copyObject(_rule, $that.addPrinterRuleMachineInfo);
                $that._listAddCouponPropertyPools();
                $('#addPrinterRuleMachineModel').modal('show');
            });
        },
        methods: {
            addPrinterRuleMachineValidate() {
                return vc.validate.validate({
                    addPrinterRuleMachineInfo: vc.component.addPrinterRuleMachineInfo
                }, {
                    'addPrinterRuleMachineInfo.machineId': [{
                        limit: "required",
                        param: "",
                        errInfo: "打印机不能为空"
                    }, ],
                    'addPrinterRuleMachineInfo.quantity': [{
                            limit: "required",
                            param: "",
                            errInfo: "赠送数量不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "赠送数量不能超过30"
                        },
                    ],
                });
            },
            savePrinterRuleMachineInfo: function() {
                if (!vc.component.addPrinterRuleMachineValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addPrinterRuleMachineInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/printer.savePrinterRuleMachine',
                    JSON.stringify(vc.component.addPrinterRuleMachineInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPrinterRuleMachineModel').modal('hide');
                            vc.component.clearAddPrinterRuleMachineInfo();
                            vc.emit('printerRuleMachineManage', 'listPrinterRuleMachine', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            _listAddCouponPropertyPools: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/printer.listMachinePrinter',
                    param,
                    function(json, res) {
                        var _couponPropertyPoolManageInfo = JSON.parse(json);
                        vc.component.addPrinterRuleMachineInfo.machines = _couponPropertyPoolManageInfo.data;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearAddPrinterRuleMachineInfo: function() {
                vc.component.addPrinterRuleMachineInfo = {
                    machineId: '',
                    quantity: '1',
                    ruleId: '',
                    machines: []

                };
            }
        }
    });

})(window.vc);