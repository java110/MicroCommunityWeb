(function (vc) {
    vc.extends({
        data: {
            ownerCarsInfo: {
                cars: [],
                ownerId:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerCars', 'openOwnerCarModel', function (_param) {
                $('#ownerCarsModel').modal('show');
                $that.ownerCarsInfo.ownerId = _param.ownerId;
                vc.component._loadOwnerCarInfo(1, 10);
            });
            vc.on('ownerCars', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadOwnerCarInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadOwnerCarInfo: function (_page, _row) {
                let param = {
                    params: {
                        page:_page,
                        row:_row,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId:$that.ownerCarsInfo.ownerId 
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/owner.queryOwnerCars',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.ownerCarsInfo.cars = _roomInfo.data;
                        vc.emit('ownerCars', 'paginationPlus', 'init', {
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
                $('#ownerCarsModel').modal('hide');
            },
            //查询
            ownerCarss: function () {
                vc.component._loadAllRoomInfo(1, 15);
            },
            //重置
    
        }
    });
})(window.vc);