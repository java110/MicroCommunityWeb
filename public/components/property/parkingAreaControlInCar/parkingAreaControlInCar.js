/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlInCarInfo: {
                carIns: [],
                paId: '',
                state: '',
                carNum: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('parkingAreaControlInCar', 'switch', function (_data) {
                $that.parkingAreaControlInCarInfo.paId = _data.paId;
                $that._loadParkingAreaControlInCarData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlInCar', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadParkingAreaControlInCarData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadParkingAreaControlInCarData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        paId: $that.parkingAreaControlInCarInfo.paId,
                        carNum: $that.parkingAreaControlInCarInfo.carNum,
                        state: $that.parkingAreaControlInCarInfo.carNum
                    }
                };
                //发送get请求
                vc.http.apiGet('/carInout.listCarInParkingAreaCmd',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.parkingAreaControlInCarInfo.total = _feeConfigInfo.total;
                        vc.component.parkingAreaControlInCarInfo.records = _feeConfigInfo.records;
                        vc.component.parkingAreaControlInCarInfo.carIns = _feeConfigInfo.data;
                        vc.emit('parkingAreaControlInCar', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _qureyParkingAreaControlInCar:function(){
                $that._loadParkingAreaControlInCarData(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);