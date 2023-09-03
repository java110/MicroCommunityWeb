/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlOwnerCar: {
                cars: [],
                boxId: '',
                carNum: '',
                leaseType: '',
                leaseTypes: []
            }
        },
        _initMethod: function() {
            vc.getDict('owner_car', "lease_type", function(_data) {
                $that.parkingAreaControlOwnerCar.leaseTypes = _data;

            });
        },
        _initEvent: function() {
            vc.on('parkingAreaControlOwnerCar', 'switch', function(_data) {
                $that.parkingAreaControlOwnerCar.boxId = _data.boxId;
                $that._loadParkingAreaControlOwnerCars(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlOwnerCar', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._loadParkingAreaControlOwnerCars(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {

            _loadParkingAreaControlOwnerCars: function(_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.parkingAreaControlOwnerCar.boxId,
                        carTypeCds: '1001,1002',
                        carNum: $that.parkingAreaControlOwnerCar.carNum,
                        leaseType: $that.parkingAreaControlOwnerCar.leaseType
                    }
                };
                //发送get请求
                vc.http.apiGet('owner.queryOwnerCars',
                    param,
                    function(json, res) {
                        var _json = JSON.parse(json);
                        $that.parkingAreaControlOwnerCar.total = _json.total;
                        $that.parkingAreaControlOwnerCar.records = _json.records;
                        $that.parkingAreaControlOwnerCar.cars = _json.data;
                        vc.emit('parkingAreaControlOwnerCar', 'paginationPlus', 'init', {
                            total: $that.parkingAreaControlOwnerCar.records,
                            dataCount: $that.parkingAreaControlOwnerCar.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getCarState: function(car) {
                let _carEndTime = new Date(car.endTime);
                if (_carEndTime.getTime() > new Date().getTime()) {
                    return "正常";
                }
                return "到期";
            },
            _qureyParkingAreaControlOwnerCar: function() {
                $that._loadParkingAreaControlOwnerCars(DEFAULT_PAGE, DEFAULT_ROWS);
            }

        }
    });
})(window.vc);