/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            repairReturnVisitInfo: {
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
                    state: 'waiting'
                }
            }
        },
        _initMethod: function () {
            //vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            //vc.component._validateParam();
            $that._listRepairSettings(DEFAULT_PAGE, 50);
            vc.getDict('r_repair_pool', "state", function (_data) {
                vc.component.repairReturnVisitInfo.states = _data;
            });
            vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('repairReturnVisit', 'listRepairPool', function (_param) {
                vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRepairPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listRepairPools: function (_page, _rows) {
                vc.component.repairReturnVisitInfo.conditions.page = _page;
                vc.component.repairReturnVisitInfo.conditions.row = _rows;
                vc.component.repairReturnVisitInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.repairReturnVisitInfo.conditions
                };
                //报修人查询框去空
                param.params.repairName = param.params.repairName.trim();
                //报修ID查询框去空
                param.params.repairId = param.params.repairId.trim();
                //报修电话查询框去空
                param.params.tel = param.params.tel.trim();
                //发送get请求
                vc.http.apiGet('/repair/queryRepairReturnVisit',
                    param,
                    function (json, res) {
                        var _repairReturnVisitInfo = JSON.parse(json);
                        vc.component.repairReturnVisitInfo.total = _repairReturnVisitInfo.total;
                        vc.component.repairReturnVisitInfo.records = _repairReturnVisitInfo.records;
                        vc.component.repairReturnVisitInfo.repairPools = _repairReturnVisitInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.repairReturnVisitInfo.records,
                            dataCount: vc.component.repairReturnVisitInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            
            _openRepairDetail: function (_repairPool) {
                vc.jumpToPage('/admin.html#/pages/property/ownerRepairDetail?repairId=' + _repairPool.repairId)
            },
            //查询
            _queryRepairPoolMethod: function () {
                vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            },
           
            _openEditOwnerRepairModel: function (_repairPool) {
                // _ownerRepair.roomName = vc.component.ownerRepairManageInfo.conditions.roomName;
                // _ownerRepair.roomId = vc.component.ownerRepairManageInfo.conditions.roomId;
                vc.emit('visitOwnerRepair', 'openVisitOwnerRepairModal', _repairPool);
            },
           
            _moreCondition: function () {
                if (vc.component.repairReturnVisitInfo.moreCondition) {
                    vc.component.repairReturnVisitInfo.moreCondition = false;
                } else {
                    vc.component.repairReturnVisitInfo.moreCondition = true;
                }
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
                        vc.component.repairReturnVisitInfo.repairSettings = _repairSettingManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);
