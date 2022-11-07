(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMachineTypeInfo: {
                parentTypeId: '',
                typeId: '',
                machineTypeCd: '',
                machineTypeName: '',
                machineTypeCode:'',
                isEnable:'',
                importanceLevel:'',
                unit:'',
                warrantyDeadline:'',
                seq:'',
                remark:'',
                importanceLevels:[],
                machine: []
            }
        },
        _initMethod: function () {
            vc.getDict('machine', "machine_type_cd", function (_data) {
                vc.component.addMachineTypeInfo.machine = _data;
            });
            vc.getDict('machine_type', "importance_level", function (_data) {
                vc.component.addMachineTypeInfo.importanceLevels = _data;
            });

            $('.addWarrantyDeadline').datetimepicker({
                minView: "month",
                language: 'zh-CN',
                fontAwesome: 'fa',
                format: 'yyyy-mm-dd',
                initTime: true,
                initialDate: new Date(),
                autoClose: 1,
                todayBtn: true
            });
            $('.addWarrantyDeadline').datetimepicker()
                .on('changeDate', function (ev) {
                    var value = $(".addWarrantyDeadline").val();
                    vc.component.addMachineTypeInfo.warrantyDeadline = value;
                });
        },
        _initEvent: function () {
            vc.on('addMachineType', 'openAddMachineTypeModal', function (_params) {
                $('#addMachineTypeModel').modal('show');
                vc.component.addMachineTypeInfo.parentTypeId = _params.typeId;
            });
        },
        methods: {
            addMachineTypeValidate() {
                return vc.validate.validate({
                    addMachineTypeInfo: vc.component.addMachineTypeInfo
                }, {
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
                    ],
                    'addMachineTypeInfo.machineTypeCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "分类编码不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "分类编码不能超过30"
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
                            vc.emit('machineTypesTree', 'refreshTree', {});
                            vc.emit('equipmentAccountManage', 'listEquipmentAccount', {});
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
                let _importanceLevels = $that.addMachineTypeInfo.importanceLevels;
                vc.component.addMachineTypeInfo = {
                    parentTypeId: '',
                    typeId: '',
                    machineTypeCd: '',
                    machineTypeName: '',
                    machineTypeCode:'',
                    importanceLevel:'',
                    importanceLevels:_importanceLevels,
                    isEnable:'',
                    unit:'',
                    warrantyDeadline:'',
                    seq:'',
                    remark:'',
                    machine: []
                };
            }
        }
    });

})(window.vc);
