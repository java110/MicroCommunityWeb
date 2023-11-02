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
                $that.repairDispatchManageInfo.states = _data;
            });
            $that._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listRepairTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            //与字典表关联
            vc.getDict('r_repair_pool', "state", function (_data) {
                $that.repairDispatchManageInfo.states = _data;
            });
        },
        _initEvent: function () {
            vc.on('repairDispatchManage', 'listOwnerRepair', function (_param) {
                $that._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listOwnerRepairs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _validateParam: function () {
                var _ownerId = vc.getParam('ownerId')
                var _roomId = vc.getParam('roomId')
                if (!vc.notNull(_roomId)) {
                    vc.toast("非法操作，未找到房屋信息");
                    vc.jumpToPage('/#/pages/property/listOwner');
                    return;
                }
                $that.repairDispatchManageInfo.conditions.roomId = _roomId;
                $that.repairDispatchManageInfo.conditions.ownerId = _ownerId;
                let param = {
                    params: {
                        roomId: $that.repairDispatchManageInfo.conditions.roomId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 1
                    }
                };
                //查询房屋信息 业主信息
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            var _roomInfos = JSON.parse(json);
                            if (!_roomInfos.hasOwnProperty("rooms")) {
                                vc.toast("非法操作，未找到房屋信息");
                                vc.jumpToPage('/#/pages/property/listOwner');
                                return;
                            }
                            let _roomInfo = _roomInfos.rooms[0];
                            $that.repairDispatchManageInfo.conditions.roomName = _roomInfo.floorNum + "号楼 " + _roomInfo.unitNum + "单元 " + _roomInfo.roomNum + "室";
                            $that._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
                        } else {
                            vc.toast("非法操作，未找到房屋信息");
                            vc.jumpToPage('/#/pages/property/listOwner');
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("非法操作，未找到房屋信息");
                        vc.jumpToPage('/#/pages/property/listOwner');
                    }
                );
            },
            _listOwnerRepairs: function (_page, _rows) {
                $that.repairDispatchManageInfo.conditions.page = _page;
                $that.repairDispatchManageInfo.conditions.row = _rows;
                $that.repairDispatchManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: $that.repairDispatchManageInfo.conditions
                };
                param.params.repairId = param.params.repairId.trim();
                param.params.repairName = param.params.repairName.trim();
                param.params.tel = param.params.tel.trim();
                //发送get请求
                vc.http.apiGet('/ownerRepair.listStaffRepairs',
                    param,
                    function (json, res) {
                        var _repairDispatchManageInfo = JSON.parse(json);
                        $that.repairDispatchManageInfo.total = _repairDispatchManageInfo.total;
                        $that.repairDispatchManageInfo.records = _repairDispatchManageInfo.records;
                        $that.repairDispatchManageInfo.ownerRepairs = _repairDispatchManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.repairDispatchManageInfo.records,
                            dataCount: $that.repairDispatchManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryOwnerRepairMethod: function () {
                $that._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetOwnerRepairMethod: function () {
                $that.repairDispatchManageInfo.conditions.repairId = "";
                $that.repairDispatchManageInfo.conditions.repairName = "";
                $that.repairDispatchManageInfo.conditions.tel = "";
                $that.repairDispatchManageInfo.conditions.repairType = "";
                $that.repairDispatchManageInfo.conditions.state = "";
                $that._listOwnerRepairs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //办结
            _openFinishRepair: function (_ownerRepair) {
                // vc.emit('finishRepair', 'openFinishRepairModal', _ownerRepair);
                vc.jumpToPage('/#/pages/property/finishRepair?repairType=' + _ownerRepair.repairType + '&repairId=' + _ownerRepair.repairId + '&repairObjType=' + _ownerRepair.repairObjType + '&publicArea=' + _ownerRepair.publicArea + '&repairChannel=' + _ownerRepair.repairChannel);
            },
            //详情
            _openDispatchRepairDetail: function (_ownerRepair) {
                //vc.emit('ownerRepairDetail','openOwnerRepairDetailModal',_ownerRepair);
                vc.jumpToPage('/#/pages/property/ownerRepairDetail?repairId=' + _ownerRepair.repairId);
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
                        $that.repairDispatchManageInfo.repairTypes = _repairTypesInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if ($that.repairDispatchManageInfo.moreCondition) {
                    $that.repairDispatchManageInfo.moreCondition = false;
                } else {
                    $that.repairDispatchManageInfo.moreCondition = true;
                }
            },
            //转单
            _openDispatchRepairModel: function (_repair) {
                _repair.action = "TRANSFER";
                vc.emit('dispatchRepair', 'openDispatchRepairModal', _repair);
            },
            //退单
            _openBackRepairModel: function (_repair) {
                _repair.action = "BACK";
                vc.emit('dispatchRepair', 'openDispatchRepairModal', _repair);
            },
            //回访
            _openAppraiseRepair: function (_repair) {
                vc.emit('appraiseRepair', 'openAppraiseRepairModal', _repair);
            },
            //暂停
            _openStopRepair: function (_repair) {
                vc.emit('stopRepair', 'openStopRepairModal', _repair);
            },
            //启动
            _openStartRepair: function (_repair) {
                vc.emit('startRepair', 'openStartRepairModal', _repair);
            }
        }
    });
})(window.vc);