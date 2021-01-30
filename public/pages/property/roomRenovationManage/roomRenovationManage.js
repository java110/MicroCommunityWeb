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
                conditions: {
                    roomName: '',
                    personName: '',
                    personTel: '',
                    communityId: vc.getCurrentCommunity().communityId

                }
            }
        },
        _initMethod: function () {
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
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddRoomRenovationModal: function () {
                vc.emit('addRoomRenovation', 'openAddRoomRenovationModal', {});
            },
            _openEditRoomRenovationModel: function (_roomRenovation) {
                vc.emit('editRoomRenovation', 'openEditRoomRenovationModal', _roomRenovation);
            },
            _openDeleteRoomRenovationModel: function (_roomRenovation) {
                vc.emit('deleteRoomRenovation', 'openDeleteRoomRenovationModal', _roomRenovation);
            },
            _queryRoomRenovationMethod: function () {
                vc.component._listRoomRenovations(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openRoomRenovationFee: function (_room) {
                vc.jumpToPage('/admin.html#/pages/property/listRoomFee?roomId=' + _room.roomId);
            },
            _moreCondition: function () {
                if (vc.component.roomRenovationManageInfo.moreCondition) {
                    vc.component.roomRenovationManageInfo.moreCondition = false;
                } else {
                    vc.component.roomRenovationManageInfo.moreCondition = true;
                }
            },
            _getStateName:function(_state){
                if(_state == '1000'){
                    return '待装修';
                }else if(_state == '2000'){
                    return '待验收';
                }else if(_state == '3000'){
                    return '验收成功';
                }else if(_state == '4000'){
                    return '验收失败';
                }

                return "";

            },
            _openDecorationAcceptanceModel:function(_room){
                vc.emit('roomDecorationAcceptance', 'openRoomDecorationAcceptanceModal',_room);
            },
            _openRoomRenovationDetail:function(_room){
                vc.jumpToPage('/admin.html#/pages/property/roomRenovationDetailManage?rId='+_room.rId+'&roomName='+_room.roomName);
            }
        }
    });
})(window.vc);
