/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            invoiceApplyDetailFeeInfo: {
                fees: [],
                applyId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('invoiceApplyDetailFee', 'switch', function (_data) {
                $that.invoiceApplyDetailFeeInfo.applyId = _data.applyId;
                $that.invoiceApplyDetailFeeInfo.ownerId = _data.ownerId;
                $that._loadInvoiceApplyDetailFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('invoiceApplyDetailFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadInvoiceApplyDetailFeeData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadInvoiceApplyDetailFeeData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        applyId: $that.invoiceApplyDetailFeeInfo.applyId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/invoice.listInvoiceApplyItem',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        $that.invoiceApplyDetailFeeInfo.fees = _roomInfo.data;
                        vc.emit('invoiceApplyDetailFee', 'paginationPlus', 'init', {
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
            _qureyInvoiceApplyDetailFee: function () {
                $that._loadInvoiceApplyDetailFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewFeeDetail:function(_fee){
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        detailId:_fee.itemObjId,
                        page: 1,
                        row: 1
                    }
                };

                //发送get请求
                vc.http.apiGet('/fee.queryFeeDetail',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        if(!_json.feeDetails || _json.feeDetails.length < 1){
                            vc.toast('数据错误');
                            return ;
                        }
                        vc.jumpToPage('/#/pages/property/propertyFee?feeId='+_json.feeDetails[0].feeId);
                       
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _viewAcctDetail:function(_fee){
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        arId:_fee.itemObjId,
                        page: 1,
                        row: 1
                    }
                };

                //发送get请求
                vc.http.apiGet('/receipt.listAccountReceipt',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        if(!_json.data || _json.data.length < 1){
                            vc.toast('数据错误');
                            return ;
                        }
                        vc.jumpToPage('/#/pages/owner/ownerDetail?ownerId='+_json.data[0].ownerId+'&currentTab=ownerDetailAccountReceipt')

                       
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            }
            
        }
    });
})(window.vc);