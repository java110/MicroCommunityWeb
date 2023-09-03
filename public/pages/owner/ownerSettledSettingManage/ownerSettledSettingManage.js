/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerSettledSettingManageInfo: {
                ownerSettledSettings: [],
                total: 0,
                records: 1,
                moreCondition: false,
                settingId: '',
                conditions: {
                    settingId: '',
                    settingName: '',
                    auditWay: '',
                    communityId:vc.getCurrentCommunity().communityId

                }
            }
        },
        _initMethod: function () {
            vc.component._listOwnerSettledSettings(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('ownerSettledSettingManage', 'listOwnerSettledSetting', function (_param) {
                vc.component._listOwnerSettledSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listOwnerSettledSettings(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOwnerSettledSettings: function (_page, _rows) {

                vc.component.ownerSettledSettingManageInfo.conditions.page = _page;
                vc.component.ownerSettledSettingManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.ownerSettledSettingManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/ownerSettled.listOwnerSettledSetting',
                    param,
                    function (json, res) {
                        var _ownerSettledSettingManageInfo = JSON.parse(json);
                        vc.component.ownerSettledSettingManageInfo.total = _ownerSettledSettingManageInfo.total;
                        vc.component.ownerSettledSettingManageInfo.records = _ownerSettledSettingManageInfo.records;
                        vc.component.ownerSettledSettingManageInfo.ownerSettledSettings = _ownerSettledSettingManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.ownerSettledSettingManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddOwnerSettledSettingModal: function () {
                vc.emit('addOwnerSettledSetting', 'openAddOwnerSettledSettingModal', {});
            },
            _openEditOwnerSettledSettingModel: function (_ownerSettledSetting) {
                vc.emit('editOwnerSettledSetting', 'openEditOwnerSettledSettingModal', _ownerSettledSetting);
            },
            _queryOwnerSettledSettingMethod: function () {
                vc.component._listOwnerSettledSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.ownerSettledSettingManageInfo.moreCondition) {
                    vc.component.ownerSettledSettingManageInfo.moreCondition = false;
                } else {
                    vc.component.ownerSettledSettingManageInfo.moreCondition = true;
                }
            },
            _settingFlow:function(_ownerSettledSetting){
                window.open('/bpmnjs/index.html?flowId=' + _ownerSettledSetting.flowId + "&modelId=" + _ownerSettledSetting.modelId);
            },
            _openDeployWorkflow: function (_ownerSettledSetting) {
                let _param = {
                    modelId: _ownerSettledSetting.modelId
                };
                //发送get请求
                vc.http.apiPost('/workflow/deployModel',
                    JSON.stringify(_param),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg)
                        vc.emit('ownerSettledSettingManage', 'listOwnerSettledSetting', {});
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }


        }
    });
})(window.vc);
