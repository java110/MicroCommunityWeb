(function (vc, vm) {
    vc.extends({
        data: {
            deleteCommunitySpaceInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteCommunitySpace', 'openDeleteCommunitySpaceModal', function (_params) {
                vc.component.deleteCommunitySpaceInfo = _params;
                $('#deleteCommunitySpaceModel').modal('show');
            });
        },
        methods: {
            deleteCommunitySpace: function () {
                vc.component.deleteCommunitySpaceInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/communitySpace.deleteCommunitySpace',
                    JSON.stringify(vc.component.deleteCommunitySpaceInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCommunitySpaceModel').modal('hide');
                            vc.emit('communitySpaceManage', 'listCommunitySpace', {});
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
            closeDeleteCommunitySpaceModel: function () {
                $('#deleteCommunitySpaceModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);