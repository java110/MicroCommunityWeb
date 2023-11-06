/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            chargeMonthOrderManageInfo: {
                chargeMonthOrders: [],
                total: 0,
                records: 1,
                moreCondition: false,
                orderId: '',
                conditions: {
                    cardId: '',
                    personName: '',
                    personTel: '',
                    primeRate: '',
                    receivableAmount: '',
                    receivedAmount: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            $that._listChargeMonthOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('chargeMonthOrderManage', 'listChargeMonthOrder', function (_param) {
                $that._listChargeMonthOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listChargeMonthOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listChargeMonthOrders: function (_page, _rows) {
                $that.chargeMonthOrderManageInfo.conditions.page = _page;
                $that.chargeMonthOrderManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.chargeMonthOrderManageInfo.conditions
                };
                param.params.personName = param.params.personName.trim();
                param.params.personTel = param.params.personTel.trim();
                //发送get请求
                vc.http.apiGet('/chargeCard.listChargeMonthOrder',
                    param,
                    function (json, res) {
                        var _chargeMonthOrderManageInfo = JSON.parse(json);
                        $that.chargeMonthOrderManageInfo.total = _chargeMonthOrderManageInfo.total;
                        $that.chargeMonthOrderManageInfo.records = _chargeMonthOrderManageInfo.records;
                        $that.chargeMonthOrderManageInfo.chargeMonthOrders = _chargeMonthOrderManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.chargeMonthOrderManageInfo.records,
                            dataCount: $that.chargeMonthOrderManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddChargeMonthOrderModal: function () {
                vc.emit('addChargeMonthOrder', 'openAddChargeMonthOrderModal', {});
            },
            //查询
            _queryChargeMonthOrderMethod: function () {
                $that._listChargeMonthOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetChargeMonthOrderMethod: function () {
                $that.chargeMonthOrderManageInfo.conditions.personName = "";
                $that.chargeMonthOrderManageInfo.conditions.personTel = "";
                $that._listChargeMonthOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.chargeMonthOrderManageInfo.moreCondition) {
                    $that.chargeMonthOrderManageInfo.moreCondition = false;
                } else {
                    $that.chargeMonthOrderManageInfo.moreCondition = true;
                }
            },
            _settingOrderCard: function () {
                vc.jumpToPage('/#/pages/machine/chargeMonthCardManage')
            }
        }
    });
})(window.vc);