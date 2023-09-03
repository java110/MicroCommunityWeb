/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractDetailHisFeeInfo: {
                total: 0,
                records: 1,
                feeDetails: [],
                contractId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('contractDetailHisFee', 'switch', function (_param) {
                $that.clearContractDetailHisFeeInfo();
                if (_param.contractId == '') {
                    return;
                }
                vc.copyObject(_param, $that.contractDetailHisFeeInfo)
                $that._listContractDetailHisFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('contractDetailHisFee', 'notify', function () {
                $that._listContractDetailHisFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('contractDetailHisFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listContractDetailHisFeeDetails(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listContractDetailHisFeeDetails: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: $that.contractDetailHisFeeInfo.contractId,
                    }
                };

                //发送get请求
                vc.http.apiGet('/fee.queryFeeDetail',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.contractDetailHisFeeInfo.total = _feeConfigInfo.total;
                        vc.component.contractDetailHisFeeInfo.records = _feeConfigInfo.records;
                        vc.component.contractDetailHisFeeInfo.feeDetails = _feeConfigInfo.feeDetails;
                        vc.emit('contractDetailHisFee', 'paginationPlus', 'init', {
                            total: vc.component.contractDetailHisFeeInfo.records,
                            dataCount: vc.component.contractDetailHisFeeInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },

            clearContractDetailHisFeeInfo: function () {
                $that.contractDetailHisFeeInfo = {
                    total: 0,
                    records: 1,
                    feeDetails: [],
                    contractId: ''
                }
            },
            _toRefundFee: function (_detail) {
                vc.jumpToPage('/#/pages/property/propertyFee?feeId=' + _detail.feeId);
            }
        }
    });
})(window.vc);