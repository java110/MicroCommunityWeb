(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMachinePrinterInfo: {
                machineId: '',
                machineName: '',
                machineCode: '',
                implBean: '',
                implBeans:[]
            }
        },
        _initMethod: function() {
            vc.getDict('machine_printer','impl_bean',function(_data){
                $that.addMachinePrinterInfo.implBeans=_data;
            })

        },
        _initEvent: function() {
            vc.on('addMachinePrinter', 'openAddMachinePrinterModal', function() {
                $('#addMachinePrinterModel').modal('show');
            });
        },
        methods: {
            addMachinePrinterValidate() {
                return vc.validate.validate({
                    addMachinePrinterInfo: vc.component.addMachinePrinterInfo
                }, {
                    'addMachinePrinterInfo.machineName': [{
                            limit: "required",
                            param: "",
                            errInfo: "设备名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "设备名称不能超过200"
                        },
                    ],
                    'addMachinePrinterInfo.machineCode': [{
                            limit: "required",
                            param: "",
                            errInfo: "设备编码不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "设备编码不能超过30"
                        },
                    ],
                    'addMachinePrinterInfo.implBean': [{
                            limit: "required",
                            param: "",
                            errInfo: "门禁厂家不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "门禁厂家不能超过30"
                        },
                    ],




                });
            },
            saveMachinePrinterInfo: function() {
                if (!vc.component.addMachinePrinterValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addMachinePrinterInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/printer.saveMachinePrinter',
                    JSON.stringify(vc.component.addMachinePrinterInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMachinePrinterModel').modal('hide');
                            vc.component.clearAddMachinePrinterInfo();
                            vc.emit('machinePrinterManage', 'listMachinePrinter', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddMachinePrinterInfo: function() {
                let _implBeans = $that.addMachinePrinterInfo.implBeans;
                vc.component.addMachinePrinterInfo = {
                    machineName: '',
                    machineCode: '',
                    implBean: '',
                    implBeans:_implBeans
                };
            }
        }
    });

})(window.vc);