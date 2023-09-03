(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyOwnerRoomsInfo: {
                rooms: [],
                ownerId: '',
                roomId:'',
                allOweFeeAmount:0,
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyOwnerRooms', 'switch', function (_param) {
                if (!_param.ownerId) {
                    return;
                }
                $that.clearSimplifyOwnerRoomsInfo();
                vc.copyObject(_param, $that.simplifyOwnerRoomsInfo)
                $that._listSimplifyOwnerRooms(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyOwnerRooms', 'listOwnerData', function (_param) {
                $that._listSimplifyOwnerRooms(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event',
                function (_currentPage) {
                    $that._listSimplifyOwnerRooms(_currentPage, DEFAULT_ROWS);
                }
            );
        },
        methods: {
            _listSimplifyOwnerRooms: function (_param) {
                let param = {
                    params: {
                        ownerId: vc.component.simplifyOwnerRoomsInfo.ownerId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json) {
                        let _data = JSON.parse(json);
                        $that.simplifyOwnerRoomsInfo.rooms = _data.rooms;
                        $that._computeOwnerRoomOweFeeAmount();
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _toChooseOwnerRoomModel: function (_room) {
               vc.emit('simplifyAcceptance', 'notifyRoom',_room);
            },
            _computeOwnerRoomOweFeeAmount(){
                let _rooms = $that.simplifyOwnerRoomsInfo.rooms;
                let _totalOweFeeAmount = 0;
                $that.simplifyOwnerRoomsInfo.allOweFeeAmount = 0;
                if(!_rooms ||_rooms.length <1){
                    return ;
                }

                _rooms.forEach(_room => {
                    if(_room.roomOweFee){
                        _totalOweFeeAmount += parseFloat(_room.roomOweFee);
                    }
                });

                $that.simplifyOwnerRoomsInfo.allOweFeeAmount = _totalOweFeeAmount.toFixed(2);
            },
            clearSimplifyOwnerRoomsInfo: function () {
                $that.simplifyOwnerRoomsInfo = {
                    rooms: [],
                    ownerId: '',
                    roomId:'',
                    allOweFeeAmount:0,
                }
            },
            _openSimplifyOwnerRoomsBatchPayFeeModal: function () {
                vc.jumpToPage('/#/pages/property/batchPayFeeOrder?ownerId=' + $that.simplifyRoomFeeInfo.ownerId + "&payerObjType=3333")
            },
           
        }
    });
})(window.vc);