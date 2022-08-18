(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMachineTypeInfo: {
                typeId: '',
                machineTypeCd: '',
                machineTypeName: '',
                machine: []
            }
        },
        _initMethod: function () {
            vc.getDict('machine', "machine_type_cd", function (_data) {
                vc.component.addMachineTypeInfo.machine = _data;
            });
        },
        _initEvent: function () {
            vc.on('addMachineType', 'openAddMachineTypeModal', function () {
                $('#addMachineTypeModel').modal('show');
            });
        },
        methods: {
            addMachineTypeValidate() {
                return vc.validate.validate({
                    addMachineTypeInfo: vc.component.addMachineTypeInfo
                }, {
                    
                    'addMachineTypeInfo.machineTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备大类不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "设备大类不能超过30"
                        },
                    ],
                    'addMachineTypeInfo.machineTypeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "设备类型名称不能超过30"
                        },
                    ]




                });
            },
            saveMachineTypeInfo: function () {
                if (!vc.component.addMachineTypeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addMachineTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addMachineTypeInfo);
                    $('#addMachineTypeModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'machineType.saveMachineType',
                    JSON.stringify(vc.component.addMachineTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMachineTypeModel').modal('hide');
                            vc.component.clearAddMachineTypeInfo();
                            vc.emit('machineTypeManage', 'listMachineType', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddMachineTypeInfo: function () {
                let _machine = vc.component.addMachineTypeInfo.machine;
                vc.component.addMachineTypeInfo = {
                    typeId: '',
                    machineTypeCd: '',
                    machineTypeName: '',
                    machine: _machine
                };
            }
        }
    });

})(window.vc);
