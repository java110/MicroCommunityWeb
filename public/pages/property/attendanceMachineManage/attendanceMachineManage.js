/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            attendanceMachineManageInfo: {
                machines: [],
                total: 0,
                records: 1,
                moreCondition: false,
                machineName: '',
                machineTypes: [],
                conditions: {
                    machineCode: '',
                    machineTypeCd: '9997',
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
            $that._getColumns(function() {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        _initEvent: function() {

            vc.on('attendanceMachineManage', 'listMachine', function(_param) {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listMachines(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachines: function(_page, _rows) {

                vc.component.attendanceMachineManageInfo.conditions.page = _page;
                vc.component.attendanceMachineManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.attendanceMachineManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/machine.listMachines',
                    param,
                    function(json, res) {
                        let _attendanceMachineManageInfo = JSON.parse(json);
                        vc.component.attendanceMachineManageInfo.total = _attendanceMachineManageInfo.total;
                        vc.component.attendanceMachineManageInfo.records = _attendanceMachineManageInfo.records;
                        vc.component.attendanceMachineManageInfo.machines = _attendanceMachineManageInfo.machines;
                        $that.dealMachineAttr(vc.component.attendanceMachineManageInfo.machines);
                        vc.emit('pagination', 'init', {
                            total: vc.component.attendanceMachineManageInfo.records,
                            dataCount: vc.component.attendanceMachineManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _openAddMachineModal: function() {
                vc.emit('addAttendanceMachine', 'openAddMachineModal', {});
            },
            _openEditMachineModel: function(_machine) {
                vc.emit('editAttendanceMachine', 'openEditMachineModal', _machine);
            },
            _openDeleteMachineModel: function(_machine) {
                vc.emit('deleteMachine', 'openDeleteMachineModal', _machine);
            },
            _queryMachineMethod: function() {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.attendanceMachineManageInfo.moreCondition) {
                    vc.component.attendanceMachineManageInfo.moreCondition = false;
                } else {
                    vc.component.attendanceMachineManageInfo.moreCondition = true;
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
            dealMachineAttr: function(machines) {
                machines.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function(_machine) {
                _machine.listValues = [];
                if (!_machine.hasOwnProperty('machineAttrs') || _machine.machineAttrs.length < 1) {
                    $that.attendanceMachineManageInfo.listColumns.forEach(_value => {
                        _machine.listValues.push('');
                    })
                    return;
                }
                let _machineAttrs = _machine.machineAttrs;
                $that.attendanceMachineManageInfo.listColumns.forEach(_value => {
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
                $that.attendanceMachineManageInfo.listColumns = [];
                vc.getAttrSpec('machine_attr', function(data) {
                    $that.attendanceMachineManageInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.attendanceMachineManageInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });
            }
        }
    });
})(window.vc);