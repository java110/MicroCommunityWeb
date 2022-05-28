(function(vc, vm) {

    vc.extends({
        data: {
            inputSearchRoomInfo: {
                rooms: [],
                callComponent: ''
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('inputSearchRoomInfo', 'searchRoom', function(_param) {
                if (!_param.roomName) {
                    return;
                }
                $that._loadRoomInfo(_param.roomName);
                $that.inputSearchRoomInfo.callComponent = _param.callComponent;
            });
        },
        methods: {
            _loadRoomInfo: function(_roomName) {
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        roomNumLike: _roomName,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function(json, res) {
                        let listRoomData = JSON.parse(json);
                        $that.inputSearchRoomInfo.rooms = listRoomData.rooms;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _inputSearchRoomChooseRoom: function(_room) {
                vc.emit($that.inputSearchRoomInfo.callComponent, "notifyRoom", _room);
                $that.inputSearchRoomInfo.rooms = [];
            }

        }
    });

})(window.vc, window.vc.component);