/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlPaymentInfo: {
                payments: [],
                paId: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('parkingAreaControlPayment', 'switch', function (_data) {
                $that.parkingAreaControlPaymentInfo.paId = _data.paId;
                $that._loadParkingAreaControlPayments(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlPayment', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadParkingAreaControlPayments(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {

            _loadParkingAreaControlPayments: function (_page,_row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        paId: $that.parkingAreaControlPaymentInfo.paId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/carInoutPayment.listCarInoutPayment',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.parkingAreaControlPaymentInfo.total = _feeConfigInfo.total;
                        vc.component.parkingAreaControlPaymentInfo.records = _feeConfigInfo.records;
                        vc.component.parkingAreaControlPaymentInfo.payments = _feeConfigInfo.data;
                        vc.emit('parkingAreaControlPayment', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            }

        }
    });
})(window.vc);