(function (vc, vm) {
    vc.extends({
        data: {
            deleteRoleCommunityInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteRoleCommunity', 'openDeleteRoleCommunityModal', function (_params) {
                vc.component.deleteRoleCommunityInfo = _params;
                $('#deleteRoleCommunityModel').modal('show');
            });
        },
        methods: {
            deleteRoleCommunity: function () {
                vc.component.deleteRoleCommunityInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/roleCommunity.deleteRoleCommunity',
                    JSON.stringify(vc.component.deleteRoleCommunityInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteRoleCommunityModel').modal('hide');
                            vc.emit('roleCommunityInfo', 'listRoleCommunity', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    }
                );
            },
            closeDeleteRoleCommunityModel: function () {
                $('#deleteRoleCommunityModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
