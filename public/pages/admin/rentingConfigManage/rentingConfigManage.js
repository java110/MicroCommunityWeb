/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            rentingConfigManageInfo: {
                rentingConfigs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                rentingConfigId: '',
                conditions: {
                    rentingConfigId: '',
                    rentingType: '',
                    rentingFormula: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listRentingConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('rentingConfigManage', 'listRentingConfig', function (_param) {
                vc.component._listRentingConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRentingConfigs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listRentingConfigs: function (_page, _rows) {

                vc.component.rentingConfigManageInfo.conditions.page = _page;
                vc.component.rentingConfigManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.rentingConfigManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/renting/queryRentingConfig',
                    param,
                    function (json, res) {
                        var _rentingConfigManageInfo = JSON.parse(json);
                        vc.component.rentingConfigManageInfo.total = _rentingConfigManageInfo.total;
                        vc.component.rentingConfigManageInfo.records = _rentingConfigManageInfo.records;
                        vc.component.rentingConfigManageInfo.rentingConfigs = _rentingConfigManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.rentingConfigManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddRentingConfigModal: function () {
                vc.emit('addRentingConfig', 'openAddRentingConfigModal', {});
            },
            _openEditRentingConfigModel: function (_rentingConfig) {
                vc.emit('editRentingConfig', 'openEditRentingConfigModal', _rentingConfig);
            },
            _openDeleteRentingConfigModel: function (_rentingConfig) {
                vc.emit('deleteRentingConfig', 'openDeleteRentingConfigModal', _rentingConfig);
            },
            _queryRentingConfigMethod: function () {
                vc.component._listRentingConfigs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.rentingConfigManageInfo.moreCondition) {
                    vc.component.rentingConfigManageInfo.moreCondition = false;
                } else {
                    vc.component.rentingConfigManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
