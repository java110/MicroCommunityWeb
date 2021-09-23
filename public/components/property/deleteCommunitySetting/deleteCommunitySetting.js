(function (vc, vm) {

    vc.extends({
        data: {
            deleteCommunitySettingInfo: {}
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteCommunitySetting', 'openDeleteCommunitySettingModal', function (_params) {

                vc.component.deleteCommunitySettingInfo = _params;
                $('#deleteCommunitySettingModel').modal('show');

            });
        },
        methods: {
            deleteCommunitySetting: function () {
                vc.component.deleteCommunitySettingInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/communitySetting/deleteCommunitySetting',
                    JSON.stringify(vc.component.deleteCommunitySettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCommunitySettingModel').modal('hide');
                            vc.emit('communitySettingManage', 'listCommunitySetting', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteCommunitySettingModel: function () {
                $('#deleteCommunitySettingModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
