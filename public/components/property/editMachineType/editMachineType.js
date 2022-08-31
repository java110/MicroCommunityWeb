(function (vc, vm) {
    vc.extends({
        data: {
            editMachineTypeInfo: {
                typeId: '',
                machineTypeCd: '',
                machineTypeName: '',
                machine: []
            }
        },
        _initMethod: function () {
            vc.getDict('machine', "machine_type_cd", function (_data) {
                vc.component.editMachineTypeInfo.machine = _data;
            });
        },
        _initEvent: function () {
            vc.on('editMachineType', 'openEditMachineTypeModal', function (_params) {
                vc.component.refreshEditMachineTypeInfo();
                $('#editMachineTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editMachineTypeInfo);
                vc.component.editMachineTypeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editMachineTypeValidate: function () {
                return vc.validate.validate({
                    editMachineTypeInfo: vc.component.editMachineTypeInfo
                }, {
                    'editMachineTypeInfo.typeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备类型ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "设备类型ID不能超过30"
                        },
                    ],
                    'editMachineTypeInfo.machineTypeCd': [
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
                    'editMachineTypeInfo.machineTypeName': [
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
            editMachineType: function () {
                if (!vc.component.editMachineTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'machineType.updateMachineType',
                    JSON.stringify(vc.component.editMachineTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMachineTypeModel').modal('hide');
                            vc.emit('machineTypeManage', 'listMachineType', {});
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
            refreshEditMachineTypeInfo: function () {
                let _machine = vc.component.editMachineTypeInfo.machine;
                vc.component.editMachineTypeInfo = {
                    typeId: '',
                    machineTypeCd: '',
                    machineTypeName: '',
                    machine: _machine
                }
            }
        }
    });
})(window.vc, window.vc.component);
