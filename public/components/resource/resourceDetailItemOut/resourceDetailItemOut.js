/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceDetailItemOutInfo: {
                purchaseApplyDetails: [],
                resId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('resourceDetailItemOut', 'switch', function (_data) {
                $that.resourceDetailItemOutInfo.resId = _data.resId;
                $that._loadResourceDetailItemOutData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('resourceDetailItemOut', 'notify',
                function (_data) {
                    $that._loadResourceDetailItemOutData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('resourceDetailItemOut', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadResourceDetailItemOutData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadResourceDetailItemOutData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        resId: $that.resourceDetailItemOutInfo.resId,
                        resOrderType: 20000,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/purchaseApplyDetail.listPurchaseApplyDetails',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.resourceDetailItemOutInfo.purchaseApplyDetails = _json.purchaseApplyDetails;
                        vc.emit('resourceDetailItemOut', 'paginationPlus', 'init', {
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
            _qureyResourceDetailItemOut: function () {
                $that._loadResourceDetailItemOutData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);