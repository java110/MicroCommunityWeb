(function(vc) {

    vc.extends({
        data: {
            viewRoomDataInfo: {
                roomId: '',
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('viewRoomData', 'showData', function(_param) {
                $that.viewRoomDataInfo.roomId = _param.roomId;
                $that._loadViewRoomData();
            });
        },
        methods: {
            _loadViewRoomData: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        roomId: $that.viewRoomDataInfo.roomId
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRooms', param,
                    function(json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        let _room = _feeConfigManageInfo.rooms[0];

                        let _data = {
                            "房屋": _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum,
                            "楼层": _room.layer,
                            "业主": _room.ownerName,
                            "电话": _room.link,
                            "类型": _room.roomSubTypeName,
                            "建筑面积": _room.builtUpArea,
                            "室内面积": _room.roomArea,
                            "租金": _room.roomRent,
                            "房屋状态": _room.stateName,
                            "入住时间": _room.startTime,
                        };

                        if (_room.roomAttrDto) {
                            _room.roomAttrDto.forEach(attr => {
                                _data[attr.specName] = attr.valueName;
                            })
                        }
                        vc.emit('viewData', 'openViewDataModal', {
                            title: _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum + " 详情",
                            data: _data
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);