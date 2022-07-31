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
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteItemOutModel').modal('hide');
                            vc.emit('itemOutManage', 'listItemOut', {});
                            vc.toast(_json.msg);
                            return;
                        }else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteItemOutModel: function () {
                $('#deleteItemOutModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
