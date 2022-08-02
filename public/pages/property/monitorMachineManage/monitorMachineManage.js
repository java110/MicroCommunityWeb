/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            monitorMachineManageInfo: {
                machines: [],
                total: 0,
                records: 1,
                moreCondition: false,
                machineName: '',
                machineTypes: [],
                conditions: {
                    machineCode: '',
                    machineTypeCd: '9998',
                    machineName: '',
                    machineIp: '',
                    machineMac: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    domain: 'MONITOR',
                },
                listColumns: []
            }
        },
        _initMethod: function() {
            //vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('machine', "machine_type_cd", function(_data) {
                vc.component.monitorMachineManageInfo.machineTypes = _data;
            });
            $that._getColumns(function() {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        _initEvent: function() {

            vc.on('monitorMachineManage', 'listMachine', function(_param) {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listMachines(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachines: function(_page, _rows) {

                vc.component.monitorMachineManageInfo.conditions.page = _page;
                vc.component.monitorMachineManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.monitorMachineManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/machine.listMachines',
                    param,
                    function(json, res) {
                        let _monitorMachineManageInfo = JSON.parse(json);
                        vc.component.monitorMachineManageInfo.total = _monitorMachineManageInfo.total;
                        vc.component.monitorMachineManageInfo.records = _monitorMachineManageInfo.records;
                        vc.component.monitorMachineManageInfo.machines = _monitorMachineManageInfo.machines;
                        $that.dealMachineAttr(vc.component.monitorMachineManageInfo.machines);
                        vc.emit('pagination', 'init', {
                            total: vc.component.monitorMachineManageInfo.records,
                            dataCount: vc.component.monitorMachineManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _openAddMachineModal: function() {
                vc.emit('addMonitorMachine', 'openAddMachineModal', {});
            },
            _openEditMachineModel: function(_machine) {
                vc.emit('editMonitorMachine', 'openEditMachineModal', _machine);
            },
            _openDeleteMachineModel: function(_machine) {
                vc.emit('deleteMachine', 'openDeleteMachineModal', _machine);
            },
            _queryMachineMethod: function() {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.monitorMachineManageInfo.moreCondition) {
                    vc.component.monitorMachineManageInfo.moreCondition = false;
                } else {
                    vc.component.monitorMachineManageInfo.moreCondition = true;
                }
            },
            _openMachineDetailModel: function(_machine) {

            },
            dealMachineAttr: function(machines) {
                machines.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function(_machine) {
                _machine.listValues = [];
                if (!_machine.hasOwnProperty('machineAttrs') || _machine.machineAttrs.length < 1) {
                    $that.monitorMachineManageInfo.listColumns.forEach(_value => {
                        _machine.listValues.push('');
                    })
                    return;
                }
                let _machineAttrs = _machine.machineAttrs;
                $that.monitorMachineManageInfo.listColumns.forEach(_value => {
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
                $that.monitorMachineManageInfo.listColumns = [];
                vc.getAttrSpec('machine_attr', function(data) {
                    $that.monitorMachineManageInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.monitorMachineManageInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                }, 'MONITOR');
            },
            _openViewVideoModel: function(_machine) {
                vc.emit('viewCameraVideo', 'openCameraVideoModal', _machine);
            }
        }
    });
})(window.vc);