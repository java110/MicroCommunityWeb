/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeQrcodeInfo: {
                payFeeQrcodes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                pfqId: '',
                conditions: {
                    qrcodeName: '',
                    customFee: '',
                    preFee: ''
                }
            }
        },
        _initMethod: function () {
            $that._listPayFeeQrcodes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('payFeeQrcode', 'listPayFeeQrcode', function (_param) {
                $that._listPayFeeQrcodes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listPayFeeQrcodes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listPayFeeQrcodes: function (_page, _rows) {
                $that.payFeeQrcodeInfo.conditions.page = _page;
                $that.payFeeQrcodeInfo.conditions.row = _rows;
                $that.payFeeQrcodeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.payFeeQrcodeInfo.conditions
                };
                param.params.qrcodeName = param.params.qrcodeName.trim();
                //发送get请求
                vc.http.apiGet('/payFeeQrcode.listPayFeeQrcode',
                    param,
                    function (json, res) {
                        var _payFeeQrcodeInfo = JSON.parse(json);
                        $that.payFeeQrcodeInfo.total = _payFeeQrcodeInfo.total;
                        $that.payFeeQrcodeInfo.records = _payFeeQrcodeInfo.records;
                        $that.payFeeQrcodeInfo.payFeeQrcodes = _payFeeQrcodeInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.payFeeQrcodeInfo.records,
                            dataCount: $that.payFeeQrcodeInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddPayFeeQrcodeModal: function () {
                vc.emit('addPayFeeQrcode', 'openAddPayFeeQrcodeModal', {});
            },
            _openEditPayFeeQrcodeModel: function (_payFeeQrcode) {
                vc.emit('editPayFeeQrcode', 'openEditPayFeeQrcodeModal', _payFeeQrcode);
            },
            _openDeletePayFeeQrcodeModel: function (_payFeeQrcode) {
                vc.emit('deletePayFeeQrcode', 'openDeletePayFeeQrcodeModal', _payFeeQrcode);
            },
            _openViewPayFeeQrcodeModel: function (_payFeeQrcode) {
                vc.emit('viewPayFeeQrcode', 'openPayFeeQrcodeModal', _payFeeQrcode);
            },
            //查询
            _queryPayFeeQrcodeMethod: function () {
                $that._listPayFeeQrcodes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetPayFeeQrcodeMethod: function () {
                vc.component.payFeeQrcodeInfo.conditions.qrcodeName = "";
                $that._listPayFeeQrcodes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.payFeeQrcodeInfo.moreCondition) {
                    $that.payFeeQrcodeInfo.moreCondition = false;
                } else {
                    $that.payFeeQrcodeInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
