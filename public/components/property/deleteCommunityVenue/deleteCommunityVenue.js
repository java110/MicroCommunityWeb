(function (vc, vm) {
    vc.extends({
        data: {
            deleteCommunityVenueInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteCommunityVenue', 'openDeleteCommunityVenueModal', function (_params) {
                vc.component.deleteCommunityVenueInfo = _params;
                $('#deleteCommunityVenueModel').modal('show');
            });
        },
        methods: {
            deleteCommunityVenue: function () {
                vc.component.deleteCommunityVenueInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/communityVenue.deleteCommunityVenue',
                    JSON.stringify(vc.component.deleteCommunityVenueInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCommunityVenueModel').modal('hide');
                            vc.emit('communitySpaceManage', 'listCommunityVenue', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteCommunityVenueModel: function () {
                $('#deleteCommunityVenueModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
