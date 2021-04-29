/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportPrePaymentFeeInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
            }
        },
        _initMethod: function () {
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _queryMethod: function () {
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listFees: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryPrePayment',
                    param,
                    function (json, res) {
                        var _reportPrePaymentFeeInfo = JSON.parse(json);
                        vc.component.reportPrePaymentFeeInfo.total = _reportPrePaymentFeeInfo.total;
                        vc.component.reportPrePaymentFeeInfo.records = _reportPrePaymentFeeInfo.records;
                        vc.component.reportPrePaymentFeeInfo.fees = _reportPrePaymentFeeInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportPrePaymentFeeInfo.records,
                            dataCount: vc.component.reportPrePaymentFeeInfo.total,
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
