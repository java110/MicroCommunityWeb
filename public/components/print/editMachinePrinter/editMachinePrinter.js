(function (vc, vm) {
    vc.extends({
        data: {
            editMachinePrinterInfo: {
                machineId: '',
                machineName: '',
                machineCode: '',
                implBean: '',
                implBeans: []
            }
        },
        _initMethod: function () {
            vc.getDict('machine_printer', 'impl_bean', function (_data) {
                $that.editMachinePrinterInfo.implBeans = _data;
            })
        },
        _initEvent: function () {
            vc.on('editMachinePrinter', 'openEditMachinePrinterModal', function (_params) {
                vc.component.refreshEditMachinePrinterInfo();
                $('#editMachinePrinterModel').modal('show');
                vc.copyObject(_params, vc.component.editMachinePrinterInfo);
                vc.component.editMachinePrinterInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editMachinePrinterValidate: function () {
                return vc.validate.validate({
                    editMachinePrinterInfo: vc.component.editMachinePrinterInfo
                }, {
                    'editMachinePrinterInfo.machineName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "设备名称不能超过200"
                        }
                    ],
                    'editMachinePrinterInfo.machineCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备编码不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "设备编码不能超过30"
                        }
                    ],
                    'editMachinePrinterInfo.implBean': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "门禁厂家不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "门禁厂家不能超过30"
                        }
                    ],
                    'editMachinePrinterInfo.machineId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备编号不能为空"
                        }
                    ]
                });
            },
            editMachinePrinter: function () {
                if (!vc.component.editMachinePrinterValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/printer.updateMachinePrinter',
                    JSON.stringify(vc.component.editMachinePrinterInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMachinePrinterModel').modal('hide');
                            vc.emit('machinePrinterManage', 'listMachinePrinter', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            refreshEditMachinePrinterInfo: function () {
                let _implBeans = $that.editMachinePrinterInfo.implBeans;
                vc.component.editMachinePrinterInfo = {
                    machineId: '',
                    machineName: '',
                    machineCode: '',
                    implBean: '',
                    implBeans: _implBeans
                }
            }
        }
    });
})(window.vc, window.vc.component);