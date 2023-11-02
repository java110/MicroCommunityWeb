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
        _initMethod: function() {
            $that._listMeterMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listMeterType();
            $that._listFactorys();
        },
        _initEvent: function() {

            vc.on('meterMachineManage', 'listMeterMachine', function(_param) {
                $that._listMeterMachines(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listMeterMachines(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMeterMachines: function(_page, _rows) {

                $that.meterMachineManageInfo.conditions.page = _page;
                $that.meterMachineManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.meterMachineManageInfo.conditions
                };
                param.params.machineNameLike = param.params.machineNameLike.trim();
                param.params.address = param.params.address.trim();
                param.params.roomNameLike = param.params.roomNameLike.trim();
                //发送get请求
                vc.http.apiGet('/meterMachine.listMeterMachine',
                    param,
                    function (json, res) {
                        var _meterMachineManageInfo = JSON.parse(json);
                        $that.meterMachineManageInfo.total = _meterMachineManageInfo.total;
                        $that.meterMachineManageInfo.records = _meterMachineManageInfo.records;
                        $that.meterMachineManageInfo.meterMachines = _meterMachineManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.meterMachineManageInfo.records,
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
            _queryMeterMachineMethod: function() {
                $that._listMeterMachines(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if ($that.meterMachineManageInfo.moreCondition) {
                    $that.meterMachineManageInfo.moreCondition = false;
                } else {
                    $that.meterMachineManageInfo.moreCondition = true;
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