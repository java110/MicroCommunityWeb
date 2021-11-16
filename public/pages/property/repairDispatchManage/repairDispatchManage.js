/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            repairDispatchManageInfo: {
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
                    roomId: '',
                    roomName: '',
                    ownerId: '',
                    state: ''
                }
            }
        },
        _initMethod: function () {
            vc.getDict('r_repair_pool', "state", function (_data) {
                vc.component.repairDispatchManageInfo.states = _data;
            });
            vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._listRepairTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            //与字典表关联
            vc.getDict('r_repair_pool', "state", function (_data) {
                vc.component.repairDispatchManageInfo.states = _data;
            });
        },
        _initEvent: function () {
            vc.on('repairDispatchManage', 'listOwnerRepair', function (_param) {
                location.reload();
                // vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listOwnerRepairs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _validateParam: function () {
                var _ownerId = vc.getParam('ownerId')
                var _roomId = vc.getParam('roomId')

                if (!vc.notNull(_roomId)) {
                    vc.toast("非法操作，未找到房屋信息");
                    vc.jumpToPage('/admin.html#/pages/property/listOwner');
                    return;
                }
                vc.component.repairDispatchManageInfo.conditions.roomId = _roomId;
                vc.component.repairDispatchManageInfo.conditions.ownerId = _ownerId;
                var param = {
                    params: {
                        roomId: vc.component.repairDispatchManageInfo.conditions.roomId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 1
                    }
                };
                //查询房屋信息 业主信息
                vc.http.get('repairDispatchManage',
                    'getRoom',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            var _roomInfos = JSON.parse(json);
                            if (!_roomInfos.hasOwnProperty("rooms")) {
                                vc.toast("非法操作，未找到房屋信息");
                                vc.jumpToPage('/admin.html#/pages/property/listOwner');
                                return;
                            }
                            var _roomInfo = _roomInfos.rooms[0];
                            vc.component.repairDispatchManageInfo.conditions.roomName = _roomInfo.floorNum + "号楼 " + _roomInfo.unitNum + "单元 " + _roomInfo.roomNum + "室";
                            vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
                        } else {
                            vc.toast("非法操作，未找到房屋信息");
                            vc.jumpToPage('/admin.html#/pages/property/listOwner');
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("非法操作，未找到房屋信息");
                        vc.jumpToPage('/admin.html#/pages/property/listOwner');
                    }
                );
            },
            _listOwnerRepairs: function (_page, _rows) {
                vc.component.repairDispatchManageInfo.conditions.page = _page;
                vc.component.repairDispatchManageInfo.conditions.row = _rows;
                vc.component.repairDispatchManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.repairDispatchManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('ownerRepair.listStaffRepairs',
                    param,
                    function (json, res) {
                        var _repairDispatchManageInfo = JSON.parse(json);
                        vc.component.repairDispatchManageInfo.total = _repairDispatchManageInfo.total;
                        vc.component.repairDispatchManageInfo.records = _repairDispatchManageInfo.records;
                        vc.component.repairDispatchManageInfo.ownerRepairs = _repairDispatchManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.repairDispatchManageInfo.records,
                            dataCount: vc.component.repairDispatchManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryOwnerRepairMethod: function () {
                vc.component._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //办结
            _openFinishRepair: function (_ownerRepair) {
                // vc.emit('finishRepair', 'openFinishRepairModal', _ownerRepair);
                vc.jumpToPage('/admin.html#/pages/property/finishRepair?repairType=' + _ownerRepair.repairType + '&repairId=' + _ownerRepair.repairId + '&repairObjType=' + _ownerRepair.repairObjType + '&publicArea=' + _ownerRepair.publicArea + '&repairChannel=' + _ownerRepair.repairChannel);
            },
            _openDispatchRepairDetail: function (_ownerRepair) {
                //vc.emit('ownerRepairDetail','openOwnerRepairDetailModal',_ownerRepair);
                vc.jumpToPage('/admin.html#/pages/property/ownerRepairDetail?repairId=' + _ownerRepair.repairId);
            },
            //查询报修类型
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
                        vc.component.repairDispatchManageInfo.repairTypes = _repairTypesInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.repairDispatchManageInfo.moreCondition) {
                    vc.component.repairDispatchManageInfo.moreCondition = false;
                } else {
                    vc.component.repairDispatchManageInfo.moreCondition = true;
                }
            },
            _openDispatchRepairModel: function (_repair) {
                _repair.action = "TRANSFER";
                vc.emit('dispatchRepair', 'openDispatchRepairModal', _repair);
            },
            _openBackRepairModel: function (_repair) {
                _repair.action = "BACK";
                vc.emit('dispatchRepair', 'openDispatchRepairModal', _repair);
            },
            //回访
            _openAppraiseRepair: function (_repair) {
                vc.emit('appraiseRepair', 'openAppraiseRepairModal', _repair);
            }
        }
    });
})(window.vc);
