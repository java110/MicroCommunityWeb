/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            smsConfigManageInfo: {
                smsConfigs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                smsId: '',
                conditions: {
                    title: '',
                    objId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listSmsConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('smsConfigManage', 'listSmsConfig', function (_param) {
                vc.component._listSmsConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listSmsConfigs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listSmsConfigs: function (_page, _rows) {

                vc.component.smsConfigManageInfo.conditions.page = _page;
                vc.component.smsConfigManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.smsConfigManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/smsConfig/querySmsConfig',
                    param,
                    function (json, res) {
                        var _smsConfigManageInfo = JSON.parse(json);
                        vc.component.smsConfigManageInfo.total = _smsConfigManageInfo.total;
                        vc.component.smsConfigManageInfo.records = _smsConfigManageInfo.records;
                        vc.component.smsConfigManageInfo.smsConfigs = _smsConfigManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.smsConfigManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddSmsConfigModal: function () {
                vc.emit('addSmsConfig', 'openAddSmsConfigModal', {});
            },
            _openEditSmsConfigModel: function (_smsConfig) {
                vc.emit('editSmsConfig', 'openEditSmsConfigModal', _smsConfig);
            },
            _querySmsConfigMethod: function () {
                vc.component._listSmsConfigs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.smsConfigManageInfo.moreCondition) {
                    vc.component.smsConfigManageInfo.moreCondition = false;
                } else {
                    vc.component.smsConfigManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
