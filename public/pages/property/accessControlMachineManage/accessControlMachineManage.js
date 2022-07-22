/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accessControlMachineManageInfo: {
                machines: [],
                total: 0,
                records: 1,
                moreCondition: false,
                machineName: '',
                machineTypes: [],
                conditions: {
                    machineCode: '',
                    machineTypeCd: '9999',
                    machineName: '',
                    machineIp: '',
                    machineMac: '',
                    communityId: vc.getCurrentCommunity().communityId

                },
                listColumns: []
            }
        },
        _initMethod: function() {
            //vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('machine', "machine_type_cd", function(_data) {
                vc.component.accessControlMachineManageInfo.machineTypes = _data;
            });
            $that._getColumns(function() {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        _initEvent: function() {

            vc.on('accessControlMachineManage', 'listMachine', function(_param) {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listMachines(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachines: function(_page, _rows) {

                vc.component.accessControlMachineManageInfo.conditions.page = _page;
                vc.component.accessControlMachineManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.accessControlMachineManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/machine.listMachines',
                    param,
                    function(json, res) {
                        let _accessControlMachineManageInfo = JSON.parse(json);
                        vc.component.accessControlMachineManageInfo.total = _accessControlMachineManageInfo.total;
                        vc.component.accessControlMachineManageInfo.records = _accessControlMachineManageInfo.records;
                        vc.component.accessControlMachineManageInfo.machines = _accessControlMachineManageInfo.machines;
                        $that.dealMachineAttr(vc.component.accessControlMachineManageInfo.machines);
                        vc.emit('pagination', 'init', {
                            total: vc.component.accessControlMachineManageInfo.records,
                            dataCount: vc.component.accessControlMachineManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _openAddMachineModal: function() {
                vc.emit('addAccessControlMachine', 'openAddMachineModal', {});
            },
            _openEditMachineModel: function(_machine) {
                vc.emit('editAccessControlMachine', 'openEditMachineModal', _machine);
            },
            _openDeleteMachineModel: function(_machine) {
                vc.emit('deleteMachine', 'openDeleteMachineModal', _machine);
            },
            _queryMachineMethod: function() {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.accessControlMachineManageInfo.moreCondition) {
                    vc.component.accessControlMachineManageInfo.moreCondition = false;
                } else {
                    vc.component.accessControlMachineManageInfo.moreCondition = true;
                }
            },
            _openMachineDetailModel: function(_machine) {

            },
            _openRestartMachineModel: function(_machine) { //设备重启处理
                vc.emit('machineState', 'openMachineStateModal', {
                    machineCode: _machine.machineCode,
                    stateName: '重启',
                    state: '1400',
                    url: '/machine/restartMachine'
                });
            },
            _openDoorMachineModel: function(_machine) { //设备开门处理
                vc.emit('machineState', 'openMachineStateModal', {
                    machineCode: _machine.machineCode,
                    stateName: '开门',
                    state: '1500',
                    url: '/machine/openDoor'
                });
            },
            dealMachineAttr: function(machines) {
                machines.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function(_machine) {
                _machine.listValues = [];
                if (!_machine.hasOwnProperty('machineAttrs') || _machine.machineAttrs.length < 1) {
                    $that.accessControlMachineManageInfo.listColumns.forEach(_value => {
                        _machine.listValues.push('');
                    })
                    return;
                }
                let _machineAttrs = _machine.machineAttrs;
                $that.accessControlMachineManageInfo.listColumns.forEach(_value => {
                    let _tmpValue = '';
                    _machineAttrs.forEach(_attrItem => {
                        if (_value == _attrItem.specName) {
                            _tmpValue = _attrItem.valueName;
                        }
                    })
                    _machine.listValues.push(_tmpValue);
                })

            },
            _getColumns: function(_call) {
                console.log('_getColumns');
                $that.accessControlMachineManageInfo.listColumns = [];
                vc.getAttrSpec('machine_attr', function(data) {
                    $that.accessControlMachineManageInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.accessControlMachineManageInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                }, 'ACCESS_CONTROL');
            }
        }
    });
})(window.vc);