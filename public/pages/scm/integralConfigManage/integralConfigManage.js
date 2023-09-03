/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            integralConfigManageInfo: {
                integralConfigs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                configId: '',
                conditions: {
                    configName: '',
                    computingFormula: '',
                    scale: '',
                    communityId:vc.getCurrentCommunity().communityId

                }
            }
        },
        _initMethod: function () {
            vc.component._listIntegralConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('integralConfigManage', 'listIntegralConfig', function (_param) {
                vc.component._listIntegralConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listIntegralConfigs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listIntegralConfigs: function (_page, _rows) {

                vc.component.integralConfigManageInfo.conditions.page = _page;
                vc.component.integralConfigManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.integralConfigManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/integral.listIntegralConfig',
                    param,
                    function (json, res) {
                        var _integralConfigManageInfo = JSON.parse(json);
                        vc.component.integralConfigManageInfo.total = _integralConfigManageInfo.total;
                        vc.component.integralConfigManageInfo.records = _integralConfigManageInfo.records;
                        vc.component.integralConfigManageInfo.integralConfigs = _integralConfigManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.integralConfigManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddIntegralConfigModal: function () {
                vc.emit('addIntegralConfig', 'openAddIntegralConfigModal', {});
            },
            _openEditIntegralConfigModel: function (_integralConfig) {
                vc.emit('editIntegralConfig', 'openEditIntegralConfigModal', _integralConfig);
            },
            _openDeleteIntegralConfigModel: function (_integralConfig) {
                vc.emit('deleteIntegralConfig', 'openDeleteIntegralConfigModal', _integralConfig);
            },
            _queryIntegralConfigMethod: function () {
                vc.component._listIntegralConfigs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.integralConfigManageInfo.moreCondition) {
                    vc.component.integralConfigManageInfo.moreCondition = false;
                } else {
                    vc.component.integralConfigManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
