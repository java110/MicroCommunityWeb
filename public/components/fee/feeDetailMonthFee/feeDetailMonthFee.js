/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailMonthFeeInfo: {
                monthFees: [],
                feeId: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('feeDetailMonthFee', 'switch', function(_data) {
                $that.feeDetailMonthFeeInfo.feeId = _data.feeId;
                $that._loadFeeDetailMonthFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailMonthFee', 'notify',
                function(_data) {
                    $that._loadFeeDetailMonthFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('feeDetailMonthFee', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._loadFeeDetailMonthFeeData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadFeeDetailMonthFeeData: function(_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: vc.component.feeDetailMonthFeeInfo.feeId,
                        detailId: '-1',
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/fee.listMonthFee',
                    param,
                    function(json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.feeDetailMonthFeeInfo.monthFees = _roomInfo.data;
                        vc.emit('feeDetailMonthFee', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyFeeDetailMonthFee: function() {
                $that._loadFeeDetailMonthFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toRefundFee: function(_detail) {
                vc.jumpToPage('/#/pages/property/propertyFee?feeId=' + _detail.feeId);
            }
        }
    });
})(window.vc);