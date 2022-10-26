/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var ALL_ROWS = 100;
    vc.extends({
        data: {
            marketRuleCommunityInfo: {
                marketRuleCommunitys:[],
                total: 0,
                records: 1,
                moreCondition: false,
                ruleId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('marketRuleCommunityInfo', 'openMarketRuleCommunity', function (_param) {
                vc.copyObject(_param, vc.component.marketRuleCommunityInfo);
                vc.component._listMarketRuleCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('marketRuleCommunityInfo', 'listMarketRuleCommunity', function (_param) {
                //vc.copyObject(_param, vc.component.marketRuleCommunityInfo.conditions);
                vc.component._listMarketRuleCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('marketRuleCommunityInfo', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._listMarketRuleCommunitys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMarketRuleCommunitys: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        ruleId: vc.component.marketRuleCommunityInfo.ruleId
                    }
                };
                //发送get请求
                vc.http.apiGet('/marketRule.listMarketRuleCommunity',
                    param,
                    function (json, res) {
                        var _marketRuleCommunityInfo = JSON.parse(json);
                        vc.component.marketRuleCommunityInfo.total = _marketRuleCommunityInfo.total;
                        vc.component.marketRuleCommunityInfo.records = _marketRuleCommunityInfo.records;
                        vc.component.marketRuleCommunityInfo.marketRuleCommunitys = _marketRuleCommunityInfo.data;
                        vc.emit('marketRuleCommunityInfo', 'paginationPlus', 'init', {
                            total: vc.component.marketRuleCommunityInfo.records,
                            dataCount: vc.component.marketRuleCommunityInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMarketRuleCommunityModal: function () {
                vc.emit('addMarketRuleCommunity','openAddMarketRuleCommunityModal', {
                    ruleId: vc.component.marketRuleCommunityInfo.ruleId,
                });
            },
            _openDeleteMarketRuleCommunityModel: function (_roleCommunity) {
                vc.emit('deleteMarketRuleCommunity','openDeleteMarketRuleCommunityModal', _roleCommunity);
            },
            _queryMarketRuleCommunityMethod: function () {
                vc.component._listMarketRuleCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.marketRuleCommunityInfo.moreCondition) {
                    vc.component.marketRuleCommunityInfo.moreCondition = false;
                } else {
                    vc.component.marketRuleCommunityInfo.moreCondition = true;
                }
            },
        }
    });
})(window.vc);
