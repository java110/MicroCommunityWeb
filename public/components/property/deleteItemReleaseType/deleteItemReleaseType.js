(function (vc, vm) {
    vc.extends({
        data: {
            deleteItemReleaseTypeInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteItemReleaseType', 'openDeleteItemReleaseTypeModal', function (_params) {
                vc.component.deleteItemReleaseTypeInfo = _params;
                $('#deleteItemReleaseTypeModel').modal('show');
            });
        },
        methods: {
            deleteItemReleaseType: function () {
                vc.component.deleteItemReleaseTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/itemRelease.deleteItemReleaseType',
                    JSON.stringify(vc.component.deleteItemReleaseTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteItemReleaseTypeModel').modal('hide');
                            vc.emit('itemReleaseTypeManage', 'listItemReleaseType', {});
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
            closeDeleteItemReleaseTypeModel: function () {
                $('#deleteItemReleaseTypeModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
