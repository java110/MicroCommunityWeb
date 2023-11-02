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
            //$that._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            //$that._validateParam();
            vc.getDict('r_repair_pool', "state", function (_data) {
                $that.ownerRepairManageInfo.states = _data;
            });
            $that._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            //与字典表关联
            // vc.getDict('r_repair_pool', "repair_type", function (_data) {
            //     $that.ownerRepairManageInfo.repairTypes = _data;
            // });
            // 获取repair_types 不再从字典表查询
            $that._listRepairTypes(DEFAULT_PAGE, 50);
            //与字典表关联
            vc.getDict('r_repair_pool', "state", function (_data) {
                $that.ownerRepairManageInfo.states = _data;
            });
        },
        _initEvent: function () {
            vc.on('ownerRepairManage', 'listOwnerRepair', function (_param) {
                $that._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listOwnerRepairs(_currentPage, DEFAULT_ROWS);
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
                        $that.ownerRepairManageInfo.repairTypes = _repairTypesInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询方法
            _listOwnerRepairs: function (_page, _rows) {
                $that.ownerRepairManageInfo.conditions.page = _page;
                $that.ownerRepairManageInfo.conditions.row = _rows;
                $that.ownerRepairManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                // $that.ownerRepairManageInfo.conditions.state = '1000';
                var param = {
                    params: $that.ownerRepairManageInfo.conditions
                };
                //报修ID去空
                param.params.repairId = param.params.repairId.trim();
                //报修人去空
                param.params.repairName = param.params.repairName.trim();
                //报修电话去空
                param.params.tel = param.params.tel.trim();
                //发送get请求
                vc.http.apiGet('/ownerRepair.listOwnerRepairs',
                    param,
                    function (json, res) {
                        var _ownerRepairManageInfo = JSON.parse(json);
                        $that.ownerRepairManageInfo.total = _ownerRepairManageInfo.total;
                        $that.ownerRepairManageInfo.records = _ownerRepairManageInfo.records;
                        $that.ownerRepairManageInfo.ownerRepairs = _ownerRepairManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.ownerRepairManageInfo.records,
                            dataCount: $that.ownerRepairManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetListOwnerRepairs: function (_page, _rows) {
                $that.ownerRepairManageInfo.conditions.repairId = '';
                $that.ownerRepairManageInfo.conditions.repairName = '';
                $that.ownerRepairManageInfo.conditions.tel = '';
                $that.ownerRepairManageInfo.conditions.repairType = '';
                $that.ownerRepairManageInfo.conditions.state = '';
                $that._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddOwnerRepairModal: function () {
                vc.emit('addOwnerRepair', 'openAddOwnerRepairModal', $that.ownerRepairManageInfo.conditions);
            },
            _openEditOwnerRepairModel: function (_ownerRepair) {
                _ownerRepair.roomName = $that.ownerRepairManageInfo.conditions.roomName;
                _ownerRepair.roomId = $that.ownerRepairManageInfo.conditions.roomId;
                vc.emit('editOwnerRepair', 'openEditOwnerRepairModal', _ownerRepair);
            },
            _openDeleteOwnerRepairModel: function (_ownerRepair) {
                vc.emit('deleteOwnerRepair', 'openDeleteOwnerRepairModal', _ownerRepair);
            },
            //查询
            _queryOwnerRepairMethod: function () {
                $that._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetOwnerRepairMethod: function () {
                $that._resetListOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDispatchRepair: function (_ownerRepair) {
                vc.jumpToPage('/#/pages/property/repairDispatchStep?repairId=' + _ownerRepair.repairId);
            },
            _moreCondition: function () {
                if ($that.ownerRepairManageInfo.moreCondition) {
                    $that.ownerRepairManageInfo.moreCondition = false;
                } else {
                    $that.ownerRepairManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);