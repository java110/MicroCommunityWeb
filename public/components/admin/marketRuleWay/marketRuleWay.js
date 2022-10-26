/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var ALL_ROWS = 100;
    vc.extends({
        data: {
            marketRuleWayInfo: {
                marketRuleWays:[],
                total: 0,
                records: 1,
                moreCondition: false,
                ruleId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('marketRuleWayInfo', 'openMarketRuleWay', function (_param) {
                vc.copyObject(_param, vc.component.marketRuleWayInfo);
                vc.component._listMarketRuleWays(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('marketRuleWayInfo', 'listMarketRuleWay', function (_param) {
                //vc.copyObject(_param, vc.component.marketRuleWayInfo.conditions);
                vc.component._listMarketRuleWays(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('marketRuleWayInfo', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._listMarketRuleWays(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMarketRuleWays: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        ruleId: vc.component.marketRuleWayInfo.ruleId
                    }
                };
                //发送get请求
                vc.http.apiGet('/marketRule.listMarketRuleWay',
                    param,
                    function (json, res) {
                        var _marketRuleWayInfo = JSON.parse(json);
                        vc.component.marketRuleWayInfo.total = _marketRuleWayInfo.total;
                        vc.component.marketRuleWayInfo.records = _marketRuleWayInfo.records;
                        vc.component.marketRuleWayInfo.marketRuleWays = _marketRuleWayInfo.data;
                        vc.emit('marketRuleWayInfo', 'paginationPlus', 'init', {
                            total: vc.component.marketRuleWayInfo.records,
                            dataCount: vc.component.marketRuleWayInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMarketRuleWayModal: function () {
                vc.emit('addMarketRuleWay','openAddMarketRuleWayModal', {
                    ruleId: vc.component.marketRuleWayInfo.ruleId,
                });
            },
            _openDeleteMarketRuleWayModel: function (_roleCommunity) {
                vc.emit('deleteMarketRuleWay','openDeleteMarketRuleWayModal', _roleCommunity);
            },
            _queryMarketRuleWayMethod: function () {
                vc.component._listMarketRuleWays(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.marketRuleWayInfo.moreCondition) {
                    vc.component.marketRuleWayInfo.moreCondition = false;
                } else {
                    vc.component.marketRuleWayInfo.moreCondition = true;
                }
            },
        }
    });
})(window.vc);
