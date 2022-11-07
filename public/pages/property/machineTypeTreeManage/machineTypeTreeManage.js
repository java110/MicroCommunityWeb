/**
 入驻园区
 **/
 (function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    vc.extends({
        data: {

            equipmentAccountManageInfo: {
                currentPage: '1',
                equipmentAccounts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                machineId: '',
                conditions: {
                    machineName: '',
                    machineCode: '',
                    releaseUserName: '',
                    state: '',
                    importanceLevel: '',
                    chargeOrgId: '',
                    firstEnableTime: '',
                    typeId:''
                },
                useStatus:[],
                
            },
            machineTypeInfo:{},
            importanceLevels:[]
        },
        _initMethod: function () {
            vc.getDict('machine_type', "importance_level", function (_data) {
                vc.component.importanceLevels = _data;
            });
        },
        _initEvent: function () {
            vc.on('equipmentAccount', 'switchType', function (_param) {
                vc.component.equipmentAccountManageInfo.conditions.typeId = _param.typeId;
                vc.component.equipmentAccountManageInfo.conditions.flag = 1;
                vc.component._listEquipmentAccounts(DEFAULT_PAGE, DEFAULT_ROW);

            });
 
        },
        methods: {
            _listEquipmentAccounts: function (_page, _row) {
                if (!$that.equipmentAccountManageInfo.conditions.typeId) {
                    vc.toast('请先选择设备分类');
                    return;
                }
                let _machineTypes = $that.machineTypesTreeInfo.machineTypes;
                let _machineType ;
                _machineTypes.forEach(item => {
                    if (item.typeId == $that.equipmentAccountManageInfo.conditions.typeId) {
                        _machineType = item;
                    }
                });

                vc.component.machineTypeInfo = _machineType;
              console.log("我在这里",_machineType);
            },
            _openAddMachineTypeModal: function () {
                if (!$that.equipmentAccountManageInfo.conditions.typeId) {
                    vc.toast('请先选择设备分类');
                    return;
                }
                vc.emit('addMachineType', 'openAddMachineTypeModal', {typeId:$that.equipmentAccountManageInfo.conditions.typeId});
            },
            _openAddParentMachineTypeModal:function(){
                vc.emit('addMachineType', 'openAddMachineTypeModal', {});
            },
            _openEditMachineTypeModel: function () {
                if (!$that.equipmentAccountManageInfo.conditions.typeId) {
                    vc.toast('请先选择设备分类');
                    return;
                }
                let _machineTypes = $that.machineTypesTreeInfo.machineTypes;
                let _machineType ;
                _machineTypes.forEach(item => {
                    if (item.typeId == $that.equipmentAccountManageInfo.conditions.typeId) {
                        _machineType = item;
                    }
                });
                vc.emit('editMachineType', 'openEditMachineTypeModal', _machineType);
            },
            _openDeleteMachineTypeModel: function () {
                if (!$that.equipmentAccountManageInfo.conditions.typeId) {
                    vc.toast('请先选择设备分类');
                    return;
                }
                let _machineTypes = $that.machineTypesTreeInfo.machineTypes;
                let _machineType ;
                _machineTypes.forEach(item => {
                    if (item.typeId == $that.equipmentAccountManageInfo.conditions.typeId) {
                        _machineType = item;
                    }
                });
                vc.emit('deleteMachineType', 'openDeleteMachineTypeModal', _machineType);
            },
        }
    });
})(window.vc);