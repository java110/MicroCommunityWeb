/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            meterMachineManageInfo: {
                meterMachines: [],
                total: 0,
                records: 1,
                moreCondition: false,
                machineId: '',
                meterTypes: [],
                factorys: [],
                conditions: {
                    machineNameLike: '',
                    address: '',
                    meterType: '',
                    machineModel: '',
                    roomNameLike: '',
                    implBean: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listMeterMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listMeterType();
            $that._listFactorys();
        },
        _initEvent: function () {
            vc.on('meterMachineManage', 'listMeterMachine', function (_param) {
                vc.component._listMeterMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMeterMachines(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMeterMachines: function (_page, _rows) {
                vc.component.meterMachineManageInfo.conditions.page = _page;
                vc.component.meterMachineManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.meterMachineManageInfo.conditions
                };
                param.params.machineNameLike = param.params.machineNameLike.trim();
                param.params.address = param.params.address.trim();
                param.params.roomNameLike = param.params.roomNameLike.trim();
                //发送get请求
                vc.http.apiGet('/meterMachine.listMeterMachine',
                    param,
                    function (json, res) {
                        var _meterMachineManageInfo = JSON.parse(json);
                        vc.component.meterMachineManageInfo.total = _meterMachineManageInfo.total;
                        vc.component.meterMachineManageInfo.records = _meterMachineManageInfo.records;
                        vc.component.meterMachineManageInfo.meterMachines = _meterMachineManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.meterMachineManageInfo.records,
                            dataCount: vc.component.meterMachineManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMeterMachineModal: function () {
                vc.jumpToPage('/#/pages/machine/addMeterMachine')
            },
            _openEditMeterMachineModel: function (_meterMachine) {
                vc.jumpToPage('/#/pages/machine/editMeterMachine?machineId=' + _meterMachine.machineId)
            },
            _openDeleteMeterMachineModel: function (_meterMachine) {
                vc.emit('deleteMeterMachine', 'openDeleteMeterMachineModal', _meterMachine);
            },
            _openSettingMeterMachineRead: function () {
                vc.emit('settingMeterMachineRead', 'openSettingMeterMachineReadModal', {});
            },
            _openCustomRead: function () {
                vc.emit('customReadMeterMachine', 'openCustomReadMeterMachineModal', {});
            },
            _openImportMeterMachine() {
                vc.emit('importMeterMachine', 'openImportMeterMachineModal', {})
            },
            _toDetail: function (_meterMachine) {
                vc.jumpToPage('/#/pages/machine/meterMachineDetail?machineId=' + _meterMachine.machineId)
            },
            //查询
            _queryMeterMachineMethod: function () {
                vc.component._listMeterMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMeterMachineMethod: function () {
                vc.component.meterMachineManageInfo.conditions.machineNameLike = "";
                vc.component.meterMachineManageInfo.conditions.address = "";
                vc.component.meterMachineManageInfo.conditions.meterType = "";
                vc.component.meterMachineManageInfo.conditions.machineModel = "";
                vc.component.meterMachineManageInfo.conditions.roomNameLike = "";
                vc.component.meterMachineManageInfo.conditions.implBean = "";
                vc.component._listMeterMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.meterMachineManageInfo.moreCondition) {
                    vc.component.meterMachineManageInfo.moreCondition = false;
                } else {
                    vc.component.meterMachineManageInfo.moreCondition = true;
                }
            },
            _listMeterType: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/meterType.listMeterType',
                    param,
                    function (json, res) {
                        let _accessControlMachineManageInfo = JSON.parse(json);
                        $that.meterMachineManageInfo.meterTypes = _accessControlMachineManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listFactorys: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                    }
                };
                //发送get请求
                vc.http.apiGet('/meterMachine.listMeterMachineFactory', param,
                    function (json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.meterMachineManageInfo.factorys = _feeConfigManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getMeterTypeName: function (meterType) {
                let _meterTypeName = "";
                $that.meterMachineManageInfo.meterTypes.forEach(item => {
                    if (meterType == item.typeId) {
                        _meterTypeName = item.typeName
                    }
                });
                if (!_meterTypeName) {
                    _meterTypeName = '-';
                }
                return _meterTypeName;
            }
        }
    });
})(window.vc);