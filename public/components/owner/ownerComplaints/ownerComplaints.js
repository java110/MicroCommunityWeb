(function (vc) {
    vc.extends({
        data: {
            ownerComplaintsInfo: {
                complaints: [],
                ownerId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerComplaints', 'openOwnerComplaintModel', function (_param) {
                $('#ownerComplaintsModel').modal('show');
                $that.ownerComplaintsInfo.ownerId = _param.ownerId;
                vc.component._loadOwnerComplaintInfo(1, 10);
            });
            vc.on('ownerComplaints', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadOwnerComplaintInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadOwnerComplaintInfo: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.ownerComplaintsInfo.ownerId
                    }
                };
                //发送get请求
                vc.http.apiGet('/complaint.listComplaints',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.ownerComplaintsInfo.complaints = _roomInfo.complaints;
                        vc.emit('ownerComplaints', 'paginationPlus', 'init', {
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
            chooseRoom: function (_room) {
                vc.emit($props.emitChooseRoom, 'chooseRoom', _room);
                vc.emit($props.emitLoadData, 'listRoomData', {
                    roomId: _room.roomId
                });
                $('#ownerComplaintsModel').modal('hide');
            },
            //查询
            ownerComplaintss: function () {
                vc.component._loadAllRoomInfo(1, 15);
            }
        }
    });
})(window.vc);