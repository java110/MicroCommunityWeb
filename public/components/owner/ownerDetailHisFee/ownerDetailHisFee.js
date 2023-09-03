/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailHisFeeInfo: {
                total: 0,
                records: 1,
                feeDetails: [],
                ownerId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('ownerDetailHisFee', 'switch', function (_param) {
                $that.clearOwnerDetailHisFeeInfo();
                if (_param.ownerId == '') {
                    return;
                }
                vc.copyObject(_param, $that.ownerDetailHisFeeInfo)
                $that._listOwnerDetailFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('ownerDetailHisFee', 'notify', function () {
                $that._listOwnerDetailFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailHisFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listOwnerDetailFeeDetails(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listOwnerDetailFeeDetails: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.ownerDetailHisFeeInfo.ownerId,
                    }
                };

                //发送get请求
                vc.http.apiGet('/fee.queryFeeDetail',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.ownerDetailHisFeeInfo.total = _feeConfigInfo.total;
                        vc.component.ownerDetailHisFeeInfo.records = _feeConfigInfo.records;
                        vc.component.ownerDetailHisFeeInfo.feeDetails = _feeConfigInfo.feeDetails;
                        vc.emit('ownerDetailHisFee', 'paginationPlus', 'init', {
                            total: vc.component.ownerDetailHisFeeInfo.records,
                            dataCount: vc.component.ownerDetailHisFeeInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },

            clearOwnerDetailHisFeeInfo: function () {
                $that.ownerDetailHisFeeInfo = {
                    total: 0,
                    records: 1,
                    feeDetails: [],
                    ownerId: ''
                }
            },
            _toRefundFee: function (_detail) {
                vc.jumpToPage('/#/pages/property/propertyFee?feeId=' + _detail.feeId);
            }
        }
    });
})(window.vc);