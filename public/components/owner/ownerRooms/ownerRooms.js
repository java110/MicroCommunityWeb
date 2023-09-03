(function (vc) {
    vc.extends({
        data: {
            ownerRoomsInfo: {
                rooms: [],
                ownerId:'',
                allOweFeeAmount:0,
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerRooms', 'openOwnerRoomModel', function (_param) {
                $('#ownerRoomsModel').modal('show');
                $that.ownerRoomsInfo.ownerId = _param.ownerId;
                vc.component._loadOwnerRoomInfo(1, 10);
            });
            vc.on('ownerRooms', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadOwnerRoomInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadOwnerRoomInfo: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId:$that.ownerRoomsInfo.ownerId 
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.ownerRoomsInfo.rooms = _roomInfo.rooms;
                        $that._computeOwnerRoomOweFeeAmount();
                        vc.emit('ownerRooms', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _computeOwnerRoomOweFeeAmount(){
                let _rooms = $that.ownerRoomsInfo.rooms;
                let _totalOweFeeAmount = 0;
                $that.ownerRoomsInfo.allOweFeeAmount = 0;
                if(!_rooms ||_rooms.length <1){
                    return ;
                }

                _rooms.forEach(_room => {
                    if(_room.roomOweFee){
                        _totalOweFeeAmount += parseFloat(_room.roomOweFee);
                    }
                });

                $that.ownerRoomsInfo.allOweFeeAmount = _totalOweFeeAmount.toFixed(2);
            },
            //查询
            ownerRoomss: function () {
                vc.component._loadAllRoomInfo(1, 15);
            },
            //重置
    
        }
    });
})(window.vc);