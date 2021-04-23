/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerRepairManageInfo: {
                ownerRepairs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                repairName: '',
                repairTypes: [],
                states: [],
                conditions: {
                    repairId: '',
                    repairName: '',
                    tel: '',
                    repairType: '',
                    repairTypeName: '',
                    ownerId: '',
                    state: '',
                    reqSource: 'pc_mobile'
                }
            }
        },
        _initMethod: function () {
            //vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            //vc.component._validateParam();
            vc.getDict('r_repair_pool', "state", function (_data) {
                vc.component.ownerRepairManageInfo.states = _data;
            });
            vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            //与字典表关联
            // vc.getDict('r_repair_pool', "repair_type", function (_data) {
            //     vc.component.ownerRepairManageInfo.repairTypes = _data;
            // });
            // 获取repair_types 不再从字典表查询
            $that._listRepairTypes(DEFAULT_PAGE, 50);
            //与字典表关联
            vc.getDict('r_repair_pool', "state", function (_data) {
                vc.component.ownerRepairManageInfo.states = _data;
            });
        },
        _initEvent: function () {
            vc.on('ownerRepairManage', 'listOwnerRepair', function (_param) {
                vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listOwnerRepairs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            // 查询repair_types
            _listRepairTypes: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('repair.listRepairSettings',
                    param,
                    function (json, res) {
                        var _repairTypesInfo = JSON.parse(json);
                        vc.component.ownerRepairManageInfo.repairTypes = _repairTypesInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询方法
            _listOwnerRepairs: function (_page, _rows) {
                vc.component.ownerRepairManageInfo.conditions.page = _page;
                vc.component.ownerRepairManageInfo.conditions.row = _rows;
                vc.component.ownerRepairManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                // vc.component.ownerRepairManageInfo.conditions.state = '1000';
                var param = {
                    params: vc.component.ownerRepairManageInfo.conditions
                };
                //报修ID去空
                param.params.repairId = param.params.repairId.trim();
                //报修人去空
                param.params.repairName = param.params.repairName.trim();
                //报修电话去空
                param.params.tel = param.params.tel.trim();
                //发送get请求
                vc.http.get('ownerRepairManage',
                    'list',
                    param,
                    function (json, res) {
                        var _ownerRepairManageInfo = JSON.parse(json);
                        vc.component.ownerRepairManageInfo.total = _ownerRepairManageInfo.total;
                        vc.component.ownerRepairManageInfo.records = _ownerRepairManageInfo.records;
                        vc.component.ownerRepairManageInfo.ownerRepairs = _ownerRepairManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.ownerRepairManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetListOwnerRepairs: function (_page, _rows) {
                vc.component.ownerRepairManageInfo.conditions.repairId = '';
                vc.component.ownerRepairManageInfo.conditions.repairName = '';
                vc.component.ownerRepairManageInfo.conditions.tel = '';
                vc.component.ownerRepairManageInfo.conditions.repairType = '';
                vc.component.ownerRepairManageInfo.conditions.state = '';
                var param = {
                    params: vc.component.ownerRepairManageInfo.conditions
                };
                //发送get请求
                vc.http.get('ownerRepairManage',
                    'list',
                    param,
                    function (json, res) {
                        var _ownerRepairManageInfo = JSON.parse(json);
                        vc.component.ownerRepairManageInfo.total = _ownerRepairManageInfo.total;
                        vc.component.ownerRepairManageInfo.records = _ownerRepairManageInfo.records;
                        vc.component.ownerRepairManageInfo.ownerRepairs = _ownerRepairManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.ownerRepairManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddOwnerRepairModal: function () {
                vc.emit('addOwnerRepair', 'openAddOwnerRepairModal', vc.component.ownerRepairManageInfo.conditions);
            },
            _openEditOwnerRepairModel: function (_ownerRepair) {
                _ownerRepair.roomName = vc.component.ownerRepairManageInfo.conditions.roomName;
                _ownerRepair.roomId = vc.component.ownerRepairManageInfo.conditions.roomId;
                vc.emit('editOwnerRepair', 'openEditOwnerRepairModal', _ownerRepair);
            },
            _openDeleteOwnerRepairModel: function (_ownerRepair) {
                vc.emit('deleteOwnerRepair', 'openDeleteOwnerRepairModal', _ownerRepair);
            },
            //查询
            _queryOwnerRepairMethod: function () {
                vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetOwnerRepairMethod: function () {
                vc.component._resetListOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDispatchRepair: function (_ownerRepair) {
                vc.jumpToPage('/admin.html#/pages/property/repairDispatchStep?repairId=' + _ownerRepair.repairId);
            },
            _moreCondition: function () {
                if (vc.component.ownerRepairManageInfo.moreCondition) {
                    vc.component.ownerRepairManageInfo.moreCondition = false;
                } else {
                    vc.component.ownerRepairManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
