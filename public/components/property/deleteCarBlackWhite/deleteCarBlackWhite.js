(function (vc, vm) {
    vc.extends({
        data: {
            deleteCarBlackWhiteInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteCarBlackWhite', 'openDeleteCarBlackWhiteModal', function (_params) {
                vc.component.deleteCarBlackWhiteInfo = _params;
                $('#deleteCarBlackWhiteModel').modal('show');
            });
        },
        methods: {
            deleteCarBlackWhite: function () {
                vc.component.deleteCarBlackWhiteInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/carBlackWhite.deleteCarBlackWhite',
                    JSON.stringify(vc.component.deleteCarBlackWhiteInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCarBlackWhiteModel').modal('hide');
                            vc.emit('carBlackWhiteManage', 'listCarBlackWhite', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeDeleteCarBlackWhiteModel: function () {
                $('#deleteCarBlackWhiteModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
