(function (vc) {

    vc.extends({
        data: {
            roomBindOwnerInfo: {
                roomId: '',
                roomName: '',
                ownerId: '',
                ownerName: '',
                state:'2001',
                stateTime: vc.dateFormat(new Date().getTime()),
                endTime: '2050-01-01',
            }
        },
        _initMethod: function () {
            $that.roomBindOwnerInfo.roomId = vc.getParam('roomId');
            $that.listRoom(vc.getParam('roomId'));
            $that.roomBindOwnerInfo.startTime = vc.dateFormat(new Date().getTime());
            vc.initDate('addStartTime', function (_value) {
                $that.roomBindOwnerInfo.startTime = _value;
            });
            vc.initDate('addEndTime', function (_value) {
                $that.roomBindOwnerInfo.endTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('roomBindOwner', 'chooseOwner', function (_owner) {
                $that.roomBindOwnerInfo.ownerName = _owner.name;
                $that.roomBindOwnerInfo.ownerId = _owner.ownerId;
            });
        },
        methods: {
            roomBindOwnerValidate() {
                return vc.validate.validate({
                    roomBindOwnerInfo: vc.component.roomBindOwnerInfo
                }, {
                    'roomBindOwnerInfo.ownerId': [{
                        limit: "required",
                        param: "",
                        errInfo: "业主不能为空"
                    }
                    ],
                    'roomBindOwnerInfo.roomId': [{
                        limit: "required",
                        param: "",
                        errInfo: "房屋不能为空"
                    }],
                    'roomBindOwnerInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "开始时间不能为空"
                    }],
                    'roomBindOwnerInfo.endTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "结束时间不能为空"
                    }],
                });
            },
            saveRoomBindOwnerInfo: function () {
                if (!vc.component.roomBindOwnerValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.roomBindOwnerInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/room.sellRoom',
                    JSON.stringify(vc.component.roomBindOwnerInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('提交成功');
                            $that._goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddHandoverInfo: function () {
                vc.component.roomBindOwnerInfo = {
                    roomId: '',
                    roomName: '',
                    ownerId: '',
                    ownerName: '',
                    state:'2001',
                    stateTime: vc.dateFormat(new Date().getTime()),
                    endTime: '2050-01-01',
                };
            },
            _goBack: function () {
                vc.goBack();
            },
            _openChooseOwner: function () {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            listRoom: function (_roomId) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        roomId: _roomId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        let _room = listRoomData.rooms[0];
                        
                        $that.roomBindOwnerInfo.roomId = _room.roomId;
                        $that.roomBindOwnerInfo.roomName = _room.floorNum+'-'+_room.unitNum+'-'+_room.roomNum;

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
           
        }
    });

})(window.vc);