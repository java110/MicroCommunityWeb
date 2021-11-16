/**
 小区设置 组件
 **/
(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            viewCommunitySettingInfo: {
                index: 0,
                flowComponent: 'viewCommunitySettingInfo',
                settingType: '',
                settingName: '',
                settingKey: '',
                settingValue: '',
                remark: '',

            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadCommunitySettingInfoData();
        },
        _initEvent: function () {
            vc.on('viewCommunitySettingInfo', 'chooseCommunitySetting', function (_app) {
                vc.copyObject(_app, vc.component.viewCommunitySettingInfo);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewCommunitySettingInfo);
            });

            vc.on('viewCommunitySettingInfo', 'onIndex', function (_index) {
                vc.component.viewCommunitySettingInfo.index = _index;
            });

        },
        methods: {

            _openSelectCommunitySettingInfoModel() {
                vc.emit('chooseCommunitySetting', 'openChooseCommunitySettingModel', {});
            },
            _openAddCommunitySettingInfoModel() {
                vc.emit('addCommunitySetting', 'openAddCommunitySettingModal', {});
            },
            _loadCommunitySettingInfoData: function () {

            }
        }
    });

})(window.vc);
