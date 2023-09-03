(function (vc, vm) {
    vc.extends({
        data: {
            deleteFeePrintSpecInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteFeePrintSpec', 'openDeleteFeePrintSpecModal', function (_params) {
                vc.component.deleteFeePrintSpecInfo = _params;
                $('#deleteFeePrintSpecModel').modal('show');
            });
        },
        methods: {
            deleteFeePrintSpec: function () {
                vc.component.deleteFeePrintSpecInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/feePrintSpec/deleteFeePrintSpec',
                    JSON.stringify(vc.component.deleteFeePrintSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeePrintSpecModel').modal('hide');
                            vc.emit('feePrintSpecManage', 'listFeePrintSpec', {});
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
            closeDeleteFeePrintSpecModel: function () {
                $('#deleteFeePrintSpecModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
