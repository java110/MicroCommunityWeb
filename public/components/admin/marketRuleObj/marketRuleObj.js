/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var ALL_ROWS = 100;
    vc.extends({
        data: {
            marketRuleObjInfo: {
                marketRuleObjs:[],
                total: 0,
                records: 1,
                moreCondition: false,
                ruleId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('marketRuleObjInfo', 'openMarketRuleObj', function (_param) {
                vc.copyObject(_param, vc.component.marketRuleObjInfo);
                vc.component._listMarketRuleObjs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('marketRuleObjInfo', 'listMarketRuleObj', function (_param) {
                //vc.copyObject(_param, vc.component.marketRuleObjInfo.conditions);
                vc.component._listMarketRuleObjs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('marketRuleObjInfo', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._listMarketRuleObjs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMarketRuleObjs: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        ruleId: vc.component.marketRuleObjInfo.ruleId
                    }
                };
                //发送get请求
                vc.http.apiGet('/marketRule.listMarketRuleObj',
                    param,
                    function (json, res) {
                        var _marketRuleObjInfo = JSON.parse(json);
                        vc.component.marketRuleObjInfo.total = _marketRuleObjInfo.total;
                        vc.component.marketRuleObjInfo.records = _marketRuleObjInfo.records;
                        vc.component.marketRuleObjInfo.marketRuleObjs = _marketRuleObjInfo.data;
                        vc.emit('marketRuleObjInfo', 'paginationPlus', 'init', {
                            total: vc.component.marketRuleObjInfo.records,
                            dataCount: vc.component.marketRuleObjInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMarketRuleObjModal: function () {
                vc.emit('addMarketRuleObj','openAddMarketRuleObjModal', {
                    ruleId: vc.component.marketRuleObjInfo.ruleId,
                });
            },
            _openDeleteMarketRuleObjModel: function (_roleObj) {
                vc.emit('deleteMarketRuleObj','openDeleteMarketRuleObjModal', _roleObj);
            },
            _queryMarketRuleObjMethod: function () {
                vc.component._listMarketRuleObjs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.marketRuleObjInfo.moreCondition) {
                    vc.component.marketRuleObjInfo.moreCondition = false;
                } else {
                    vc.component.marketRuleObjInfo.moreCondition = true;
                }
            },
        }
    });
})(window.vc);
