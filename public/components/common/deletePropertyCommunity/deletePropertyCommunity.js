(function(vc, vm) {

    vc.extends({
        data: {
            deletePropertyCommunityInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deletePropertyCommunity', 'openDeletePropertyCommunityModal', function(_params) {
                vc.component.deletePropertyCommunityInfo = _params;
                $('#deletePropertyCommunityModel').modal('show');
            });
        },
        methods: {
            deletePropertyCommunity: function() {
                //vc.component.deletePropertyCommunityInfo.communityId=vc.getCurrentPropertyCommunity().communityId;
                vc.http.apiPost(
                    '/member.quit.community',
                    JSON.stringify(vc.component.deletePropertyCommunityInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePropertyCommunityModel').modal('hide');
                            vc.emit('communityManage', 'listPropertyCommunity', {});
                            vc.emit('propertyCommunity', 'listCommunity', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);

                    });
            },
            closeDeletePropertyCommunityModel: function() {
                $('#deletePropertyCommunityModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);