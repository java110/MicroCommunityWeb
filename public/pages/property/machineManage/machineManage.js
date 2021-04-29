/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            machineManageInfo: {
                machines: [],
                total: 0,
                records: 1,
                moreCondition: false,
                machineName: '',
                conditions: {
                    machineCode: '',
                    machineTypeCd: '',
                    machineName: '',
                    machineIp: '',
                    machineMac: '',
                    communityId: vc.getCurrentCommunity().communityId

                },
                listColumns: []
            }
        },
        _initMethod: function () {
            //vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);

            $that._getColumns(function () {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        _initEvent: function () {

            vc.on('machineManage', 'listMachine', function (_param) {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMachines(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachines: function (_page, _rows) {

                vc.component.machineManageInfo.conditions.page = _page;
                vc.component.machineManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.machineManageInfo.conditions
                };

                //发送get请求
                vc.http.get('machineManage',
                    'list',
                    param,
                    function (json, res) {
                        let _machineManageInfo = JSON.parse(json);
                        vc.component.machineManageInfo.total = _machineManageInfo.total;
                        vc.component.machineManageInfo.records = _machineManageInfo.records;
                        vc.component.machineManageInfo.machines = _machineManageInfo.machines;
                        $that.dealMachineAttr(vc.component.machineManageInfo.machines);
                        vc.emit('pagination', 'init', {
                            total: vc.component.machineManageInfo.records,
                            dataCount: vc.component.machineManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMachineModal: function () {
                vc.emit('addMachine', 'openAddMachineModal', {});
            },
            _openEditMachineModel: function (_machine) {
                vc.emit('editMachine', 'openEditMachineModal', _machine);
            },
            _openDeleteMachineModel: function (_machine) {
                vc.emit('deleteMachine', 'openDeleteMachineModal', _machine);
            },
            _queryMachineMethod: function () {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.machineManageInfo.moreCondition) {
                    vc.component.machineManageInfo.moreCondition = false;
                } else {
                    vc.component.machineManageInfo.moreCondition = true;
                }
            },
            _openMachineDetailModel: function (_machine) {

            },
            _openRestartMachineModel: function (_machine) { //设备重启处理
                vc.emit('machineState', 'openMachineStateModal', {
                    machineCode: _machine.machineCode,
                    stateName: '重启',
                    state: '1400',
                    url: '/machine/restartMachine'
                });
            },
            _openDoorMachineModel: function (_machine) { //设备开门处理
                vc.emit('machineState', 'openMachineStateModal', {
                    machineCode: _machine.machineCode,
                    stateName: '开门',
                    state: '1500',
                    url: '/machine/openDoor'
                });
            },
            dealMachineAttr: function (machines) {
                machines.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function (_machine) {
                _machine.listValues = [];
                if (!_machine.hasOwnProperty('machineAttrs') || _machine.machineAttrs.length < 1) {
                    $that.machineManageInfo.listColumns.forEach(_value => {
                        _machine.listValues.push('');
                    })
                    return;
                }
                let _machineAttrs = _machine.machineAttrs;
                $that.machineManageInfo.listColumns.forEach(_value => {
                    let _tmpValue = '';
                    _machineAttrs.forEach(_attrItem => {
                        if (_value == _attrItem.specName) {
                            _tmpValue = _attrItem.valueName;
                        }
                    })
                    _machine.listValues.push(_tmpValue);
                })

            },
            _getColumns: function (_call) {
                console.log('_getColumns');
                $that.machineManageInfo.listColumns = [];
                vc.getAttrSpec('machine_attr', function (data) {
                    $that.machineManageInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.machineManageInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });

            }


        }
    });
})(window.vc);
