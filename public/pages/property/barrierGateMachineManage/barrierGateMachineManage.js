/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            barrierGateMachineManageInfo: {
                machines: [],
                total: 0,
                records: 1,
                moreCondition: false,
                machineName: '',
                machineTypes: [],
                conditions: {
                    machineCode: '',
                    machineTypeCds: '9995,9996',
                    machineName: '',
                    machineIp: '',
                    machineId: '',
                    machineMac: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    domain: 'BARRIER_GATE',
                },
                listColumns: []
            }
        },
        _initMethod: function () {
            //vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('machine', "machine_type_cd", function (_data) {
                vc.component.barrierGateMachineManageInfo.machineTypes = _data;
            });
            $that._getColumns(function () {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        _initEvent: function () {
            vc.on('barrierGateMachineManage', 'listMachine', function (_param) {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMachines(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachines: function (_page, _rows) {
                vc.component.barrierGateMachineManageInfo.conditions.page = _page;
                vc.component.barrierGateMachineManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.barrierGateMachineManageInfo.conditions
                };
                param.params.machineCode = param.params.machineCode.trim();
                param.params.machineId = param.params.machineId.trim();
                param.params.machineName = param.params.machineName.trim();
                //发送get请求
                vc.http.apiGet('/machine.listMachines',
                    param,
                    function (json, res) {
                        let _barrierGateMachineManageInfo = JSON.parse(json);
                        vc.component.barrierGateMachineManageInfo.total = _barrierGateMachineManageInfo.total;
                        vc.component.barrierGateMachineManageInfo.records = _barrierGateMachineManageInfo.records;
                        vc.component.barrierGateMachineManageInfo.machines = _barrierGateMachineManageInfo.machines;
                        $that.dealMachineAttr(vc.component.barrierGateMachineManageInfo.machines);
                        vc.emit('pagination', 'init', {
                            total: vc.component.barrierGateMachineManageInfo.records,
                            dataCount: vc.component.barrierGateMachineManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMachineModal: function () {
                vc.emit('addBarrierGateMachine', 'openAddMachineModal', {});
            },
            _openEditMachineModel: function (_machine) {
                vc.emit('editBarrierGateMachine', 'openEditMachineModal', _machine);
            },
            _openDeleteMachineModel: function (_machine) {
                vc.emit('deleteMachine', 'openDeleteMachineModal', _machine);
            },
            _openQrCode: function (_machine) {
                vc.emit('barrierGateMachineQrCode', 'openQrCodeModal', _machine);
            },
            //查询
            _queryMachineMethod: function () {
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMachineMethod: function () {
                vc.component.barrierGateMachineManageInfo.conditions.machineCode = "";
                vc.component.barrierGateMachineManageInfo.conditions.machineId = "";
                vc.component.barrierGateMachineManageInfo.conditions.machineName = "";
                vc.component._listMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.barrierGateMachineManageInfo.moreCondition) {
                    vc.component.barrierGateMachineManageInfo.moreCondition = false;
                } else {
                    vc.component.barrierGateMachineManageInfo.moreCondition = true;
                }
            },
            _openMachineDetailModel: function (_machine) {
            },
            dealMachineAttr: function (machines) {
                machines.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function (_machine) {
                _machine.listValues = [];
                if (!_machine.hasOwnProperty('machineAttrs') || _machine.machineAttrs.length < 1) {
                    $that.barrierGateMachineManageInfo.listColumns.forEach(_value => {
                        _machine.listValues.push('');
                    })
                    return;
                }
                let _machineAttrs = _machine.machineAttrs;
                $that.barrierGateMachineManageInfo.listColumns.forEach(_value => {
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
                $that.barrierGateMachineManageInfo.listColumns = [];
                vc.getAttrSpec('machine_attr', function (data) {
                    $that.barrierGateMachineManageInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.barrierGateMachineManageInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                }, 'BARRIER_GATE');
            }
        }
    });
})(window.vc);