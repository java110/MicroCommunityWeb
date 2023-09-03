/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceDetailPurchaseInfo: {
                purchaseApplyDetails: [],
                resId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('resourceDetailPurchase', 'switch', function (_data) {
                $that.resourceDetailPurchaseInfo.resId = _data.resId;
                $that._loadResourceDetailPurchaseData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('resourceDetailPurchase', 'notify',
                function (_data) {
                    $that._loadResourceDetailPurchaseData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('resourceDetailPurchase', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadResourceDetailPurchaseData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadResourceDetailPurchaseData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        resId: $that.resourceDetailPurchaseInfo.resId,
                        resOrderType: 10000,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/purchaseApplyDetail.listPurchaseApplyDetails',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.resourceDetailPurchaseInfo.purchaseApplyDetails = _json.purchaseApplyDetails;
                        vc.emit('resourceDetailPurchase', 'paginationPlus', 'init', {
                            total: _json.records,
                            dataCount: _json.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyResourceDetailPurchase: function () {
                $that._loadResourceDetailPurchaseData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);