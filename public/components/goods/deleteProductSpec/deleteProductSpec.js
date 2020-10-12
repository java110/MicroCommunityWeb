(function (vc, vm) {

    vc.extends({
        data: {
            deleteProductSpecInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteProductSpec', 'openDeleteProductSpecModal', function (_params) {

                vc.component.deleteProductSpecInfo = _params;
                $('#deleteProductSpecModel').modal('show');

            });
        },
        methods: {
            deleteProductSpec: function () {
                vc.http.apiPost(
                    '/product/deleteProductSpec',
                    JSON.stringify(vc.component.deleteProductSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteProductSpecModel').modal('hide');
                            vc.emit('productSpecManage', 'listProductSpec', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteProductSpecModel: function () {
                $('#deleteProductSpecModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
