(function (vc, vm) {
    vc.extends({
        data: {
            deleteItemReleaseInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteItemRelease', 'openDeleteItemReleaseModal', function (_params) {
                vc.component.deleteItemReleaseInfo = _params;
                $('#deleteItemReleaseModel').modal('show');
            });
        },
        methods: {
            deleteItemRelease: function () {
                vc.component.deleteItemReleaseInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'itemRelease.deleteItemRelease',
                    JSON.stringify(vc.component.deleteItemReleaseInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteItemReleaseModel').modal('hide');
                            vc.emit('itemReleaseManage', 'listItemRelease', {});
                            vc.toast('删除成功');
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
            closeDeleteItemReleaseModel: function () {
                $('#deleteItemReleaseModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
