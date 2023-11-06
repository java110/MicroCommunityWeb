/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            chargeMonthCardManageInfo: {
                chargeMonthCards: [],
                total: 0,
                records: 1,
                moreCondition: false,
                cardId: '',
                conditions: {
                    cardName: '',
                    cardMonth: '',
                    cardPrice: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listChargeMonthCards(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('chargeMonthCardManage', 'listChargeMonthCard', function (_param) {
                vc.component._listChargeMonthCards(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listChargeMonthCards(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listChargeMonthCards: function (_page, _rows) {
                vc.component.chargeMonthCardManageInfo.conditions.page = _page;
                vc.component.chargeMonthCardManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.chargeMonthCardManageInfo.conditions
                };
                param.params.cardName = param.params.cardName.trim();
                //发送get请求
                vc.http.apiGet('/chargeCard.listChargeMonthCard',
                    param,
                    function (json, res) {
                        var _chargeMonthCardManageInfo = JSON.parse(json);
                        vc.component.chargeMonthCardManageInfo.total = _chargeMonthCardManageInfo.total;
                        vc.component.chargeMonthCardManageInfo.records = _chargeMonthCardManageInfo.records;
                        vc.component.chargeMonthCardManageInfo.chargeMonthCards = _chargeMonthCardManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.chargeMonthCardManageInfo.records,
                            dataCount: vc.component.chargeMonthCardManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddChargeMonthCardModal: function () {
                vc.emit('addChargeMonthCard', 'openAddChargeMonthCardModal', {});
            },
            _openEditChargeMonthCardModel: function (_chargeMonthCard) {
                vc.emit('editChargeMonthCard', 'openEditChargeMonthCardModal', _chargeMonthCard);
            },
            _openDeleteChargeMonthCardModel: function (_chargeMonthCard) {
                vc.emit('deleteChargeMonthCard', 'openDeleteChargeMonthCardModal', _chargeMonthCard);
            },
            //查询
            _queryChargeMonthCardMethod: function () {
                vc.component._listChargeMonthCards(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetChargeMonthCardMethod: function () {
                vc.component.chargeMonthCardManageInfo.conditions.cardName = "";
                vc.component._listChargeMonthCards(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.chargeMonthCardManageInfo.moreCondition) {
                    vc.component.chargeMonthCardManageInfo.moreCondition = false;
                } else {
                    vc.component.chargeMonthCardManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);