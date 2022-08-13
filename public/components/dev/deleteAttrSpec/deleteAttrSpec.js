(function (vc, vm) {
    vc.extends({
        data: {
            deleteAttrSpecInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteAttrSpec', 'openDeleteAttrSpecModal', function (_params) {
                vc.component.deleteAttrSpecInfo = _params;
                $('#deleteAttrSpecModel').modal('show');
            });
        },
        methods: {
            deleteAttrSpec: function () {
                vc.http.apiPost(
                    '/attrSpec/deleteAttrSpec',
                    JSON.stringify(vc.component.deleteAttrSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteAttrSpecModel').modal('hide');
                            vc.emit('attrSpecManage', 'listAttrSpec', {});
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
            closeDeleteAttrSpecModel: function () {
                $('#deleteAttrSpecModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
