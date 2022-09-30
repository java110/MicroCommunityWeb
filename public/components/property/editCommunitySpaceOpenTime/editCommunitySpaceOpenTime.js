(function(vc, vm) {

    vc.extends({
        data: {
            editCommunitySpaceOpenTimeInfo: {
                openTimes: []
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editCommunitySpaceOpenTime', 'openEditCommunitySpaceModal', function(_params) {
                $that.editCommunitySpaceOpenTimeInfo.openTimes = _params.openTimes;
                $('#editCommunitySpaceOpenTimeModel').modal('show');
            });
        },
        methods: {

            editCommunitySpaceOpenTime: function() {
                if (!vc.component.editCommunitySpaceOpenTimeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/communitySpace.updateCommunitySpace',
                    JSON.stringify(vc.component.editCommunitySpaceOpenTimeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCommunitySpaceOpenTimeModel').modal('hide');
                            vc.emit('communitySpaceManage', 'listCommunitySpace', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },

        }
    });

})(window.vc, window.vc.component);