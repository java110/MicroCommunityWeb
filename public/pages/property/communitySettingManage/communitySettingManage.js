/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            communitySettingManageInfo: {
                communitySettings: [],
                settingTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                csId: '',
                conditions: {
                    settingType: '',
                    settingName: '',
                    settingKey: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listCommunitySettings(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('community_setting', "setting_type", function (_data) {
                vc.component.communitySettingManageInfo.settingTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('communitySettingManage', 'listCommunitySetting', function (_param) {
                vc.component._listCommunitySettings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listCommunitySettings(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCommunitySettings: function (_page, _rows) {
                vc.component.communitySettingManageInfo.conditions.page = _page;
                vc.component.communitySettingManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.communitySettingManageInfo.conditions
                };
                param.params.settingName = param.params.settingName.trim();
                param.params.settingKey = param.params.settingKey.trim();
                //发送get请求
                vc.http.apiGet('/communitySetting/queryCommunitySetting',
                    param,
                    function (json, res) {
                        var _communitySettingManageInfo = JSON.parse(json);
                        vc.component.communitySettingManageInfo.total = _communitySettingManageInfo.total;
                        vc.component.communitySettingManageInfo.records = _communitySettingManageInfo.records;
                        vc.component.communitySettingManageInfo.communitySettings = _communitySettingManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.communitySettingManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCommunitySettingModal: function () {
                vc.emit('addCommunitySetting', 'openAddCommunitySettingModal', {});
            },
            _openEditCommunitySettingModel: function (_communitySetting) {
                vc.emit('editCommunitySetting', 'openEditCommunitySettingModal', _communitySetting);
            },
            _openDeleteCommunitySettingModel: function (_communitySetting) {
                vc.emit('deleteCommunitySetting', 'openDeleteCommunitySettingModal', _communitySetting);
            },
            _queryCommunitySettingMethod: function () {
                vc.component._listCommunitySettings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetCommunitySettingMethod: function () {
                vc.component.communitySettingManageInfo.conditions.settingType = "";
                vc.component.communitySettingManageInfo.conditions.settingName = "";
                vc.component.communitySettingManageInfo.conditions.settingKey = "";
                vc.component._listCommunitySettings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.communitySettingManageInfo.moreCondition) {
                    vc.component.communitySettingManageInfo.moreCondition = false;
                } else {
                    vc.component.communitySettingManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
