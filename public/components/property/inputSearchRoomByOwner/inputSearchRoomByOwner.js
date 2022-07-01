(function (vc, vm) {
    vc.extends({
        data: {
            inputSearchRoomByOwnerInfo: {
                rooms: [],
                callComponent: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('inputSearchRoomByOwner', 'searchRoom', function (_param) {
                if (!_param.ownerName) {
                    return;
                }
                $that._loadRoomByOwnerInfo(_param.ownerName);
                $that.inputSearchRoomByOwnerInfo.callComponent = _param.callComponent;
            });
        },
        methods: {
            _loadRoomByOwnerInfo: function (_ownerName) {
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        ownerNameLike: _ownerName,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        $that.inputSearchRoomByOwnerInfo.rooms = listRoomData.rooms;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _inputSearchRoomChooseRoomByOwner: function (_room) {
                vc.emit($that.inputSearchRoomByOwnerInfo.callComponent, "notifyRoomByOwner", _room);
                $that.inputSearchRoomByOwnerInfo.rooms = [];
            }
        }
    });
})(window.vc, window.vc.component);