(function(vc, vm) {

    vc.extends({
        data: {
            deleteCommunitySpacePersonInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteCommunitySpacePerson', 'openDeleteCommunitySpacePersonModal', function(_params) {

                vc.component.deleteCommunitySpacePersonInfo = _params;
                $('#deleteCommunitySpacePersonModel').modal('show');

            });
        },
        methods: {
            deleteCommunitySpacePerson: function() {
                vc.component.deleteCommunitySpacePersonInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/communitySpace.deleteCommunitySpacePerson',
                    JSON.stringify(vc.component.deleteCommunitySpacePersonInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCommunitySpacePersonModel').modal('hide');
                            vc.emit('communitySpacePersonManage', 'listCommunitySpacePerson', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteCommunitySpacePersonModel: function() {
                $('#deleteCommunitySpacePersonModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);