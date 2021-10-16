/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlRemaining: {
                total: 0,
                freeCount: 0,
                createTime: '',
                paId: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('parkingAreaControlRemaining', 'switch', function (_data) {
                $that.parkingAreaControlRemaining.paId = _data.paId;
                $that._loadParkingAreaControlRemaining(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlRemaining', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadParkingAreaControlRemaining(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {

            _loadParkingAreaControlRemaining: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        paId: $that.parkingAreaControlRemaining.paId,
                    }
                };
                //发送get请求
                vc.http.get('remainingParkingSpace',
                    'list',
                    param,
                    function (json, res) {
                        var listParkingSpaceData = JSON.parse(json).data;

                        vc.component.parkingAreaControlRemaining.total = listParkingSpaceData.total;
                        vc.component.parkingAreaControlRemaining.freeCount = listParkingSpaceData.freeCount;
                        vc.component.parkingAreaControlRemaining.createTime = vc.dateTimeFormat(new Date().getTime());
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getCarState: function (car) {
                let _carEndTime = new Date(car.endTime);
                if (_carEndTime.getTime() > new Date().getTime()) {
                    return "正常";
                }
                return "到期";
            }

        }
    });
})(window.vc);