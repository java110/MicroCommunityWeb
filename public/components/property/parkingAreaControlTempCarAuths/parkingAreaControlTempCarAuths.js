/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlTempCarAuthsInfo: {
                cars: [],
                paId: '',
                carNum: '',
                state: '',
                startTime: '',
                endTime: ''
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('parkingAreaControlTempCarAuths', 'switch', function(_data) {
                setTimeout(function() {
                    $that._initTempCarAuthData();
                }, 1000)
                $that.parkingAreaControlTempCarAuthsInfo.paId = _data.paId;
                $that._loadParkingAreaControlTempCarAuthss(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlTempCarAuths', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._loadParkingAreaControlTempCarAuthss(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {

            _initTempCarAuthData: function() {
                vc.initDate('tempAuthStartTime', function(_value) {
                    $that.parkingAreaControlTempCarAuthsInfo.startTime = _value;
                });
                vc.initDate('tempAuthEndTime', function(_value) {
                    $that.parkingAreaControlTempCarAuthsInfo.endTime = _value;
                });
            },

            _loadParkingAreaControlTempCarAuthss: function(_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        paId: $that.parkingAreaControlTempCarAuthsInfo.paId,
                        state: $that.parkingAreaControlTempCarAuthsInfo.state,
                        carNum: $that.parkingAreaControlTempCarAuthsInfo.carNum,
                        startTime: $that.parkingAreaControlTempCarAuthsInfo.startTime,
                        endTime: $that.parkingAreaControlTempCarAuthsInfo.endTime,
                    }
                };
                //发送get请求
                vc.http.apiGet('/machine.getTempCarAuths',
                    param,
                    function(json, res) {
                        var _json = JSON.parse(json);
                        $that.parkingAreaControlTempCarAuthsInfo.total = _json.total;
                        $that.parkingAreaControlTempCarAuthsInfo.records = _json.records;
                        $that.parkingAreaControlTempCarAuthsInfo.cars = _json.data;
                        vc.emit('parkingAreaControlTempCarAuths', 'paginationPlus', 'init', {
                            total: $that.parkingAreaControlTempCarAuthsInfo.records,
                            dataCount: $that.parkingAreaControlTempCarAuthsInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _qureyParkingAreaControlTempCarAuths: function() {
                $that._loadParkingAreaControlTempCarAuthss(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _doOpenTempCarAuth: function(_car) {
                vc.emit('parkingAreaControlTempCarAuthConfirm', 'open', _car);
            },
            _tempCarAuthOpenFile: function(_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            }

        }
    });
})(window.vc);