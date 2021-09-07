/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roomRenovationManageInfo: {
                roomRenovations: [],
                total: 0,
                records: 1,
                moreCondition: false,
                rId: '',
                states: [],
                conditions: {
                    roomName: '',
                    roomId: '',
                    personName: '',
                    personTel: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.getDict('room_renovation', "state", function (_data) {
                vc.component.roomRenovationManageInfo.states = _data;
            });
            vc.component._listRoomRenovations(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('roomRenovationManage', 'listRoomRenovation', function (_param) {
                vc.component._listRoomRenovations(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRoomRenovations(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listRoomRenovations: function (_page, _rows) {
                vc.component.roomRenovationManageInfo.conditions.page = _page;
                vc.component.roomRenovationManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.roomRenovationManageInfo.conditions
                };
                param.params.roomName = param.params.roomName.trim();
                param.params.personName = param.params.personName.trim();
                param.params.personTel = param.params.personTel.trim();
                //发送get请求
                vc.http.apiGet('/roomRenovation/queryRoomRenovation',
                    param,
                    function (json, res) {
                        var _roomRenovationManageInfo = JSON.parse(json);
                        vc.component.roomRenovationManageInfo.total = _roomRenovationManageInfo.total;
                        vc.component.roomRenovationManageInfo.records = _roomRenovationManageInfo.records;
                        vc.component.roomRenovationManageInfo.roomRenovations = _roomRenovationManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.roomRenovationManageInfo.records,
                            dataCount: vc.component.roomRenovationManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetListRoomRenovations: function (_page, _rows) {
                vc.component.roomRenovationManageInfo.conditions.page = _page;
                vc.component.roomRenovationManageInfo.conditions.row = _rows;
                vc.component.roomRenovationManageInfo.conditions.roomName = '';
                vc.component.roomRenovationManageInfo.conditions.personName = '';
                vc.component.roomRenovationManageInfo.conditions.personTel = '';
                vc.component.roomRenovationManageInfo.conditions.state = '';
                $that._listRoomRenovations(DEFAULT_PAGE,DEFAULT_ROWS);
            },
            _openAddRoomRenovationModal: function () {
                vc.emit('addRoomRenovation', 'openAddRoomRenovationModal', vc.component.roomRenovationManageInfo.roomRenovations);
            },
            //修改
            _openEditRoomRenovationModel: function (_roomRenovation) {
                vc.emit('editRoomRenovation', 'openEditRoomRenovationModal', _roomRenovation);
            },
            _openDeleteRoomRenovationModel: function (_roomRenovation) {
                vc.emit('deleteRoomRenovation', 'openDeleteRoomRenovationModal', _roomRenovation);
            },
            //查询
            _queryRoomRenovationMethod: function () {
                vc.component._listRoomRenovations(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetRoomRenovationMethod: function () {
                vc.component._resetListRoomRenovations(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openRoomRenovationFee: function (_room) {
                vc.jumpToPage('/admin.html#/pages/property/listRoomFee?roomId=' + _room.roomId);
            },
            //跟踪记录
            _openRoomDecorationRecord: function (_room) {
                vc.jumpToPage('/admin.html#/pages/property/listRoomDecorationRecord?roomId=' + _room.roomId +
                    '&rId=' + _room.rId + '&roomName=' + _room.roomName + '&state=' + _room.state + '&stateName=' + _room.stateName);
            },
            //装修完成
            _openDecorationCompleted: function (_roomRenovation) {
                vc.emit('roomRenovationCompleted', 'openRoomRenovationCompletedModal', _roomRenovation);
            },
            //审核状态
            _openToExamine: function (_room) {
                vc.emit('roomToExamine', 'openRoomToExamineModal', _room);
            },
            _moreCondition: function () {
                if (vc.component.roomRenovationManageInfo.moreCondition) {
                    vc.component.roomRenovationManageInfo.moreCondition = false;
                } else {
                    vc.component.roomRenovationManageInfo.moreCondition = true;
                }
            },
            //装修验收
            _openDecorationAcceptanceModel: function (_room) {
                vc.emit('roomDecorationAcceptance', 'openRoomDecorationAcceptanceModal', _room);
            },
            _openRoomRenovationDetail: function (_room) {
                vc.jumpToPage('/admin.html#/pages/property/roomRenovationDetailManage?rId=' + _room.rId + '&roomName=' + _room.roomName);
            },
            _moreCondition: function () {
                if (vc.component.roomRenovationManageInfo.moreCondition) {
                    vc.component.roomRenovationManageInfo.moreCondition = false;
                } else {
                    vc.component.roomRenovationManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
