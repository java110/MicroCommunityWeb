/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            invoiceApplyDetailEventInfo: {
                events: [],
                applyId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('invoiceApplyDetailEvent', 'switch', function (_data) {
                $that.invoiceApplyDetailEventInfo.applyId = _data.applyId;
                $that._loadInvoiceApplyDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('invoiceApplyDetailEvent', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadInvoiceApplyDetailEventData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadInvoiceApplyDetailEventData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        applyId: $that.invoiceApplyDetailEventInfo.applyId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/invoice.listInvoiceEvent',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        $that.invoiceApplyDetailEventInfo.events = _roomInfo.data;
                        vc.emit('invoiceApplyDetailEvent', 'paginationPlus', 'init', {
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
            _qureyInvoiceApplyDetailEvent: function () {
                $that._loadInvoiceApplyDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
           
        }
    });
})(window.vc);