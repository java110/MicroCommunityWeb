(function(vc, vm) {

    vc.extends({
        data: {
            deleteCommunityPublicityInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteCommunityPublicity', 'openDeleteCommunityPublicityModal', function(_params) {

                $that.deleteCommunityPublicityInfo = _params;
                $('#deleteCommunityPublicityModel').modal('show');

            });
        },
        methods: {
            deleteCommunityPublicity: function() {
                $that.deleteCommunityPublicityInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/publicity.deleteCommunityPublicity',
                    JSON.stringify($that.deleteCommunityPublicityInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCommunityPublicityModel').modal('hide');
                            vc.emit('communityPublicityManage', 'listCommunityPublicity', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteCommunityPublicityModel: function() {
                $('#deleteCommunityPublicityModel').modal('hide');
            }
        }
    });

})(window.vc, window.$that);