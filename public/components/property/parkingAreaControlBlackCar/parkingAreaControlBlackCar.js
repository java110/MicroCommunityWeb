/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlBlackCar: {
                cars: [],
                paId: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('parkingAreaControlBlackCar', 'switch', function (_data) {
                $that.parkingAreaControlBlackCar.paId = _data.paId;
                $that._loadParkingAreaControlBlackCars(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlBlackCar', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadParkingAreaControlBlackCars(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {

            _loadParkingAreaControlBlackCars: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        paId: $that.parkingAreaControlBlackCar.paId,
                        blackWhite: '1111'
                    }
                };
                //发送get请求
                vc.http.get('carBlackWhiteManage',
                    'list',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        $that.parkingAreaControlBlackCar.total = _json.total;
                        $that.parkingAreaControlBlackCar.records = _json.records;
                        $that.parkingAreaControlBlackCar.cars = _json.carBlackWhites;
                        vc.emit('parkingAreaControlBlackCar', 'pagination', 'init', {
                            total: $that.parkingAreaControlBlackCar.records,
                            dataCount: $that.parkingAreaControlBlackCar.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }

        }
    });
})(window.vc);