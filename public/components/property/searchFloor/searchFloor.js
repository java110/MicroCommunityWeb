(function(vc) {
    vc.extends({
        propTypes: {
            emitChooseFloor: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            searchFloorInfo: {
                floors: [],
                _currentFloorNum: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('searchFloor', 'openSearchFloorModel', function(_param) {
                console.log("打开定位小区楼界面")
                $('#searchFloorModel').modal('show');
                vc.component._refreshSearchFloorData();
                vc.component._loadAllFloorInfo(1, 10);
            });
            vc.on('searchFloor', 'paginationPlus', 'page_event', function(_currentPage) {
                $that._loadAllFloorInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadAllFloorInfo: function(_page, _rows, _floorNum) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId,
                        floorNum: _floorNum
                    }
                };
                //发送get请求
                vc.http.apiGet('/floor.queryFloors',
                    param,
                    function(json) {
                        var _floorInfo = JSON.parse(json);
                        vc.component.searchFloorInfo.floors = _floorInfo.apiFloorDataVoList;
                        vc.emit('searchFloor', 'paginationPlus', 'init', {
                            total: _floorInfo.records,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseFloor: function(_floor) {
                vc.emit($props.emitChooseFloor, 'chooseFloor', _floor);
                vc.emit($props.emitLoadData, 'loadData', {
                    floorId: _floor.floorId
                });
                $('#searchFloorModel').modal('hide');
            },
            searchFloors: function() {
                vc.component._loadAllFloorInfo(1, 10, vc.component.searchFloorInfo._currentFloorNum);
            },
            _refreshSearchFloorData: function() {
                vc.component.searchFloorInfo._currentFloorNum = "";
            }
        }
    });
})(window.vc);