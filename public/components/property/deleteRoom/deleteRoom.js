(function(vc) {
    vc.extends({
        data: {
            deleteRoomInfo: {}
        },
        _initEvent: function() {
            vc.on('deleteRoom', 'openRoomModel', function(_roomInfo) {
                vc.component.deleteRoomInfo = _roomInfo;
                $('#deleteRoomModel').modal('show');
            });
        },
        methods: {
            closeDeleteRoomModel: function() {
                $('#deleteRoomModel').modal('hide');
            },
            deleteRoom: function() {

                vc.component.deleteRoomInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/room.deleteRoom',
                    JSON.stringify(vc.component.deleteRoomInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _tmpResJson = JSON.parse(json);
                        if (_tmpResJson.code == 0) {
                            //关闭model
                            $('#deleteRoomModel').modal('hide');
                            vc.emit('room', 'loadData', {
                                floorId: vc.component.deleteRoomInfo.floorId
                            });
                            vc.emit('shops', 'loadData', {
                                floorId: vc.component.deleteRoomInfo.floorId
                            });
                            return;
                        }
                        vc.toast(_tmpResJson.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);