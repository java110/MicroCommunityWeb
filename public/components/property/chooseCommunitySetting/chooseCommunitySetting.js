(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseCommunitySetting: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseCommunitySettingInfo: {
                communitySettings: [],
                _currentCommunitySettingName: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseCommunitySetting', 'openChooseCommunitySettingModel', function (_param) {
                $('#chooseCommunitySettingModel').modal('show');
                vc.component._refreshChooseCommunitySettingInfo();
                vc.component._loadAllCommunitySettingInfo(1, 10, '');
            });
        },
        methods: {
            _loadAllCommunitySettingInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        name: _name
                    }
                };

                //发送get请求
                vc.http.apiGet('communitySetting.listCommunitySettings',
                    param,
                    function (json) {
                        var _communitySettingInfo = JSON.parse(json);
                        vc.component.chooseCommunitySettingInfo.communitySettings = _communitySettingInfo.communitySettings;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseCommunitySetting: function (_communitySetting) {
                if (_communitySetting.hasOwnProperty('name')) {
                    _communitySetting.communitySettingName = _communitySetting.name;
                }
                vc.emit($props.emitChooseCommunitySetting, 'chooseCommunitySetting', _communitySetting);
                vc.emit($props.emitLoadData, 'listCommunitySettingData', {
                    communitySettingId: _communitySetting.communitySettingId
                });
                $('#chooseCommunitySettingModel').modal('hide');
            },
            queryCommunitySettings: function () {
                vc.component._loadAllCommunitySettingInfo(1, 10, vc.component.chooseCommunitySettingInfo._currentCommunitySettingName);
            },
            _refreshChooseCommunitySettingInfo: function () {
                vc.component.chooseCommunitySettingInfo._currentCommunitySettingName = "";
            }
        }

    });
})(window.vc);
