/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            repairPoolManageInfo: {
                repairPools: [],
                total: 0,
                records: 1,
                moreCondition: false,
                repairName: '',
                repairSettings: [],
                states: [],
                repairSettingTypes: [],
                conditions: {
                    repairId: '',
                    repairName: '',
                    tel: '',
                    repairType: '',
                    repairSettingType: '',
                    roomId: '',
                    roomName: '',
                    ownerId: '',
                    state: ''
                }
            }
        },
        _initMethod: function () {
            //vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            //vc.component._validateParam();
            $that._listRepairSettings(DEFAULT_PAGE, 50);
            vc.getDict('r_repair_pool', "state", function (_data) {
                vc.component.repairPoolManageInfo.states = _data;
            });
            vc.getDict('r_repair_setting', "repair_setting_type", function (_data) {
                vc.component.repairPoolManageInfo.repairSettingTypes = _data;
            });
            vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('repairPoolManage', 'listRepairPool', function (_param) {
                vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRepairPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listRepairPools: function (_page, _rows) {
                vc.component.repairPoolManageInfo.conditions.page = _page;
                vc.component.repairPoolManageInfo.conditions.row = _rows;
                vc.component.repairPoolManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.repairPoolManageInfo.conditions
                };
                //报修人查询框去空
                param.params.repairName = param.params.repairName.trim();
                //报修ID查询框去空
                param.params.repairId = param.params.repairId.trim();
                //报修电话查询框去空
                param.params.tel = param.params.tel.trim();
                //发送get请求
                vc.http.apiGet('/ownerRepair.listOwnerRepairs',
                    param,
                    function (json, res) {
                        var _repairPoolManageInfo = JSON.parse(json);
                        vc.component.repairPoolManageInfo.total = _repairPoolManageInfo.total;
                        vc.component.repairPoolManageInfo.records = _repairPoolManageInfo.records;
                        vc.component.repairPoolManageInfo.repairPools = _repairPoolManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.repairPoolManageInfo.records,
                            dataCount: vc.component.repairPoolManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetRepairPools: function (_page, _rows) {
                vc.component.repairPoolManageInfo.conditions.repairType = "";
                vc.component.repairPoolManageInfo.conditions.repairName = "";
                vc.component.repairPoolManageInfo.conditions.state = "";
                vc.component.repairPoolManageInfo.conditions.repairId = "";
                vc.component.repairPoolManageInfo.conditions.tel = "";
                vc.component.repairPoolManageInfo.conditions.repairSettingType = "";
                $that._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openRepairDetail: function (_repairPool) {
                vc.jumpToPage('/#/pages/property/ownerRepairDetail?repairId=' + _repairPool.repairId)
            },
            _openDeleteRepairPoolModel: function (_repairPool) {
                vc.emit('deleteRepairPool', 'openDeleteRepairPoolModal', _repairPool);
            },
            //查询
            _queryRepairPoolMethod: function () {
                vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetRepairPoolMethod: function () {
                vc.component._resetRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openEditOwnerRepairModel: function (_repairPool) {
                // _ownerRepair.roomName = vc.component.ownerRepairManageInfo.conditions.roomName;
                // _ownerRepair.roomId = vc.component.ownerRepairManageInfo.conditions.roomId;
                vc.emit('editOwnerRepair', 'openEditOwnerRepairModal', _repairPool);
            },
            _openDispatchRepair: function (_repairPool) {
                vc.jumpToPage('/#/pages/property/repairDispatchStep?repairId=' + _repairPool.repairId);
            },
            _moreCondition: function () {
                if (vc.component.repairPoolManageInfo.moreCondition) {
                    vc.component.repairPoolManageInfo.moreCondition = false;
                } else {
                    vc.component.repairPoolManageInfo.moreCondition = true;
                }
            },
            //派单
            _openDispatchRepairModel: function (_repair) {
                _repair.action = "DISPATCH";
                vc.emit('dispatchRepair', 'openDispatchRepairModal', _repair);
            },
            //删除
            _openDeleteRepairDetailModel: function (_repairPool) {
                vc.emit('deleteOwnerRepair', 'openDeleteOwnerRepairModal', _repairPool);
            },
            _listRepairSettings: function (_page, _rows) {
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
                        var _repairSettingManageInfo = JSON.parse(json);
                        vc.component.repairPoolManageInfo.repairSettings = _repairSettingManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //抢单
            _openGrabbingRepairModel: function (_repair) {
                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    repairId: _repair.repairId
                };
                vc.http.apiPost(
                    'ownerRepair.grabbingRepair',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.emit('repairPoolManage', 'listRepairPool', {});
                            vc.toast("操作成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);