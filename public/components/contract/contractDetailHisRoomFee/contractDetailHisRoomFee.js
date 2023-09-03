/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractDetailHisRoomFeeInfo: {
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
            vc.on('contractDetailHisRoomFee', 'switch', function (_param) {
                $that.clearContractDetailHisRoomFeeInfo();
                if (_param.ownerId == '') {
                    return;
                }
                vc.copyObject(_param, $that.contractDetailHisRoomFeeInfo)
                $that._listContractDetailHisRoomFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('contractDetailHisRoomFee', 'notify', function () {
                $that._listContractDetailHisRoomFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('contractDetailHisRoomFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listContractDetailHisRoomFeeDetails(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listContractDetailHisRoomFeeDetails: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.contractDetailHisRoomFeeInfo.ownerId,
                        payerObjType:'3333'
                    }
                };

                //发送get请求
                vc.http.apiGet('/fee.queryFeeDetail',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.contractDetailHisRoomFeeInfo.total = _feeConfigInfo.total;
                        vc.component.contractDetailHisRoomFeeInfo.records = _feeConfigInfo.records;
                        vc.component.contractDetailHisRoomFeeInfo.feeDetails = _feeConfigInfo.feeDetails;
                        vc.emit('contractDetailHisRoomFee', 'paginationPlus', 'init', {
                            total: vc.component.contractDetailHisRoomFeeInfo.records,
                            dataCount: vc.component.contractDetailHisRoomFeeInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },

            clearContractDetailHisRoomFeeInfo: function () {
                $that.contractDetailHisRoomFeeInfo = {
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