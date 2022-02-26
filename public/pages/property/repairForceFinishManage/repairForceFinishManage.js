/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            repairForceFinishManageInfo: {
                repairPools: [],
                total: 0,
                records: 1,
                moreCondition: false,
                repairName: '',
                repairSettings: [],
                states: [],
                conditions: {
                    repairId: '',
                    repairName: '',
                    tel: '',
                    repairType: '',
                    roomId: '',
                    roomName: '',
                    ownerId: '',
                    state: '1100'
                }
            }
        },
        _initMethod: function() {
            //vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            //vc.component._validateParam();
            $that._listRepairSettings(DEFAULT_PAGE, 50);
            vc.getDict('r_repair_pool', "state", function(_data) {
                vc.component.repairForceFinishManageInfo.states = _data;
            });
            vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('repairForceFinishManage', 'listRepairPool', function(_param) {
                vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listRepairPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listRepairPools: function(_page, _rows) {
                vc.component.repairForceFinishManageInfo.conditions.page = _page;
                vc.component.repairForceFinishManageInfo.conditions.row = _rows;
                vc.component.repairForceFinishManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.repairForceFinishManageInfo.conditions
                };
                //报修人查询框去空
                param.params.repairName = param.params.repairName.trim();
                //报修ID查询框去空
                param.params.repairId = param.params.repairId.trim();
                //报修电话查询框去空
                param.params.tel = param.params.tel.trim();
                //发送get请求
                vc.http.get('ownerRepairManage',
                    'list',
                    param,
                    function(json, res) {
                        var _repairForceFinishManageInfo = JSON.parse(json);
                        vc.component.repairForceFinishManageInfo.total = _repairForceFinishManageInfo.total;
                        vc.component.repairForceFinishManageInfo.records = _repairForceFinishManageInfo.records;
                        vc.component.repairForceFinishManageInfo.repairPools = _repairForceFinishManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.repairForceFinishManageInfo.records,
                            dataCount: vc.component.repairForceFinishManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetRepairPools: function(_page, _rows) {
                vc.component.repairForceFinishManageInfo.conditions.repairType = '';
                vc.component.repairForceFinishManageInfo.conditions.repairName = '';
                vc.component.repairForceFinishManageInfo.conditions.state = '';
                vc.component.repairForceFinishManageInfo.conditions.repairId = '';
                vc.component.repairForceFinishManageInfo.conditions.tel = '';
                $that._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openRepairDetail: function(_repairPool) {
                vc.jumpToPage('/#/pages/property/ownerRepairDetail?repairId=' + _repairPool.repairId)
            },
            //查询
            _queryRepairPoolMethod: function() {
                vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetRepairPoolMethod: function() {
                vc.component._resetRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.repairForceFinishManageInfo.moreCondition) {
                    vc.component.repairForceFinishManageInfo.moreCondition = false;
                } else {
                    vc.component.repairForceFinishManageInfo.moreCondition = true;
                }
            },
            _openForceFinishRepairModel: function(_repair) {
                vc.emit('forceFinishRepair', 'openDispatchRepairModal', _repair);
            },

            _listRepairSettings: function(_page, _rows) {
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
                    function(json, res) {
                        var _repairSettingManageInfo = JSON.parse(json);
                        vc.component.repairForceFinishManageInfo.repairSettings = _repairSettingManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);