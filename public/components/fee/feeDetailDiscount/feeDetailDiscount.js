/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailDiscountInfo: {
                applyRoomDiscounts: [],
                feeId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('feeDetailDiscount', 'switch', function (_data) {
                $that.feeDetailDiscountInfo.feeId = _data.feeId;
                $that._loadFeeDetailDiscountData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailDiscount', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadFeeDetailDiscountData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadFeeDetailDiscountData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: $that.feeDetailDiscountInfo.feeId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/applyRoomDiscount/queryApplyRoomDiscount',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.feeDetailDiscountInfo.applyRoomDiscounts = _roomInfo.data;
                        vc.emit('feeDetailDiscount', 'paginationPlus', 'init', {
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
            _qureyFeeDetailDiscount: function () {
                $that._loadFeeDetailDiscountData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);