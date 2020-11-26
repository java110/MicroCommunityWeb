/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeConfigDiscountManageInfo: {
                payFeeConfigDiscounts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                configDiscountId: '',
                configId: '',
                feeName: ''
            }
        },
        _initMethod: function () {
            let _configId = vc.getParam('configId');
            let _feeName = vc.getParam('feeName');

            $that.payFeeConfigDiscountManageInfo.configId = _configId;
            $that.payFeeConfigDiscountManageInfo.feeName = _feeName;
            vc.component._listPayFeeConfigDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('payFeeConfigDiscountManage', 'listPayFeeConfigDiscount', function (_param) {
                vc.component._listPayFeeConfigDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listPayFeeConfigDiscounts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listPayFeeConfigDiscounts: function (_page, _rows) {

                let param = {
                    params: {
                        page:_page,
                        row:_rows,
                        configId:$that.payFeeConfigDiscountManageInfo.configId,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/payFeeConfigDiscount/queryPayFeeConfigDiscount',
                    param,
                    function (json, res) {
                        var _payFeeConfigDiscountManageInfo = JSON.parse(json);
                        vc.component.payFeeConfigDiscountManageInfo.total = _payFeeConfigDiscountManageInfo.total;
                        vc.component.payFeeConfigDiscountManageInfo.records = _payFeeConfigDiscountManageInfo.records;
                        vc.component.payFeeConfigDiscountManageInfo.payFeeConfigDiscounts = _payFeeConfigDiscountManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.payFeeConfigDiscountManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddPayFeeConfigDiscountModal: function () {
                vc.emit('addPayFeeConfigDiscount', 'openAddPayFeeConfigDiscountModal', {
                    configId: $that.payFeeConfigDiscountManageInfo.configId
                });
            },
            _openDeletePayFeeConfigDiscountModel: function (_payFeeConfigDiscount) {
                vc.emit('deletePayFeeConfigDiscount', 'openDeletePayFeeConfigDiscountModal', _payFeeConfigDiscount);
            },
            _queryPayFeeConfigDiscountMethod: function () {
                vc.component._listPayFeeConfigDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _goBack: function () {
                vc.goBack();
            },
            _moreCondition: function () {
                if (vc.component.payFeeConfigDiscountManageInfo.moreCondition) {
                    vc.component.payFeeConfigDiscountManageInfo.moreCondition = false;
                } else {
                    vc.component.payFeeConfigDiscountManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
