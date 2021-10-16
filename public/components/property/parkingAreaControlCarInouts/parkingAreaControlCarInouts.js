/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlCarInoutsInfo: {
                carIns: [],
                paId: '',
                state: '',
                carNum: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('parkingAreaControlCarInouts', 'switch', function (_data) {
                $that.parkingAreaControlCarInoutsInfo.paId = _data.paId;
                $that._loadParkingAreaControlCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlCarInouts', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadParkingAreaControlCarInouts(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {

            _loadParkingAreaControlCarInouts: function (_page,_row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        paId: $that.parkingAreaControlCarInoutsInfo.paId,
                        state: $that.parkingAreaControlCarInoutsInfo.state,
                        carNum: $that.parkingAreaControlCarInoutsInfo.carNum
                    }
                };
                //发送get请求
                vc.http.apiGet('/carInoutDetail.listCarInoutDetail',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.parkingAreaControlCarInoutsInfo.total = _feeConfigInfo.total;
                        vc.component.parkingAreaControlCarInoutsInfo.records = _feeConfigInfo.records;
                        vc.component.parkingAreaControlCarInoutsInfo.carIns = _feeConfigInfo.data;
                        vc.emit('parkingAreaControlCarInouts', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _qureyParkingAreaControlCarInouts:function(){
                $that._loadParkingAreaControlCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            }

        }
    });
})(window.vc);