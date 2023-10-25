/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            paymentPoolInfo: {
                paymentPools: [],
                total: 0,
                records: 1,
                moreCondition: false,
                ppId: '',
                conditions: {
                    paymentName: '',
                    paymentType: '',
                    state: '',

                }
            }
        },
        _initMethod: function () {
            $that._listPaymentPools(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('paymentPool', 'listPaymentPool', function (_param) {
                $that._listPaymentPools(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listPaymentPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listPaymentPools: function (_page, _rows) {

                $that.paymentPoolInfo.conditions.page = _page;
                $that.paymentPoolInfo.conditions.row = _rows;
                $that.paymentPoolInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.paymentPoolInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/payment.listPaymentPool',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.paymentPoolInfo.total = _json.total;
                        $that.paymentPoolInfo.records = _json.records;
                        $that.paymentPoolInfo.paymentPools = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.paymentPoolInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddPaymentPoolModal: function () {
                vc.emit('addPaymentPool', 'openAddPaymentPoolModal', {});
            },
            _openEditPaymentPoolModel: function (_paymentPool) {
                vc.emit('editPaymentPool', 'openEditPaymentPoolModal', _paymentPool);
            },
            _openDeletePaymentPoolModel: function (_paymentPool) {
                vc.emit('deletePaymentPool', 'openDeletePaymentPoolModal', _paymentPool);
            },
            _queryPaymentPoolMethod: function () {
                $that._listPaymentPools(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if ($that.paymentPoolInfo.moreCondition) {
                    $that.paymentPoolInfo.moreCondition = false;
                } else {
                    $that.paymentPoolInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
