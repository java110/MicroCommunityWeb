(function (vc, vm) {
    vc.extends({
        data: {
            deleteItemOutInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteItemOut', 'openDeleteItemOutModal', function (_params) {
                vc.component.deleteItemOutInfo = _params;
                $('#deleteItemOutModel').modal('show');
            });
        },
        methods: {
            deleteItemOut: function () {
                vc.component.deleteItemOutInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.post(
                    'deletePurchaseApply',
                    'delete',
                    JSON.stringify(vc.component.deleteItemOutInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteItemOutModel').modal('hide');
                            vc.emit('itemOutManage', 'listItemOut', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeDeleteItemOutModel: function () {
                $('#deleteItemOutModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
