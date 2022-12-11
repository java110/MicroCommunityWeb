/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            integralRuleConfigInfo: {
                integralRuleConfigs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                textId: '',
                conditions: {
                    crcId: '',
                    ruleId: '',
                    cppId: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    quantity: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listIntegralRuleConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('integralRuleConfig', 'switch', function (_data) {
                $that.integralRuleConfigInfo.conditions.ruleId = _data.ruleId;
                $that._listIntegralRuleConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('integralRuleConfigManage', 'listIntegralRuleConfig', function (_param) {
                vc.component._listIntegralRuleConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('integralRuleConfig', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listIntegralRuleConfigs(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listIntegralRuleConfigs: function (_page, _rows) {

                vc.component.integralRuleConfigInfo.conditions.page = _page;
                vc.component.integralRuleConfigInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.integralRuleConfigInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/integral.listIntegralRuleConfig',
                    param,
                    function (json, res) {
                        var _integralRuleConfigInfo = JSON.parse(json);
                        vc.component.integralRuleConfigInfo.total = _integralRuleConfigInfo.total;
                        vc.component.integralRuleConfigInfo.records = _integralRuleConfigInfo.records;
                        vc.component.integralRuleConfigInfo.integralRuleConfigs = _integralRuleConfigInfo.data;
                        vc.emit('integralRuleConfig', 'paginationPlus', 'init', {
                            total: vc.component.integralRuleConfigInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddIntegralRuleConfigModal: function () {
                vc.emit('addIntegralRuleConfig', 'openAddIntegralRuleConfigModal', {
                    ruleId:$that.integralRuleConfigInfo.conditions.ruleId,
                });
            },
            _openEditIntegralRuleConfigModel: function (_integralRuleConfig) {
                vc.emit('editIntegralRuleConfig', 'openEditIntegralRuleConfigModal', _integralRuleConfig);
            },
            _openDeleteIntegralRuleConfigModel: function (_integralRuleConfig) {
                vc.emit('deleteIntegralRuleConfig', 'openDeleteIntegralRuleConfigModal', _integralRuleConfig);
            },
            _queryIntegralRuleConfigMethod: function () {
                vc.component._listIntegralRuleConfigs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.integralRuleConfigInfo.moreCondition) {
                    vc.component.integralRuleConfigInfo.moreCondition = false;
                } else {
                    vc.component.integralRuleConfigInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);