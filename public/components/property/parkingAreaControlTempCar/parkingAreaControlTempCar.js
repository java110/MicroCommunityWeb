/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlTempCar: {
                cars: [],
                paId: '',
                carNum:''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('parkingAreaControlTempCar', 'switch', function (_data) {
                $that.parkingAreaControlTempCar.paId = _data.paId;
                $that._loadParkingAreaControlTempCars(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlTempCar', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadParkingAreaControlTempCars(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {

            _loadParkingAreaControlTempCars: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        paId: $that.parkingAreaControlTempCar.paId,
                        carTypeCd:'1003',
                        carNum:$that.parkingAreaControlTempCar.carNum,
                    }
                };
                //发送get请求
                vc.http.apiGet('owner.queryOwnerCars',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        $that.parkingAreaControlTempCar.total = _json.total;
                        $that.parkingAreaControlTempCar.records = _json.records;
                        $that.parkingAreaControlTempCar.cars = _json.data;
                        vc.emit('parkingAreaControlTempCar', 'pagination', 'init', {
                            total: $that.parkingAreaControlTempCar.records,
                            dataCount: $that.parkingAreaControlTempCar.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _qureyParkingAreaControlTempCar: function () {
                $that._loadParkingAreaControlTempCars(DEFAULT_PAGE, DEFAULT_ROWS);
            }

        }
    });
})(window.vc);