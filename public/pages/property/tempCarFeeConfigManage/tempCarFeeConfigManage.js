/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            tempCarFeeConfigManageInfo: {
                tempCarFeeConfigs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                configId: '',
                conditions: {
                    feeName: '',
                    paId: '',
                    carType: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listTempCarFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('tempCarFeeConfigManage', 'listTempCarFeeConfig', function (_param) {
                vc.component._listTempCarFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listTempCarFeeConfigs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listTempCarFeeConfigs: function (_page, _rows) {

                vc.component.tempCarFeeConfigManageInfo.conditions.page = _page;
                vc.component.tempCarFeeConfigManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.tempCarFeeConfigManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('fee.listTempCarFeeConfigs',
                    param,
                    function (json, res) {
                        var _tempCarFeeConfigManageInfo = JSON.parse(json);
                        vc.component.tempCarFeeConfigManageInfo.total = _tempCarFeeConfigManageInfo.total;
                        vc.component.tempCarFeeConfigManageInfo.records = _tempCarFeeConfigManageInfo.records;
                        vc.component.tempCarFeeConfigManageInfo.tempCarFeeConfigs = _tempCarFeeConfigManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.tempCarFeeConfigManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddTempCarFeeConfigModal: function () {
                vc.emit('addTempCarFeeConfig', 'openAddTempCarFeeConfigModal', {});
            },
            _openEditTempCarFeeConfigModel: function (_tempCarFeeConfig) {
                vc.emit('editTempCarFeeConfig', 'openEditTempCarFeeConfigModal', _tempCarFeeConfig);
            },
            _openDeleteTempCarFeeConfigModel: function (_tempCarFeeConfig) {
                vc.emit('deleteTempCarFeeConfig', 'openDeleteTempCarFeeConfigModal', _tempCarFeeConfig);
            },
            _queryTempCarFeeConfigMethod: function () {
                vc.component._listTempCarFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.tempCarFeeConfigManageInfo.moreCondition) {
                    vc.component.tempCarFeeConfigManageInfo.moreCondition = false;
                } else {
                    vc.component.tempCarFeeConfigManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
