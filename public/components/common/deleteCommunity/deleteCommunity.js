(function(vc, vm) {

    vc.extends({
        data: {
            deleteCommunityInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteCommunity', 'openDeleteCommunityModal', function(_params) {

                vc.component.deleteCommunityInfo = _params;
                $('#deleteCommunityModel').modal('show');

            });
        },
        methods: {
            deleteCommunity: function() {
                //vc.component.deleteCommunityInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/community.deleteCommunity',
                    JSON.stringify(vc.component.deleteCommunityInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteCommunityModel').modal('hide');
                            vc.emit('communityManage', 'listCommunity', {});
                            vc.emit('auditCommunityManage', 'listCommunity', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            closeDeleteCommunityModel: function() {
                $('#deleteCommunityModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);