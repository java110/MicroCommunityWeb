/**
 入驻园区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            machineTypeManageInfo: {
                machineTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                typeId: '',
                machine: [],
                importanceLevels: [],
                conditions: {
                    typeId: '',
                    importanceLevel: '',
                    machineTypeCd: '',
                    machineTypeName: '',
                    isEnable: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listMachineTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('machine', "machine_type_cd", function (_data) {
                vc.component.machineTypeManageInfo.machine = _data;
            });
            vc.getDict('machine_type', "importance_level", function (_data) {
                vc.component.machineTypeManageInfo.importanceLevels = _data;
            });
        },
        _initEvent: function () {
            vc.on('machineTypeManage', 'listMachineType', function (_param) {
                vc.component._listMachineTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMachineTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachineTypes: function (_page, _rows) {
                vc.component.machineTypeManageInfo.conditions.page = _page;
                vc.component.machineTypeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.machineTypeManageInfo.conditions
                };
                param.params.typeId = param.params.typeId.trim();
                param.params.machineTypeName = param.params.machineTypeName.trim();
                //发送get请求
                vc.http.apiGet('machineType.listMachineType',
                    param,
                    function (json, res) {
                        var _machineTypeManageInfo = JSON.parse(json);
                        vc.component.machineTypeManageInfo.total = _machineTypeManageInfo.total;
                        vc.component.machineTypeManageInfo.records = _machineTypeManageInfo.records;
                        vc.component.machineTypeManageInfo.machineTypes = _machineTypeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.machineTypeManageInfo.records,
                            dataCount: vc.component.machineTypeManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMachineTypeModal: function () {
                vc.emit('addMachineType', 'openAddMachineTypeModal', {});
            },
            _openEditMachineTypeModel: function (_machineType) {
                vc.emit('editMachineType', 'openEditMachineTypeModal', _machineType);
            },
            _openDeleteMachineTypeModel: function (_machineType) {
                vc.emit('deleteMachineType', 'openDeleteMachineTypeModal', _machineType);
            },
            _queryMachineTypeMethod: function () {
                vc.component._listMachineTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMachineTypeMethod: function () {
                vc.component.machineTypeManageInfo.conditions.typeId = "";
                vc.component.machineTypeManageInfo.conditions.machineTypeCd = "";
                vc.component.machineTypeManageInfo.conditions.machineTypeName = "";
                vc.component.machineTypeManageInfo.conditions.importanceLevel = "";
                vc.component.machineTypeManageInfo.conditions.isEnable = "";
                vc.component._listMachineTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _getspecEduName: function (_edu) {
                let _retutest = '';
                vc.component.machineTypeManageInfo.machine.forEach(_item => {
                    if (_item.statusCd == _edu) {
                        _retutest = _item.name;
                    }
                });
                return _retutest;
            },
            _moreCondition: function () {
                if (vc.component.machineTypeManageInfo.moreCondition) {
                    vc.component.machineTypeManageInfo.moreCondition = false;
                } else {
                    vc.component.machineTypeManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
