/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            machineAuthManageInfo: {
                machineAuths: [],
                accessControlMachines: [],
                total: 0,
                records: 1,
                moreCondition: false,
                authId: '',
                conditions: {
                    machineId: '',
                    personName: '',
                    personId: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component.listAccessControlMachine();
            vc.component._listMachineAuths(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('machineAuthManage', 'listMachineAuth', function (_param) {
                vc.component._listMachineAuths(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMachineAuths(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMachineAuths: function (_page, _rows) {
                vc.component.machineAuthManageInfo.conditions.page = _page;
                vc.component.machineAuthManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.machineAuthManageInfo.conditions
                };
                param.params.personId = param.params.personId.trim();
                param.params.personName = param.params.personName.trim();
                //发送get请求
                vc.http.apiGet('machineAuth.listMachineAuths',
                    param,
                    function (json, res) {
                        var _machineAuthManageInfo = JSON.parse(json);
                        vc.component.machineAuthManageInfo.total = _machineAuthManageInfo.total;
                        vc.component.machineAuthManageInfo.records = _machineAuthManageInfo.records;
                        vc.component.machineAuthManageInfo.machineAuths = _machineAuthManageInfo.machineAuths;
                        vc.emit('pagination', 'init', {
                            total: vc.component.machineAuthManageInfo.records,
                            dataCount: vc.component.machineAuthManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMachineAuthModal: function () {
                vc.emit('addMachineAuth', 'openAddMachineAuthModal', {});
            },
            _openEditMachineAuthModel: function (_machineAuth) {
                vc.emit('editMachineAuth', 'openEditMachineAuthModal', _machineAuth);
            },
            _openDeleteMachineAuthModel: function (_machineAuth) {
                vc.emit('deleteMachineAuth', 'openDeleteMachineAuthModal', _machineAuth);
            },
            //查询
            _queryMachineAuthMethod: function () {
                vc.component._listMachineAuths(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMachineAuthMethod: function () {
                vc.component.machineAuthManageInfo.conditions.machineId = "";
                vc.component.machineAuthManageInfo.conditions.personName = "";
                vc.component.machineAuthManageInfo.conditions.personId = "";
                vc.component._listMachineAuths(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询门禁设备
            listAccessControlMachine: function () {
                var param = {
                    params: {
                        page: DEFAULT_PAGE,
                        row: DEFAULT_ROWS,
                        machineTypeCd: '9999',
                        communityId: vc.getCurrentCommunity().communityId,
                        domain: 'ACCESS_CONTROL'
                    }
                };
                //发送get请求
                vc.http.apiGet('/machine.listMachines',
                    param,
                    function (json) {
                        var _listAccessControlMachine = JSON.parse(json);
                        vc.component.machineAuthManageInfo.accessControlMachines = _listAccessControlMachine.machines;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.machineAuthManageInfo.moreCondition) {
                    vc.component.machineAuthManageInfo.moreCondition = false;
                } else {
                    vc.component.machineAuthManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
