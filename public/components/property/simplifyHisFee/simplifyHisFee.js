/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyHisFeeInfo: {
                total: 0,
                records: 1,
                feeDetails: [],
                ownerId: '',
                feeDetail: {},
                receiptType: 'Y',
                receiptCode: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            //切换 至费用页面
            vc.on('simplifyHisFee', 'switch', function(_param) {
                $that.clearSimplifyHisFeeInfo();
                if (_param.ownerId == '') {
                    return;
                }
                vc.copyObject(_param, $that.simplifyHisFeeInfo)
                $that._listSimplifyFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('simplifyHisFee', 'notify', function() {
                $that._listSimplifyFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyHisFee', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._listSimplifyFeeDetails(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listSimplifyFeeDetails: function(_page, _row) {
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
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        $that.simplifyHisFeeInfo.total = _feeConfigInfo.total;
                        $that.simplifyHisFeeInfo.records = _feeConfigInfo.records;
                        $that.simplifyHisFeeInfo.feeDetails = _feeConfigInfo.feeDetails;
                        vc.emit('simplifyHisFee', 'paginationPlus', 'init', {
                            total: $that.simplifyHisFeeInfo.records,
                            dataCount: $that.simplifyHisFeeInfo.total,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },

            clearSimplifyHisFeeInfo: function() {
                $that.simplifyHisFeeInfo = {
                    total: 0,
                    records: 1,
                    feeDetails: [],
                    ownerId: '',
                    feeDetail: {},
                    receiptType: 'Y',
                    receiptCode: ''
                }
            },
            _toRefundFee: function(_detail) {
                vc.jumpToPage('/#/pages/property/propertyFee?feeId=' + _detail.feeId);
            },
            _openGeneratorReceiptCode: function(_detail) {
                $that.simplifyHisFeeInfo.feeDetail = _detail;
                $('#generatorReceiptModel').modal('show');
            },
            _generatorReceiptCode: function() {
                let _data = {
                    detailId: $that.simplifyHisFeeInfo.feeDetail.detailId,
                    communityId: vc.getCurrentCommunity().communityId,
                    receiptCode: $that.simplifyHisFeeInfo.receiptCode
                };
                vc.http.apiPost('/receipt.generatorReceipt',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code != '0') {
                            return;
                        }
                        //$that._listSimplifyFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);
                        $('#generatorReceiptModel').modal('hide');
                        setTimeout(function(){
                            vc.emit('simplifyAcceptance', 'doSearch','simplifyHisFee')
                        },1000)
                        //

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);