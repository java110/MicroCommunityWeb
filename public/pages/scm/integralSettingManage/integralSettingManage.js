/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            integralSettingManageInfo: {
                integralSettings: [],
                total: 0,
                records: 1,
                moreCondition: false,
                settingId: '',
                conditions: {
                    money: '',
                    remark: '',
                    thirdFlag: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._listIntegralSettings(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('integralSettingManage', 'listIntegralSetting', function(_param) {
                vc.component._listIntegralSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listIntegralSettings(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listIntegralSettings: function(_page, _rows) {

                vc.component.integralSettingManageInfo.conditions.page = _page;
                vc.component.integralSettingManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.integralSettingManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/integral.listIntegralSetting',
                    param,
                    function(json, res) {
                        var _integralSettingManageInfo = JSON.parse(json);
                        vc.component.integralSettingManageInfo.total = _integralSettingManageInfo.total;
                        vc.component.integralSettingManageInfo.records = _integralSettingManageInfo.records;
                        vc.component.integralSettingManageInfo.integralSettings = _integralSettingManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.integralSettingManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddIntegralSettingModal: function() {
                vc.emit('addIntegralSetting', 'openAddIntegralSettingModal', {});
            },
            _openEditIntegralSettingModel: function(_integralSetting) {
                vc.emit('editIntegralSetting', 'openEditIntegralSettingModal', _integralSetting);
            },
            // _openDeleteIntegralSettingModel: function(_integralSetting) {
            //     vc.emit('deleteIntegralSetting', 'openDeleteIntegralSettingModal', _integralSetting);
            // },
            _queryIntegralSettingMethod: function() {
                vc.component._listIntegralSettings(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.integralSettingManageInfo.moreCondition) {
                    vc.component.integralSettingManageInfo.moreCondition = false;
                } else {
                    vc.component.integralSettingManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);