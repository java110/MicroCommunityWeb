/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerInvoiceInfo: {
                ownerInvoices: [],
                total: 0,
                records: 1,
                moreCondition: false,
                oiId: '',
                conditions: {
                    ownerName: '',
                    invoiceType: '',
                    invoiceName: '',
                }
            }
        },
        _initMethod: function () {
            $that._listOwnerInvoices(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('ownerInvoice', 'listOwnerInvoice', function (_param) {
                $that._listOwnerInvoices(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listOwnerInvoices(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOwnerInvoices: function (_page, _rows) {

                $that.ownerInvoiceInfo.conditions.page = _page;
                $that.ownerInvoiceInfo.conditions.row = _rows;
                $that.ownerInvoiceInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.ownerInvoiceInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/invoice.listOwnerInvoice',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.ownerInvoiceInfo.total = _json.total;
                        $that.ownerInvoiceInfo.records = _json.records;
                        $that.ownerInvoiceInfo.ownerInvoices = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.ownerInvoiceInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddOwnerInvoiceModal: function () {
                vc.jumpToPage('/#/pages/fee/addOwnerInvoice')
            },
            _openEditOwnerInvoiceModel: function (_ownerInvoice) {
                vc.emit('editOwnerInvoice', 'openEditOwnerInvoiceModal', _ownerInvoice);
            },
            _openDeleteOwnerInvoiceModel: function (_ownerInvoice) {
                vc.emit('deleteOwnerInvoice', 'openDeleteOwnerInvoiceModal', _ownerInvoice);
            },
            _queryOwnerInvoiceMethod: function () {
                $that._listOwnerInvoices(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if ($that.ownerInvoiceInfo.moreCondition) {
                    $that.ownerInvoiceInfo.moreCondition = false;
                } else {
                    $that.ownerInvoiceInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
