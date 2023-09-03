/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlWhiteCar: {
                cars: [],
                boxId: '',
                carNum: ''
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('parkingAreaControlWhiteCar', 'switch', function(_data) {
                $that.parkingAreaControlWhiteCar.boxId = _data.boxId;
                $that._loadParkingAreaControlWhiteCars(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlWhiteCar', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._loadParkingAreaControlWhiteCars(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {

            _loadParkingAreaControlWhiteCars: function(_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.parkingAreaControlWhiteCar.boxId,
                        blackWhite: '2222',
                        carNum: $that.parkingAreaControlWhiteCar.carNum,
                    }
                };
                //发送get请求
                vc.http.apiGet('/carBlackWhite.listCarBlackWhites',
                    param,
                    function(json, res) {
                        var _json = JSON.parse(json);
                        $that.parkingAreaControlWhiteCar.total = _json.total;
                        $that.parkingAreaControlWhiteCar.records = _json.records;
                        $that.parkingAreaControlWhiteCar.cars = _json.carBlackWhites;
                        vc.emit('parkingAreaControlWhiteCar', 'pagination', 'init', {
                            total: $that.parkingAreaControlWhiteCar.records,
                            dataCount: $that.parkingAreaControlWhiteCar.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _qureyParkingAreaControlWhiteCar: function() {
                $that._loadParkingAreaControlWhiteCars(DEFAULT_PAGE, DEFAULT_ROWS);
            }

        }
    });
})(window.vc);