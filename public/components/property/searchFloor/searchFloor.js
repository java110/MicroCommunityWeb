(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        propTypes: {
            emitChooseFloor: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            searchFloorInfo: {
                floors: [],
                floorId: '',
                floorName: '',
                floorNum: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('searchFloor', 'openSearchFloorModel', function (_param) {
                $('#searchFloorModel').modal('show');
                vc.component._refreshSearchFloorData();
                vc.component._loadAllFloorInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('searchFloor', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._loadAllFloorInfo(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadAllFloorInfo: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId,
                        floorId: vc.component.searchFloorInfo.floorId,
                        floorName: vc.component.searchFloorInfo.floorName,
                        floorNum: vc.component.searchFloorInfo.floorNum
                    }
                };
                //发送get请求
                vc.http.apiGet('/floor.queryFloors',
                    param,
                    function (json) {
                        var _floorInfo = JSON.parse(json);
                        vc.component.searchFloorInfo.floors = _floorInfo.apiFloorDataVoList;
                        vc.emit('searchFloor', 'paginationPlus', 'init', {
                            total: _floorInfo.records,
                            dataCount: _floorInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseFloor: function (_floor) {
                vc.emit($props.emitChooseFloor, 'chooseFloor', _floor);
                vc.emit($props.emitLoadData, 'loadData', {
                    floorId: _floor.floorId
                });
                $('#searchFloorModel').modal('hide');
            },
            //查询
            searchFloors: function () {
                vc.component._loadAllFloorInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            resetFloors: function () {
                vc.component.searchFloorInfo.floorId = '';
                vc.component.searchFloorInfo.floorName = '';
                vc.component.searchFloorInfo.floorNum = '';
                vc.component._loadAllFloorInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _refreshSearchFloorData: function () {
                vc.component.searchFloorInfo.floorId = '';
                vc.component.searchFloorInfo.floorName = '';
                vc.component.searchFloorInfo.floorNum = '';
            }
        }
    });
})(window.vc);