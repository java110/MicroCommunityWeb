/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyHisFeeInfo: {
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
            vc.on('simplifyHisFee', 'switch', function (_param) {
                $that.clearSimplifyHisFeeInfo();
                if (_param.ownerId == '') {
                    return;
                }
                vc.copyObject(_param, $that.simplifyHisFeeInfo)
                $that._listSimplifyFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('simplifyHisFee', 'notify', function () {
                $that._listSimplifyFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyHisFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listSimplifyFeeDetails(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listSimplifyFeeDetails: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.simplifyHisFeeInfo.ownerId,
                    }
                };

                //发送get请求
                vc.http.apiGet('/fee.queryFeeDetail',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.simplifyHisFeeInfo.total = _feeConfigInfo.total;
                        vc.component.simplifyHisFeeInfo.records = _feeConfigInfo.records;
                        vc.component.simplifyHisFeeInfo.feeDetails = _feeConfigInfo.feeDetails;
                        vc.emit('simplifyHisFee', 'paginationPlus', 'init', {
                            total: vc.component.simplifyHisFeeInfo.records,
                            dataCount: vc.component.simplifyHisFeeInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },

            clearSimplifyHisFeeInfo: function () {
                $that.simplifyHisFeeInfo = {
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