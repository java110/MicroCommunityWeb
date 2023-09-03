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
                keys:[],
                total: 0,
                records: 1,
                settingName: '',
                csId: '',
                conditions: {
                    settingType: '',
                    settingKey: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.getDict('community_setting_key', "setting_type", function (_data) {
                $that.communitySettingManageInfo.settingTypes = _data;
                if(_data && _data.length>0){
                    $that._swatchSettingType(_data[0])
                }
            });
        },
        _initEvent: function () {
            vc.on('communitySettingManage', 'listCommunitySetting', function (_param) {
                $that._listCommunitySettings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listCommunitySettings(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
          
            _swatchSettingType: function (_type) {
                $that.communitySettingManageInfo.conditions.settingType = _type.statusCd;
                $that.communitySettingManageInfo.settingName = _type.name;
                $that._loadCommunitySettingKey();
            },
            _loadCommunitySettingKey: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        settingType: $that.communitySettingManageInfo.conditions.settingType
                    }
                };
                $that.communitySettingManageInfo.keys = [];
                //发送get请求
                vc.http.apiGet('/communitySettingKey.listCommunitySettingKey',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if(_json.data && _json.data.length > 0){
                            _json.data.forEach(item => {
                                if(!item.settingValue){
                                    item.settingValue = '';
                                }
                            });
                        }
                        $that.communitySettingManageInfo.keys = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _saveCommunitySetting: function () {
                let _data = {
                    communityId:vc.getCurrentCommunity().communityId,
                    keys:$that.communitySettingManageInfo.keys,
                    settingType:$that.communitySettingManageInfo.conditions.settingType
                }
             
                vc.http.apiPost(
                    '/community.saveCommunitySetting',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.toast(_json.msg);
                            $that._loadCommunitySettingKey();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
        }
    });
})(window.vc);
