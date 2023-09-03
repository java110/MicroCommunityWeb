(function (vc) {

    vc.extends({
        data: {
            editOwnerSettledApplyInfo: {
                applyId: '',
                ownerId: '',
                ownerName: '',
                remark: '',
                rooms: [],
            }
        },
        _initMethod: function () {
            $that._listOwnerSettledApplys();
            $that._loadItemReleaseRes();

        },
        _initEvent: function () {
            vc.on('editOwnerSettledApply', 'openAddOwnerSettledApplyModal', function () {
                $('#editOwnerSettledApplyModel').modal('show');
            });
            vc.on('editOwnerSettledApply', 'selectRoom', function (param) {
                $that.listRoom(param.roomId);
            });
            vc.on('editOwnerSettledApply', 'chooseOwner', function (param) {
                $that.editOwnerSettledApplyInfo.ownerName = param.name + "(" + param.link + ")";
                vc.copyObject(param, $that.editOwnerSettledApplyInfo);
            })
        },
        methods: {
            _selectOwner: function () {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            _selectRoom: function () {
                vc.emit('roomTree', 'openRoomTree', {
                    callName: 'editOwnerSettledApply'
                })
            },
            _openDelRoomModel: function (_room) {
                let _tmpRooms = [];
                $that.editOwnerSettledApplyInfo.rooms.forEach(item => {
                    if (item.roomId != _room.roomId) {
                        _tmpRooms.push(item);
                    }
                });
                $that.editOwnerSettledApplyInfo.rooms = _tmpRooms;
            },
            listRoom: function (_roomId) {
                let param = {
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
                        let room = listRoomData.rooms[0];
                        if (room.state != '2002') {
                            vc.toast('房屋不是未销售状态');
                            return;
                        }
                        room.startTime = '';
                        room.endTime = '';
                        $that.editOwnerSettledApplyInfo.rooms.push(room);
                        setTimeout(function () {
                            vc.initDate('startTime_' + room.roomId, function (_value) {
                                room.startTime = _value
                            });
                            vc.initDate('endTime_' + room.roomId, function (_value) {
                                room.endTime = _value
                            });
                        }, 1000);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            editOwnerSettledApplyValidate() {
                return vc.validate.validate({
                    editOwnerSettledApplyInfo: vc.component.editOwnerSettledApplyInfo
                }, {
                    'editOwnerSettledApplyInfo.ownerId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业主不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "业主不能超过30"
                        },
                    ],
                    'editOwnerSettledApplyInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "说明'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "说明'不能超过200"
                        },
                    ],

                });
            },
            _editOwnerSettledApply: function () {
                if (!vc.component.editOwnerSettledApplyValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editOwnerSettledApplyInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/ownerSettled.updateOwnerSettledApply',
                    JSON.stringify(vc.component.editOwnerSettledApplyInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },

            _listOwnerSettledApplys: function (_page, _rows) {

                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        applyId: $that.editOwnerSettledApplyInfo.applyId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/ownerSettled.listOwnerSettledApply',
                    param,
                    function (json, res) {
                        let _data = JSON.parse(json);
                        vc.copyObject(_data.data[0], $that.editOwnerSettledApplyInfo)
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadItemReleaseRes: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        applyId: vc.component.editOwnerSettledApplyInfo.applyId,
                    }
                };

                //发送get请求
                vc.http.apiGet('/ownerSettled.listOwnerSettledRooms',
                    param,
                    function (json) {
                        let _unitInfo = JSON.parse(json);
                        vc.component.editOwnerSettledApplyInfo.rooms = _unitInfo.data;
                        setTimeout(function () {
                            _unitInfo.data.forEach(item => {
                                vc.initDate('startTime_' + item.roomId, function (_value) {
                                    item.startTime = _value
                                });
                                vc.initDate('endTime_' + item.roomId, function (_value) {
                                    item.endTime = _value
                                });
                            })
                        }, 1000);
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },


        }
    });

})(window.vc);
