(function (vc, vm) {
    vc.extends({
        data: {
            deleteMenuGroupCatalogInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteMenuGroupCatalog', 'openDeleteMenuGroupCatalogModal', function (_params) {
                vc.component.deleteMenuGroupCatalogInfo = _params;
                $('#deleteMenuGroupCatalogModel').modal('show');
            });
        },
        methods: {
            deleteMenuGroupCatalog: function () {
                vc.http.apiPost(
                    '/menuGroupCatalog.deleteMenuGroupCatalog',
                    JSON.stringify(vc.component.deleteMenuGroupCatalogInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMenuGroupCatalogModel').modal('hide');
                            vc.emit('menuGroupCatalogManage', 'listMenuGroupCatalog', {});
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
            closeDeleteMenuGroupCatalogModel: function () {
                $('#deleteMenuGroupCatalogModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);