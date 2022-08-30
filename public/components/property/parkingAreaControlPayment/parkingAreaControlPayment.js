/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlPaymentInfo: {
                payments: [],
                boxId: '',
                state: '',
                carNum: '',
                startTime: '',
                endTime: '',
            }
        },
        _initMethod: function() {
            vc.initDate('paymentStartTime', function(_value) {
                $that.parkingAreaControlPaymentInfo.startTime = _value;
            });
            vc.initDate('paymentEndTime', function(_value) {
                $that.parkingAreaControlPaymentInfo.endTime = _value;
            })
        },
        _initEvent: function() {
            vc.on('parkingAreaControlPayment', 'switch', function(_data) {
                $that.parkingAreaControlPaymentInfo.boxId = _data.boxId;
                $that._loadParkingAreaControlPayments(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlPayment', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._loadParkingAreaControlPayments(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {

            _loadParkingAreaControlPayments: function(_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.parkingAreaControlPaymentInfo.boxId,
                        state: $that.parkingAreaControlPaymentInfo.state,
                        carNum: $that.parkingAreaControlPaymentInfo.carNum,
                        startTime: $that.parkingAreaControlPaymentInfo.startTime,
                        endTime: $that.parkingAreaControlPaymentInfo.startTime
                    }
                };
                //发送get请求
                vc.http.apiGet('/carInoutPayment.listCarInoutPayment',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.parkingAreaControlPaymentInfo.total = _feeConfigInfo.total;
                        vc.component.parkingAreaControlPaymentInfo.records = _feeConfigInfo.records;
                        vc.component.parkingAreaControlPaymentInfo.payments = _feeConfigInfo.data;
                        vc.emit('parkingAreaControlPayment', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _qureyParkingAreaControlPayment: function() {
                $that._loadParkingAreaControlPayments(DEFAULT_PAGE, DEFAULT_ROWS);
            }

        }
    });
})(window.vc);