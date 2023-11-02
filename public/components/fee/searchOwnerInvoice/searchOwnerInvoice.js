(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseOwner: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            searchOwnerInvoiceInfo: {
                ownerInvoices: [],
                ownerNameLike: '',
                roomName: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('searchOwnerInvoice', 'openSearchOwnerInvoiceModel', function (_param) {
                $('#searchOwnerInvoiceModel').modal('show');
                $that._refreshsearchOwnerInvoiceData();
                $that._loadAllOwnerInvoiceInfo(1, 10);
            });
            vc.on('searchOwnerInvoice', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._loadAllOwnerInvoiceInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadAllOwnerInvoiceInfo: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerNameLike: $that.searchOwnerInvoiceInfo.ownerNameLike,
                    }
                };
                //发送get请求
                vc.http.apiGet('/invoice.listOwnerInvoice',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.searchOwnerInvoiceInfo.ownerInvoices = _json.data;
                        vc.emit('searchOwnerInvoice', 'paginationPlus', 'init', {
                            total: _json.records,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseOwnerInvoice: function (_owner) {
                vc.emit($props.emitChooseOwner, 'chooseOwnerInvoice', _owner);
                vc.emit($props.emitLoadData, 'listOwnerInvoiceData', _owner);
                $('#searchOwnerInvoiceModel').modal('hide');
            },
            searchOwnerInvoices: function () {
                $that._loadAllOwnerInfo(1, 10, $that.searchOwnerInvoiceInfo.ownerNameLike);
            },
            _refreshsearchOwnerInvoiceData: function () {
                $that.searchOwnerInvoiceInfo.ownerNameLike = "";
            }
        }
    });
})(window.vc);