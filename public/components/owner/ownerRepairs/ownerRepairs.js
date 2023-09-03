(function (vc) {
    vc.extends({
        data: {
            ownerRepairsInfo: {
                repairs: [],
                ownerId:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerRepairs', 'openOwnerRepairModel', function (_param) {
                $('#ownerRepairsModel').modal('show');
                $that.ownerRepairsInfo.ownerId = _param.ownerId;
                vc.component._loadOwnerRepairInfo(1, 10);
            });
            vc.on('ownerRepairs', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadOwnerRepairInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadOwnerRepairInfo: function (_page, _row) {
                let param = {
                    params: {
                        page:_page,
                        row:_row,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId:$that.ownerRepairsInfo.ownerId 
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/ownerRepair.listOwnerRepairs',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.ownerRepairsInfo.repairs = _roomInfo.data;
                        vc.emit('ownerRepairs', 'paginationPlus', 'init', {
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
                $('#ownerRepairsModel').modal('hide');
            },
            //查询
            ownerRepairss: function () {
                vc.component._loadAllRoomInfo(1, 15);
            },
            //重置
    
        }
    });
})(window.vc);