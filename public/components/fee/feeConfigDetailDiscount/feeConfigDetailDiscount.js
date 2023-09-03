/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeConfigDetailDiscountInfo: {
                discounts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                configDiscountId: '',
                configId: '',
                feeName: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('feeConfigDetailDiscount', 'switch', function (_data) {
                $that.feeConfigDetailDiscountInfo.configId = _data.configId;
                $that._listPayFeeConfigDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeConfigDetailDiscount', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._listPayFeeConfigDiscounts(_currentPage, DEFAULT_ROWS);
                });
            vc.on('feeConfigDetailDiscount', 'listPayFeeConfigDiscount', function (_param) {
                $that._listPayFeeConfigDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listPayFeeConfigDiscounts: function (_page, _rows) {
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        configId: $that.feeConfigDetailDiscountInfo.configId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/payFeeConfigDiscount/queryPayFeeConfigDiscount',
                    param,
                    function (json, res) {
                        let _feeConfigDetailDiscountInfo = JSON.parse(json);
                        $that.feeConfigDetailDiscountInfo.total = _feeConfigDetailDiscountInfo.total;
                        $that.feeConfigDetailDiscountInfo.records = _feeConfigDetailDiscountInfo.records;
                        $that.feeConfigDetailDiscountInfo.discounts = _feeConfigDetailDiscountInfo.data;
                        vc.emit('feeConfigDetailDiscount','paginationPlus', 'init', {
                            total: $that.feeConfigDetailDiscountInfo.records,
                            dataCount: $that.feeConfigDetailDiscountInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
           
            _queryPayFeeConfigDiscountMethod: function () {
                $that._listPayFeeConfigDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            
        }
    });
})(window.vc);
