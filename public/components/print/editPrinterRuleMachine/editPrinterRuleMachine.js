(function(vc, vm) {

    vc.extends({
        data: {
            editPrinterRuleMachineInfo: {
                prmId: '',
                machineId: '',
                quantity: '',
                ruleId: '',
                machines: []

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editPrinterRuleMachine', 'openEditPrinterRuleMachineModal', function(_params) {
                vc.component.refreshEditPrinterRuleMachineInfo();
                $('#editPrinterRuleMachineModel').modal('show');
                $that._listEditCouponPropertyPools();
                vc.copyObject(_params, vc.component.editPrinterRuleMachineInfo);
                vc.component.editPrinterRuleMachineInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editPrinterRuleMachineValidate: function() {
                return vc.validate.validate({
                    editPrinterRuleMachineInfo: vc.component.editPrinterRuleMachineInfo
                }, {
                    'editPrinterRuleMachineInfo.machineId': [{
                        limit: "required",
                        param: "",
                        errInfo: "打印机不能为空"
                    }, ],
                    'editPrinterRuleMachineInfo.quantity': [{
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
                    'editPrinterRuleMachineInfo.prmId': [{
                        limit: "required",
                        param: "",
                        errInfo: "编号不能为空"
                    }]

                });
            },
            editPrinterRuleMachine: function() {
                if (!vc.component.editPrinterRuleMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/printer.updatePrinterRuleMachine',
                    JSON.stringify(vc.component.editPrinterRuleMachineInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPrinterRuleMachineModel').modal('hide');
                            vc.emit('printerRuleMachineManage', 'listPrinterRuleMachine', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditPrinterRuleMachineInfo: function() {
                vc.component.editPrinterRuleMachineInfo = {
                    prmId: '',
                    machineId: '',
                    quantity: '',
                    ruleId: '',
                    machines: []

                }
            },
            _listEditCouponPropertyPools: function(_page, _rows) {
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
                        let _couponPropertyPoolManageInfo = JSON.parse(json);
                        vc.component.editPrinterRuleMachineInfo.machines = _couponPropertyPoolManageInfo.data;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc, window.vc.component);