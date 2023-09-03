/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailHisFeeInfo: {
                feeDetails: [],
                feeId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('feeDetailHisFee', 'switch', function (_data) {
                $that.feeDetailHisFeeInfo.feeId = _data.feeId;
                $that._loadFeeDetailHisFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailHisFee', 'notify',
                function (_data) {
                    $that._loadFeeDetailHisFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('feeDetailHisFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadFeeDetailHisFeeData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadFeeDetailHisFeeData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: vc.component.feeDetailHisFeeInfo.feeId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('//fee.queryFeeDetail',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.feeDetailHisFeeInfo.feeDetails = _roomInfo.feeDetails;
                        vc.emit('feeDetailHisFee', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyFeeDetailHisFee: function () {
                $that._loadFeeDetailHisFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toRefundFee: function (_detail) {
                vc.jumpToPage('/#/pages/property/propertyFee?feeId=' + _detail.feeId);
            }
        }
    });
})(window.vc);